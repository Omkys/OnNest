import nodemailer, { type Transporter } from "nodemailer";
import { env } from "../config/env";

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (!env.isSmtpConfigured) {
    throw new Error("Email service is not configured");
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }

  return transporter;
}

export async function verifySmtpConnection(): Promise<void> {
  if (!env.isSmtpConfigured) {
    console.warn("SMTP not configured — password reset emails are disabled");
    return;
  }

  await getTransporter().verify();
  console.log("SMTP connection verified");
}

export async function sendPasswordResetEmail(params: {
  to: string;
  firstName: string;
  resetUrl: string;
}): Promise<void> {
  if (!env.isSmtpConfigured) {
    throw new Error("Email service is not configured");
  }

  const { to, firstName, resetUrl } = params;
  const from = env.SMTP_FROM || env.SMTP_USER!;

  await getTransporter().sendMail({
    from,
    to,
    subject: "Reset your OnNests password",
    text: [
      `Hi ${firstName},`,
      "",
      "We received a request to reset your OnNests password.",
      "Click the link below to choose a new password. This link expires in 1 hour.",
      "",
      resetUrl,
      "",
      "If you did not request this, you can ignore this email.",
      "",
      "— OnNests",
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#0f172a">
        <h2 style="color:#0f766e;margin-bottom:8px">Reset your password</h2>
        <p>Hi ${firstName},</p>
        <p>We received a request to reset your OnNests password. Click the button below to choose a new one. This link expires in <strong>1 hour</strong>.</p>
        <p style="margin:28px 0">
          <a href="${resetUrl}" style="background:#0f766e;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:8px;display:inline-block;font-weight:600">
            Reset password
          </a>
        </p>
        <p style="font-size:13px;color:#64748b">Or copy this link:<br/><a href="${resetUrl}" style="color:#0f766e">${resetUrl}</a></p>
        <p style="font-size:13px;color:#64748b">If you did not request this, you can ignore this email.</p>
        <p style="margin-top:28px;font-size:13px;color:#94a3b8">— OnNests</p>
      </div>
    `,
  });
}
