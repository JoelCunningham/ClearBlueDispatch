import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth/require-user";

type UserRole = "DRIVER" | "MANAGER";

export async function requireRole(role: UserRole) {
  const user = await requireUser();

  if (user.role !== role) redirect("/routes");
  
  return user;
}
