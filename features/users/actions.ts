"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { render } from "react-email";

import NewUserEmail from "@/content/new-user-email";
import {
  changeOwnPasswordSchema,
  createUserSchema,
  resetUserPasswordSchema,
  updateOwnProfileSchema,
  updateUserSchema
} from "@/features/users/validation";
import { hashPassword, requireRole, requireUser, verifyPassword } from "@/lib/auth/authorization";
import { sendEmail } from "@/lib/email/sendEmail";
import { getLoginUrl, getLogoUrl } from "@/lib/utils/url-utils";
import { db } from "@/prisma/db";
import { ChangeOwnPasswordInput, CreateUserInput, ResetUserPasswordInput, UpdateOwnProfileInput, UpdateUserInput } from "./types";

export async function createUser(input: CreateUserInput) {
  await requireRole("MANAGER");

  const result = createUserSchema.safeParse(input);
  if (!result.success) return { success: false, error: result.error.issues[0]?.message ?? "Invalid user details." };

  const { name, email, role } = result.data;
  const trimmedEmail = email.trim().toLowerCase();

  const existingUser = await db.orm.public.User.where({ email: trimmedEmail }).first();
  if (existingUser) return { success: false, error: "That email address is already in use." };

  const password = await generateRandomPassword(12);
  const passwordHash = await hashPassword(password);
  const newUser = await db.orm.public.User.create({ name, email: trimmedEmail, role, passwordHash });

  try {
    await sendNewUserEmail(newUser.name, newUser.email, password);
  } catch (error) {
    console.error("Failed to send new user email:", error);
  }

  revalidatePath("/users");
  redirect(`/users/${newUser.id}`);
}

export async function updateUser(input: UpdateUserInput) {
  const manager = await requireRole("MANAGER");

  const result = updateUserSchema.safeParse(input);
  if (!result.success) return { success: false, error: result.error.issues[0]?.message ?? "Invalid user details." };

  const { userId, name, email, role } = result.data;
  const trimmedEmail = email.trim().toLowerCase();

  const existingUser = await db.orm.public.User.where({ id: userId }).first();
  if (!existingUser) return { success: false, error: "User not found." };
  if (existingUser.deleted) return { success: false, error: "User deleted." };

  const emailUser = await db.orm.public.User.where({ email: trimmedEmail }).first();
  if (emailUser && emailUser.id !== userId) {
    return { success: false, error: "That email address is already in use." };
  }

  if (existingUser.id === manager.id && role !== "MANAGER") {
    return { success: false, error: "You cannot remove your own manager role." };
  }

  const roleChanged = existingUser.role !== role;

  await db.orm.public.User.where({ id: userId }).update({
    name,
    email: trimmedEmail,
    role,
    ...(roleChanged ? { sessionVersion: existingUser.sessionVersion + 1 } : {})
  });

  revalidatePath("/users");
  revalidatePath(`/users/${userId}`);
  redirect(`/users/${userId}`);
}

export async function deleteUser(input: { userId: number }) {
  const manager = await requireRole("MANAGER");

  const { userId } = input;

  const user = await db.orm.public.User.where({ id: userId }).first();
  if (!user) return { success: false, error: "User not found." };
  if (user.deleted) return { success: false, error: "User already deleted." };

  if (user.id === manager.id) {
    return { success: false, error: "You cannot delete your own user profile." };
  }

  await db.orm.public.User.where({ id: userId }).update({ deleted: true, sessionVersion: user.sessionVersion + 1 });

  revalidatePath("/users");
  redirect("/users");
}

export async function restoreUser(input: { userId: number }) {
  const manager = await requireRole("MANAGER");

  const { userId } = input;

  const user = await db.orm.public.User.where({ id: userId }).first();
  if (!user) return { success: false, error: "User not found." };
  if (!user.deleted) return { success: false, error: "User is not deleted." };

  if (user.id === manager.id) {
    return { success: false, error: "You cannot restore your own user profile." };
  }

  await db.orm.public.User.where({ id: userId }).update({ deleted: false, sessionVersion: user.sessionVersion + 1 });

  revalidatePath("/users");
  redirect("/users");
}

export async function changeOwnPassword(input: ChangeOwnPasswordInput) {
  const sessionUser = await requireUser();

  const result = changeOwnPasswordSchema.safeParse(input);
  if (!result.success) return { success: false, error: result.error.issues[0]?.message ?? "Invalid password." };

  const { currentPassword, newPassword } = result.data;
  if (currentPassword === newPassword) return { success: false, error: "Your new password must be different from your current password." };

  const user = await db.orm.public.User.where({ id: sessionUser.id }).first();
  if (!user) return { success: false, error: "User not found." };
  if (user.deleted) return { success: false, error: "User deleted." };

  const valid = await verifyPassword(currentPassword, user.passwordHash);
  if (!valid) return { success: false, error: "Current password is incorrect." };

  const passwordHash = await hashPassword(newPassword);
  await db.orm.public.User.where({ id: user.id }).update({ passwordHash, sessionVersion: user.sessionVersion + 1 });

  revalidatePath("/profile");
  redirect("/profile");
}

export async function resetUserPassword(input: ResetUserPasswordInput) {
  await requireRole("MANAGER");

  const result = resetUserPasswordSchema.safeParse(input);
  if (!result.success) return { success: false, error: result.error.issues[0]?.message ?? "Invalid password." };

  const { userId, newPassword } = result.data;

  const user = await db.orm.public.User.where({ id: userId }).first();
  if (!user) return { success: false, error: "User not found." };
  if (user.deleted) return { success: false, error: "User deleted." };

  const passwordHash = await hashPassword(newPassword);
  await db.orm.public.User.where({ id: userId }).update({ passwordHash, sessionVersion: user.sessionVersion + 1 });

  revalidatePath("/users");
  revalidatePath(`/users/${userId}`);
  redirect(`/users/${userId}`);
}

export async function updateOwnProfile(input: UpdateOwnProfileInput) {
  const user = await requireUser();

  const result = updateOwnProfileSchema.safeParse(input);
  if (!result.success) return { success: false, error: result.error.issues[0]?.message ?? "Invalid user details." };

  const { name, email } = result.data;
  const trimmedEmail = email.trim().toLowerCase();

  const currentUserId = Number(user.id);
  const existingUser = await db.orm.public.User.where({ email: trimmedEmail }).first();

  if (existingUser && existingUser.id !== currentUserId) return { success: false, error: "That email address is already in use." };

  await db.orm.public.User.where({ id: currentUserId }).update({ name, email: trimmedEmail });

  revalidatePath("/profile");
  redirect(`/profile`);
}

async function sendNewUserEmail(userName: string, userEmail: string, userPassword: string) {
  const logoUrl = getLogoUrl();
  const loginUrl = getLoginUrl();

  const emailContent = await render(
    NewUserEmail({ userName: userName, userEmail: userEmail, userPassword: userPassword, loginUrl: loginUrl, logoUrl: logoUrl })
  );
  await sendEmail({ to: userEmail, subject: "Welcome to ClearBlue Solutions", html: emailContent });
}

async function generateRandomPassword(length: number): Promise<string> {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
  let password = "";
  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);
  for (let i = 0; i < length; i++) {
    password += charset[randomValues[i] % charset.length];
  }
  return password;
}
