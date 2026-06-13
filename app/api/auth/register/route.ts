import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendOtpEmail } from "@/lib/email/smtp";
import { createAdminClient } from "@/lib/supabase/admin";
import { sanitizeInput, validatePassword } from "@/utils/security";
import { getAppUrl } from "@/utils/url";

export const runtime = "nodejs";

const registerSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email(),
  password: z.string(),
});

type SupabaseAdminClient = ReturnType<typeof createAdminClient>;

function getPublicError(error: unknown) {
  const message = error instanceof Error ? error.message : "";

  if (
    message.includes("SMTP_") ||
    message.includes("SUPABASE_SERVICE_ROLE_KEY") ||
    message.includes("NEXT_PUBLIC_SUPABASE_URL")
  ) {
    return "Email service is not configured. Check SMTP and Supabase service-role environment variables.";
  }

  if (
    message.includes("relation \"public.users\" does not exist") ||
    message.includes("relation \"public.wellness_streaks\" does not exist")
  ) {
    return "Database tables are not configured. Run supabase/schema.sql in the Supabase SQL Editor.";
  }

  return "Failed to create account. Please try again.";
}

function isAlreadyRegisteredError(error: unknown) {
  const message = error instanceof Error ? error.message.toLowerCase() : "";
  return message.includes("already") && message.includes("registered");
}

function isConfirmedUser(user: { confirmed_at?: string | null; email_confirmed_at?: string | null }) {
  return Boolean(user.confirmed_at || user.email_confirmed_at);
}

async function findAuthUserByEmail(supabase: SupabaseAdminClient, email: string) {
  const perPage = 1000;
  let page = 1;

  while (page) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });

    if (error) {
      throw error;
    }

    const user = data.users.find(
      (candidate) => candidate.email?.toLowerCase() === email
    );

    if (user || !data.nextPage) {
      return user ?? null;
    }

    page = data.nextPage;
  }

  return null;
}

async function createSignupVerificationLink({
  supabase,
  email,
  name,
  password,
  redirectToUrl,
}: {
  supabase: SupabaseAdminClient;
  email: string;
  name: string;
  password: string;
  redirectToUrl: string;
}) {
  return supabase.auth.admin.generateLink({
    type: "signup",
    email,
    password,
    options: {
      data: { name },
      redirectTo: redirectToUrl,
    },
  });
}

async function ensureUserRecords({
  supabase,
  userId,
  name,
  email,
}: {
  supabase: SupabaseAdminClient;
  userId: string;
  name: string;
  email: string;
}) {
  const { error: profileError } = await supabase.from("users").upsert(
    {
      id: userId,
      name,
      email,
    },
    { onConflict: "id" }
  );

  if (profileError) {
    throw profileError;
  }

  const { error: streakError } = await supabase.from("wellness_streaks").upsert(
    {
      user_id: userId,
      current_streak: 0,
      longest_streak: 0,
    },
    { onConflict: "user_id" }
  );

  if (streakError) {
    throw streakError;
  }
}

export async function POST(request: NextRequest) {
  let createdUserId: string | undefined;
  let supabase: SupabaseAdminClient | undefined;

  try {
    supabase = createAdminClient();
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid registration data" }, { status: 400 });
    }

    const passwordCheck = validatePassword(parsed.data.password);
    if (!passwordCheck.valid) {
      return NextResponse.json({ error: passwordCheck.message }, { status: 400 });
    }

    const name = sanitizeInput(parsed.data.name);
    const email = parsed.data.email.toLowerCase();
    const redirectToUrl = getAppUrl("/login", request.nextUrl.origin);
    let { data, error } = await createSignupVerificationLink({
      supabase,
      email,
      name,
      password: parsed.data.password,
      redirectToUrl,
    });

    if (isAlreadyRegisteredError(error)) {
      const existingUser = await findAuthUserByEmail(supabase, email);

      if (existingUser && !isConfirmedUser(existingUser)) {
        const { error: deleteError } = await supabase.auth.admin.deleteUser(existingUser.id);

        if (deleteError) {
          throw deleteError;
        }

        const retry = await createSignupVerificationLink({
          supabase,
          email,
          name,
          password: parsed.data.password,
          redirectToUrl,
        });
        data = retry.data;
        error = retry.error;
      }
    }

    if (error) {
      if (isAlreadyRegisteredError(error)) {
        return NextResponse.json(
          { error: "An account with this email already exists. Please sign in or reset your password." },
          { status: 409 }
        );
      }

      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data.properties?.email_otp || !data.user?.id) {
      throw new Error("Supabase did not return a signup verification code");
    }

    createdUserId = data.user.id;

    await ensureUserRecords({
      supabase,
      userId: createdUserId,
      name,
      email,
    });

    await sendOtpEmail({
      to: email,
      subject: "Verify your MindWell account",
      title: "Verify your email address",
      intro: "Enter this code in MindWell to verify your email address and finish creating your account.",
      otp: data.properties.email_otp,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (createdUserId && supabase) {
      const { error: deleteError } = await supabase.auth.admin.deleteUser(createdUserId);
      if (deleteError) {
        console.error("Failed to roll back unverified signup:", deleteError);
      }
    }

    console.error("Register email error:", error);
    return NextResponse.json({ error: getPublicError(error) }, { status: 500 });
  }
}
