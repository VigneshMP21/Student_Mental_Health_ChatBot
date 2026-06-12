import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendAuthEmail } from "@/lib/email/smtp";
import { createAdminClient } from "@/lib/supabase/admin";
import { sanitizeInput, validatePassword } from "@/utils/security";
import { getAppUrl } from "@/utils/url";

export const runtime = "nodejs";

const registerSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email(),
  password: z.string(),
});

function getPublicError(error: unknown) {
  const message = error instanceof Error ? error.message : "";

  if (
    message.includes("SMTP_") ||
    message.includes("SUPABASE_SERVICE_ROLE_KEY") ||
    message.includes("NEXT_PUBLIC_SUPABASE_URL")
  ) {
    return "Email service is not configured. Check SMTP and Supabase service-role environment variables.";
  }

  return "Failed to create account. Please try again.";
}

export async function POST(request: NextRequest) {
  let createdUserId: string | undefined;
  const supabase = createAdminClient();

  try {
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
    const { data, error } = await supabase.auth.admin.generateLink({
      type: "signup",
      email,
      password: parsed.data.password,
      options: {
        data: { name },
        redirectTo: getAppUrl("/login"),
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data.properties?.action_link || !data.user?.id) {
      throw new Error("Supabase did not return a signup verification link");
    }

    createdUserId = data.user.id;

    await sendAuthEmail({
      to: email,
      subject: "Verify your MindWell account",
      title: "Verify your email address",
      intro: "Use the secure link below to verify your email address and finish creating your MindWell account.",
      buttonText: "Verify account",
      actionUrl: data.properties.action_link,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (createdUserId) {
      const { error: deleteError } = await supabase.auth.admin.deleteUser(createdUserId);
      if (deleteError) {
        console.error("Failed to roll back unverified signup:", deleteError);
      }
    }

    console.error("Register email error:", error);
    return NextResponse.json({ error: getPublicError(error) }, { status: 500 });
  }
}
