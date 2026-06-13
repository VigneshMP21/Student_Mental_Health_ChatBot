import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendOtpEmail } from "@/lib/email/smtp";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const forgotPasswordSchema = z.object({
  email: z.string().trim().email(),
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

  return "Failed to send reset code. Please try again.";
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = forgotPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const email = parsed.data.email.toLowerCase();
    const supabase = createAdminClient();
    const user = await findAuthUserByEmail(supabase, email);

    if (!user) {
      return NextResponse.json(
        { error: "No account found with this email address." },
        { status: 404 }
      );
    }

    const { data, error } = await supabase.auth.admin.generateLink({
      type: "recovery",
      email,
    });

    if (error) {
      throw error;
    }

    if (!data.properties?.email_otp) {
      throw new Error("Supabase did not return a password reset code");
    }

    await sendOtpEmail({
      to: email,
      subject: "Reset your MindWell password",
      title: "Reset your password",
      intro: "Enter this code in MindWell to verify your account before choosing a new password.",
      otp: data.properties.email_otp,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Forgot password email error:", error);
    return NextResponse.json({ error: getPublicError(error) }, { status: 500 });
  }
}
