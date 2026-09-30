import { createHash } from "crypto";

import { db } from "@/prisma/db";

export async function getUserInvitation(token?: string) {
  if (!token) return null;
  const loginTokenHash = createHash("sha256").update(token).digest("hex");

  const user = await db.orm.public.User.where({ loginTokenHash }).first();
  if (!user) return null;

  return user;
}
