"use server";

import bcrypt from "bcryptjs";

import { changeOwnPasswordSchema, resetUserPasswordSchema, updateUserSchema } from "@/features/users/validation";
import { requireRole } from "@/lib/auth/authorization";
import { requireUser } from "@/lib/auth/authorization";

import { db } from "@/prisma/db";
import { ChangeOwnPasswordInput, ResetUserPasswordInput, UpdateOwnProfileInput, UpdateUserInput } from "./types";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function updateUser(input: UpdateUserInput) {
  const manager = await requireRole("MANAGER");

  const result = updateUserSchema.safeParse(input);
  if (!result.success) {
    return { success: false, error: result.error.issues[0]?.message ?? "Invalid user details." };
  }

  const { userId, name, email, role } = result.data;

  const existingUser = await db.orm.public.User.where({ id: userId }).first();
  if (!existingUser) {
    return { success: false, error: "User not found." };
  }

  const emailUser = await db.orm.public.User.where({ email }).first();
  if (emailUser && emailUser.id !== userId) {
    return { success: false, error: "That email address is already in use." };
  }

  if (existingUser.id === manager.id && role !== "MANAGER") {
    return { success: false, error: "You cannot remove your own manager role." };
  }

  await db.orm.public.User.where({ id: userId }).update({ name, email, role });

  revalidatePath(`/manage/users/${userId}`);
  redirect(`/manage/users/${userId}`);
}

export async function changeOwnPassword(input: ChangeOwnPasswordInput) {
  const sessionUser = await requireUser();

  const result = changeOwnPasswordSchema.safeParse(input);

  if (!result.success) {
    return { success: false, error: result.error.issues[0]?.message ?? "Invalid password." };
  }

  const { currentPassword, newPassword } = result.data;
  if (currentPassword === newPassword) {
    return { success: false, error: "Your new password must be different from your current password." };
  }

  const user = await db.orm.public.User.where({ id: sessionUser.id }).first();
  if (!user) {
    return { success: false, error: "User not found." };
  }

  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) {
    return { success: false, error: "Current password is incorrect." };
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await db.orm.public.User.where({ id: user.id }).update({ passwordHash });

  revalidatePath("/profile");
  redirect("/profile");
}

export async function resetUserPassword(input: ResetUserPasswordInput) {
  const result = resetUserPasswordSchema.safeParse(input);

  if (!result.success) {
    return { success: false, error: result.error.issues[0]?.message ?? "Invalid password." };
  }

  const { userId, newPassword } = result.data;

  const user = await db.orm.public.User.where({ id: userId }).first();
  if (!user) {
    return { success: false, error: "User not found." };
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await db.orm.public.User.where({ id: userId }).update({ passwordHash });

  revalidatePath(`/manage/users/${userId}`);
  redirect(`/manage/users/${userId}`);
}

export async function updateOwnProfile(input: UpdateOwnProfileInput) {
  const user = await requireUser();

  const result = updateUserSchema.safeParse(input);
  if (!result.success) {
    return { success: false, error: result.error.issues[0]?.message ?? "Invalid user details." };
  }

  const { name, email } = result.data;

  const existingUser = await db.orm.public.User.where({ email }).first();
  const currentUserId = Number(user.id);

  if (existingUser && existingUser.id !== currentUserId) {
    return { success: false, error: "That email address is already in use." };
  }

  await db.orm.public.User.where({ id: user.id }).update({ name, email });

  revalidatePath("/profile");
  redirect(`/profile`);
}
