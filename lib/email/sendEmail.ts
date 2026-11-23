import nodemailer from "nodemailer";
import { logError, logServerEvent } from "@/lib/utils/logger";

type SendEmailInput = {
  to: string | string[];
  subject: string;
  html: string;
  bcc?: string | string[];
  attachments?: SendEmailAttachment[];
};

type SendEmailAttachment = {
  filename: string;
  content: Buffer;
  contentType?: string;
};

function getRecipients(value: string | string[]): string[] {
  return Array.isArray(value) ? value : [value];
}

function getPreviewRecipients(): string[] {
  const value = process.env.PREVIEW_EMAIL_RECIPIENTS;
  if (!value) return [];

  return value
    .split(",")
    .map(recipient => recipient.trim())
    .filter(Boolean);
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD
  }
});

export async function sendEmail({ to, subject, html, bcc, attachments }: SendEmailInput) {
  if (process.env.ENABLE_EMAIL_NOTIFICATIONS !== "true") {
    logServerEvent("info", "email.skipped", { reason: "notifications_disabled", subject, recipientCount: getRecipients(to).length });
    return;
  }

  if (!process.env.SMTP_FROM) throw new Error("SMTP_FROM is not configured.");
  if (!process.env.SMTP_HOST) throw new Error("SMTP_HOST is not configured.");
  if (!process.env.SMTP_USERNAME) throw new Error("SMTP_USERNAME is not configured.");
  if (!process.env.SMTP_PASSWORD) throw new Error("SMTP_PASSWORD is not configured.");

  const startedAt = Date.now();
  try {
    if (process.env.VERCEL_ENV === "preview") {
      const previewRecipients = getPreviewRecipients();
      if (previewRecipients.length === 0) throw new Error("PREVIEW_EMAIL_RECIPIENTS is not configured.");

      await transporter.sendMail({ from: process.env.SMTP_FROM, to: previewRecipients, bcc: undefined, subject, html, attachments });
    } else {
      const toRecipients = getRecipients(to);
      const bccRecipients = bcc ? getRecipients(bcc) : undefined;

      await transporter.sendMail({ from: process.env.SMTP_FROM, to: toRecipients, bcc: bccRecipients, subject, html, attachments });
    }

    logServerEvent("info", "email.sent", {
      subject,
      recipientCount: getRecipients(to).length,
      attachmentCount: attachments?.length ?? 0,
      durationMs: Date.now() - startedAt
    });
  } catch (error) {
    logError("email.send_failed", error, {
      subject,
      recipientCount: getRecipients(to).length,
      attachmentCount: attachments?.length ?? 0,
      durationMs: Date.now() - startedAt
    });
    throw error;
  }
}
