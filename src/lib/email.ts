// /src/lib/email.ts
/**
 * Minimal Nodemailer transport + helper to send a verification link.
 * For development, you can use Mailtrap or any test SMTP.
 *
 * Required ENV:
 * - SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
 * - EMAIL_FROM (e.g., "Pro Next <no-reply@example.com>")
 */

import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST ?? "";
const SMTP_PORT = Number(process.env.SMTP_PORT ?? "587");
const SMTP_USER = process.env.SMTP_USER ?? "";
const SMTP_PASS = process.env.SMTP_PASS ?? "";
const FROM_EMAIL = process.env.EMAIL_FROM ?? "no-reply@example.com";

function getTransport() {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    throw new Error(
      "[email] Missing SMTP credentials. Set SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS/EMAIL_FROM in .env",
    );
  }
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

/** Send a verification email containing an activation link. */
export async function sendEmailVerificationLink(to: string, url: string): Promise<void> {
  const transporter = getTransport();

  const html = `
    <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto">
      <h2>Verify your email</h2>
      <p>Thanks for signing up. Please click the link below to verify your email address:</p>
      <p><a href="${url}" target="_blank" rel="noreferrer">Verify my email</a></p>
      <p style="color:#667085;font-size:13px">If you didn’t request this, you can safely ignore this message.</p>
    </div>
  `;

  await transporter.sendMail({
    to,
    from: FROM_EMAIL,
    subject: "Verify your email",
    html,
  });
}
