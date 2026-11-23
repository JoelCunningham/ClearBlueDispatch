import { createHash, randomBytes } from "crypto";
import { render } from "react-email";

import { signIn } from "@/auth";
import ResetPasswordEmail from "@/content/reset-password-email";
import { hashPassword } from "@/lib/auth/authorization";
import { sendEmail } from "@/lib/email/sendEmail";
import { getValidationResult } from "@/lib/utils/action-utils";
import { getFuture, getToday } from "@/lib/utils/date-utils";
import { getLoginUrl, getLogoUrl } from "@/lib/utils/url-utils";
import { db } from "@/prisma/db";
import { logError, logServerEvent } from "@/lib/utils/logger";
import { ResetPasswordInput, SetupPasswordInput } from "./types";
import { resetPasswordSchema, setupPasswordSchema } from "./validation";

export async function setupPassword(input: SetupPasswordInput) {
  const startedAt = Date.now();
  const result = setupPasswordSchema.safeParse(input);
  if (!result.success) return getValidationResult(result.error, "Invalid password.");

  const { userId, password, confirmPassword, callbackUrl } = result.data;

  const user = await db.orm.public.User.where({ id: userId }).first();
  if (!user) return { success: false, error: "This invitation link is invalid." };

  if (Temporal.Instant.compare(user.loginTokenExpiry, getToday()) < 0) {
    return { success: false, error: "This invitation link has expired." };
  }
  if (password !== confirmPassword) return { success: false, error: "Passwords do not match." };

  try {
    const passwordHash = await hashPassword(password);
    await db.orm.public.User.where({ id: user.id }).update({ passwordHash, loginTokenHash: "", loginTokenExpiry: getFuture(-1) });

    await signIn("credentials", { email: user.email, password: input.password, redirectTo: callbackUrl });
  } catch (error) {
    logError("auth.password_setup_failed", error, { userId: user.id, durationMs: Date.now() - startedAt });
    throw error;
  }
  logServerEvent("info", "auth.password_setup_succeeded", { userId: user.id, durationMs: Date.now() - startedAt });
  return { success: true };
}

export async function resetPassword(input: ResetPasswordInput) {
  const startedAt = Date.now();
  const result = resetPasswordSchema.safeParse(input);
  if (!result.success) return getValidationResult(result.error, "Invalid email.");

  const user = await db.orm.public.User.where({ email: input.email }).first();
  if (!user) {
    logServerEvent("info", "auth.password_reset_requested", { result: "unknown_account", durationMs: Date.now() - startedAt });
    return { success: false, error: "No account found with that email address." };
  }

  const token = randomBytes(32).toString("hex");
  const loginTokenHash = createHash("sha256").update(token).digest("hex");
  const loginTokenExpiry = getFuture(2);

  await db.orm.public.User.where({ id: user.id }).update({ loginTokenHash, loginTokenExpiry });

  try {
    await sendResetPasswordEmail(user.name, user.email, token);
  } catch (error) {
    logError("auth.password_reset_email_failed", error, { userId: user.id, durationMs: Date.now() - startedAt });
  }

  logServerEvent("info", "auth.password_reset_requested", { result: "token_created", userId: user.id, durationMs: Date.now() - startedAt });
  return { success: true };
}

async function sendResetPasswordEmail(userName: string, userEmail: string, token: string) {
  const logoUrl = getLogoUrl();
  const loginUrl = getLoginUrl(token);

  const emailContent = await render(ResetPasswordEmail({ userName: userName, loginUrl: loginUrl, logoUrl: logoUrl }));
  await sendEmail({ to: userEmail, subject: "ClearBlue Solutions - Reset your password", html: emailContent });
}
