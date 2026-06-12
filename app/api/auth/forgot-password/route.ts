import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendAuthEmail } from "@/lib/email/smtp";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAppUrl } from "@/utils/url";

export const runtime = "nodejs";

const forgotPasswordSchema = z.object({
  email: z.string().trim().email(),
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

  return "Failed to send reset link. Please try again.";
}

function isUnknownUserError(error: unknown) {
  const message = error instanceof Error ? error.message.toLowerCase() : "";
  return message.includes("not found") || message.includes("does not exist");
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
    const redirectToUrl = getAppUrl("/reset-password");
    console.log("Forgot password generateLink redirect URL:", redirectToUrl);
    const { data, error } = await supabase.auth.admin.generateLink({
      type: "recovery",
      email,
      options: {
        redirectTo: redirectToUrl,
      },
    });
    console.log("Forgot password generated action_link:", data?.properties?.action_link);

    if (error) {
      if (isUnknownUserError(error)) {
        return NextResponse.json({ success: true });
      }

      throw error;
    }

    if (!data.properties?.action_link) {
      throw new Error("Supabase did not return a password recovery link");
    }

    await sendAuthEmail({
      to: email,
      subject: "Reset your MindWell password",
      title: "Reset your password",
      intro: "Use the secure link below to choose a new password for your MindWell account.",
      buttonText: "Reset password",
      actionUrl: data.properties.action_link,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Forgot password email error:", error);
    return NextResponse.json({ error: getPublicError(error) }, { status: 500 });
  }
}
