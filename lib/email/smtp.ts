import "server-only";

import nodemailer from "nodemailer";

type AuthEmailParams = {
  to: string;
  subject: string;
  title: string;
  intro: string;
  buttonText: string;
  actionUrl: string;
};

function getRequiredEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is required`);
  }

  return value;
}

function getSmtpSecure(port: number) {
  const configured = process.env.SMTP_SECURE?.trim().toLowerCase();

  if (configured) {
    return ["1", "true", "yes"].includes(configured);
  }

  return port === 465;
}

function getSmtpPort() {
  const port = Number(process.env.SMTP_PORT || "587");

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("SMTP_PORT must be a valid port number");
  }

  return port;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function createTransport() {
  const port = getSmtpPort();
  const user = getRequiredEnv("SMTP_USER");
  const pass = getRequiredEnv("SMTP_PASS");

  return nodemailer.createTransport({
    host: getRequiredEnv("SMTP_HOST"),
    port,
    secure: getSmtpSecure(port),
    auth: {
      user,
      pass,
    },
  });
}

export async function sendAuthEmail({
  to,
  subject,
  title,
  intro,
  buttonText,
  actionUrl,
}: AuthEmailParams) {
  const appName = process.env.APP_NAME?.trim() || "MindWell";
  const from = process.env.SMTP_FROM?.trim() || `${appName} <${getRequiredEnv("SMTP_USER")}>`;
  const escapedActionUrl = escapeHtml(actionUrl);
  const escapedAppName = escapeHtml(appName);

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin:0;background:#f8fafc;color:#0f172a;font-family:Arial,sans-serif;">
    <div style="max-width:560px;margin:0 auto;padding:32px 16px;">
      <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;padding:32px;">
        <p style="margin:0 0 16px;color:#2563eb;font-size:14px;font-weight:700;">${escapedAppName}</p>
        <h1 style="margin:0 0 12px;font-size:24px;line-height:1.3;color:#0f172a;">${escapeHtml(title)}</h1>
        <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#475569;">${escapeHtml(intro)}</p>
        <a href="${escapedActionUrl}" style="display:inline-block;border-radius:12px;background:#2563eb;color:#ffffff;padding:12px 18px;text-decoration:none;font-size:14px;font-weight:700;">${escapeHtml(buttonText)}</a>
        <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#64748b;">If the button does not work, copy and paste this link into your browser:</p>
        <p style="margin:8px 0 0;word-break:break-all;font-size:13px;line-height:1.6;color:#2563eb;">${escapedActionUrl}</p>
      </div>
    </div>
  </body>
</html>`;

  const text = `${title}

${intro}

${buttonText}: ${actionUrl}

If you did not request this email, you can ignore it.`;

  await createTransport().sendMail({
    from,
    to,
    subject,
    html,
    text,
  });
}
