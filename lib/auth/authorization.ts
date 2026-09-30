import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { db } from "@/prisma/db";
import { UserRole } from "@/types/next-auth";

export async function checkUser() {
  const session = await auth();
  if (!session?.user) return null;

  const userId = Number(session.user.id);
  if (!Number.isSafeInteger(userId)) return null;

  const user = await db.orm.public.User.first({ id: userId });
  if (!user || user.deleted || user.sessionVersion !== session.user.sessionVersion) return null;

  return session.user;
}

export async function checkUserRole() {
  const user = await checkUser();
  if (!user) return null;
  return user.role;
}

export async function requireUser() {
  const user = await checkUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireRole(role: UserRole) {
  const user = await requireUser();
  if (user.role !== role) redirect("/routes");
  return user;
}

export async function requireRouteAccess(routeId: number) {
  const user = await requireUser();
  const route = await db.orm.public.Route.first({ id: routeId });

  if (!route) return null;

  const hasAccess = user.role === "MANAGER" || route.assignedUserId.toString() === user.id;

  if (!hasAccess) redirect("/routes");

  return route;
}

export async function requireDeliveryAccess(deliveryId: number) {
  const delivery = await db.orm.public.Delivery.where({ id: deliveryId, deleted: false }).include("route").first();
  if (!delivery?.route) return null;

  await requireRouteAccess(delivery.route.id);
  return delivery;
}

export async function requireDocketAccess(docketId: number) {
  const docket = await db.orm.public.Docket.where({ id: docketId, deleted: false })
    .include("delivery", delivery => delivery.include("route"))
    .first();
  if (!docket?.delivery?.route) return null;

  await requireRouteAccess(docket.delivery.route.id);
  return docket;
}

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, passwordHash: string | null) {
  if (!passwordHash) return false;
  return await bcrypt.compare(password, passwordHash);
}
