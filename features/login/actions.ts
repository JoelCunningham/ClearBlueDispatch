import { signIn } from "@/auth";
import { hashPassword } from "@/lib/auth/authorization";
import { getToday } from "@/lib/utils/date-utils";
import { db } from "@/prisma/db";
import { SetupPasswordInput } from "./types";
import { setupPasswordSchema } from "./validation";

export async function setupPassword(input: SetupPasswordInput) {
  const result = setupPasswordSchema.safeParse(input);
  if (!result.success) return { success: false, error: result.error.issues[0]?.message ?? "Invalid password." };

  const { userId, password, confirmPassword, callbackUrl } = result.data;

  const user = await db.orm.public.User.where({ id: userId }).first();
  if (!user) return { success: false, error: "This invitation link is invalid." };

  if (Temporal.Instant.compare(user.loginTokenExpiry, getToday()) < 0) {
    return { success: false, error: "This invitation link has expired." };
  }
  if (user.passwordHash) return { success: false, error: "This invitation link has already been used." };
  if (password !== confirmPassword) return { success: false, error: "Passwords do not match." };

  const passwordHash = await hashPassword(password);
  await db.orm.public.User.where({ id: user.id }).update({ passwordHash });

  await signIn("credentials", { email: user.email, password: input.password, redirectTo: callbackUrl });
  return { success: true };
}
