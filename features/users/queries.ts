import { db } from "@/prisma/db";

import { UserSummary } from "./types";

export async function getUsers(): Promise<UserSummary[]> {
  const users = await db.orm.public.User.orderBy(user => user.name.asc()).all();

  return users.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  }));
}

export async function getUser(userId: number): Promise<UserSummary | null> {
  const user = await db.orm.public.User.where({ id: userId }).first();
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  };
}
