import nodemailer from "nodemailer";

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
  const from = process.env.SMTP_FROM;

  if (!from) throw new Error("SMTP_FROM is not configured.");
  if (!process.env.SMTP_HOST) throw new Error("SMTP_HOST is not configured.");
  if (!process.env.SMTP_USERNAME) throw new Error("SMTP_USERNAME is not configured.");
  if (!process.env.SMTP_PASSWORD) throw new Error("SMTP_PASSWORD is not configured.");

  await transporter.sendMail({ from, to: getRecipients(to), bcc: bcc ? getRecipients(bcc) : undefined, subject, html, attachments });
}
