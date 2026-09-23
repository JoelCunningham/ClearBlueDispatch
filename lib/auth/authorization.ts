import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { db } from "@/prisma/db";
import { UserRole } from "@/types/next-auth";

export async function requireUser() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await db.orm.public.User.first({ id: Number(session.user.id) });
  if (!user) redirect("/login");

  if (user.sessionVersion !== session.user.sessionVersion) redirect("/login");

  return session.user;
}
export async function requireRole(role: UserRole) {
  const user = await requireUser();
  if (user.role !== role) redirect("/routes");
  return user;
}

export async function checkUser() {
  const session = await auth();
  if (!session?.user) return null;
  return session.user;
}

export async function checkUserRole() {
  const user = await checkUser();
  if (!user) return null;
  return user.role;
}

export async function requireRouteAccess(routeId: number) {
  const user = await requireUser();
  const route = await db.orm.public.Route.first({ id: routeId });

  if (!route) return null;

  const hasAccess = user.role === "MANAGER" || route.assignedUserId.toString() === user.id;

  if (!hasAccess) redirect("/routes");

  return route;
}
