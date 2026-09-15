import { redirect } from "next/navigation";

import { db } from "@/prisma/db";
import { requireUser } from "@/lib/auth/require-user";

export async function requireRouteAccess(routeId: number) {
  const user = await requireUser();
  const route = await db.orm.public.Route.first({ id: routeId });

  if (!route) return null;

  const hasAccess = user.role === "MANAGER" || route.assignedUserId.toString() === user.id;

  if (!hasAccess) redirect("/routes");

  return route;
}
