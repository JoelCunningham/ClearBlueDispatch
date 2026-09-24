import { db } from "@/prisma/db";
import { requireUser } from "@/lib/auth/authorization";

import type { RouteDetail, RouteSummary, UserSummary } from "./types";
import { requireRouteAccess } from "@/lib/auth/authorization";
import { requireRole } from "@/lib/auth/authorization";

type GetRoutesOptions = {
  fromDate?: Temporal.Instant;
  assignedUserId?: number;
};

export async function getRoutes(options: GetRoutesOptions): Promise<RouteSummary[]> {
  const user = await requireUser();
  let query = db.orm.public.Route.include("assignedUser")
    .orderBy(route => route.date.desc())
    .orderBy(route => route.assignedUserId.desc());

  if (options.fromDate) {
    query = query.where(route => route.date.gte(options.fromDate!));
  }

  if (user.role === "DRIVER") {
    query = query.where({ assignedUserId: Number(user.id) });
  } else if (options.assignedUserId !== undefined) {
    query = query.where({ assignedUserId: options.assignedUserId });
  }

  const routes = await query.all();
  return routes.map(route => ({
    id: route.id,
    assignedUserId: route.assignedUserId,
    assignedUserName: route.assignedUser?.name,
    assignedUserDeleted: route.assignedUser?.deleted,
    date: route.date
  }));
}

export async function getRoute(routeId: number): Promise<RouteDetail | null> {
  const route = await requireRouteAccess(routeId);
  if (!route) return null;

  const routeWithDetails = await db.orm.public.Route.where({ id: routeId }).include("assignedUser").include("deliveries").first();

  if (!routeWithDetails) return null;

  const deliveries = [...routeWithDetails.deliveries].sort((a, b) => a.position - b.position);
  const locations = await Promise.all(
    deliveries.map(delivery => db.orm.public.Location.where({ id: delivery.locationId, deleted: false }).include("customer").first())
  );

  return {
    id: routeWithDetails.id,
    date: routeWithDetails.date,
    user: {
      id: routeWithDetails.assignedUser.id,
      name: routeWithDetails.assignedUser.name,
      deleted: routeWithDetails.assignedUser.deleted
    },
    deliveries: deliveries.map((delivery, index) => {
      const location = locations[index];

      if (!location) throw new Error(`Location ${delivery.locationId} not found.`);

      return {
        id: delivery.id,
        position: delivery.position,
        location: {
          id: location.id,
          address: location.address,
          customerName: location.customer.name
        }
      };
    })
  };
}

export async function getUsers(): Promise<UserSummary[]> {
  await requireRole("MANAGER");

  const users = await db.orm.public.User.where({ deleted: false })
    .orderBy(user => user.name.asc())
    .all();

  return users.map(user => ({
    id: user.id,
    name: user.name
  }));
}
