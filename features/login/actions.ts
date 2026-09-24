import { hashPassword, verifyPassword } from "@/lib/auth/authorization";
import { db } from "@/prisma/db";
import { revalidatePath } from "next/cache";
import { LoginUserInput, SetPasswordInput } from "./types";
import { loginUserSchema, setPasswordSchema } from "./validation";

export async function isFirstTimeLogin(input: LoginUserInput): Promise<boolean> {
  const result = loginUserSchema.safeParse(input);
  if (!result.success) return false;

  const { email } = result.data;

  const user = await db.orm.public.User.where({ email, deleted: false }).first();
  if (!user) return false;

  return user.firstLogin;
}

export async function setPassword(input: SetPasswordInput): Promise<{ success: boolean; error?: string }> {
  const result = setPasswordSchema.safeParse(input);
  if (!result.success) return { success: false, error: result.error.issues[0]?.message ?? "Invalid password." };

  const { email, password, newPassword } = result.data;
  if (password === newPassword) return { success: false, error: "Your new password must be different from your current password." };

  const user = await db.orm.public.User.where({ email, deleted: false }).first();
  if (!user) return { success: false, error: "User not found." };

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return { success: false, error: "Current password is incorrect." };

  const passwordHash = await hashPassword(newPassword);
  await db.orm.public.User.where({ id: user.id, deleted: false }).update({
    passwordHash,
    sessionVersion: user.sessionVersion + 1,
    firstLogin: false
  });

  revalidatePath("/login");
  return { success: true };
}
