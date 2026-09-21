"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireRole } from "@/lib/auth/authorization";
import { db } from "@/prisma/db";

import type { CreateDeliveryInput } from "./types";
import { createDeliverySchema, UpdateDeliveryInput, updateDeliverySchema } from "./validation";

export async function createDelivery(input: CreateDeliveryInput) {
  await requireRole("MANAGER");

  const result = createDeliverySchema.safeParse(input);
  if (!result.success) return { success: false, error: "Invalid delivery details." };

  const { assignedUserId, date, locationId, contactId, notes, tankDetails } = result.data;

  const resultData = await db.transaction(async tx => {
    const location = await tx.orm.public.Location.first({ id: locationId });

    if (!location) throw new Error("Location not found.");

    if (contactId !== undefined) {
      const contact = await tx.orm.public.Contact.first({ id: contactId });
      if (!contact) throw new Error("Contact not found.");
      if (contact.customerId !== location.customerId) throw new Error("Contact does not belong to the location's customer.");
    }

    let route = await tx.orm.public.Route.first({ assignedUserId, date });
    if (!route) route = await tx.orm.public.Route.create({ assignedUserId, date });

    const existingDeliveries = await tx.orm.public.Delivery.where({ routeId: route.id }).all();
    const position = existingDeliveries.length + 1;

    const delivery = await tx.orm.public.Delivery.create({ routeId: route.id, locationId, contactId, position, notes, tankDetails });
    return { routeId: route.id, deliveryId: delivery.id };
  });

  revalidatePath("/routes");
  revalidatePath(`/routes/${resultData.routeId}`);
  revalidatePath("/deliveries");

  redirect(`/routes/${resultData.routeId}`);
}

export async function updateDelivery(input: UpdateDeliveryInput) {
  await requireRole("MANAGER");

  const result = updateDeliverySchema.safeParse(input);
  if (!result.success) return { success: false, error: "Invalid delivery details." };

  const { deliveryId, assignedUserId, date, locationId, contactId, notes, tankDetails } = result.data;
  let routeId: number;

  try {
    routeId = await db.transaction(async tx => {
      const delivery = await tx.orm.public.Delivery.where({ id: deliveryId }).first();
      if (!delivery) throw new Error("Delivery not found.");

      const location = await tx.orm.public.Location.first({ id: locationId });
      if (!location) throw new Error("Location not found.");

      if (contactId !== undefined) {
        const contact = await tx.orm.public.Contact.first({ id: contactId });
        if (!contact) throw new Error("Contact not found.");
        if (contact.customerId !== location.customerId) throw new Error("Contact does not belong to the location's customer.");
      }

      const currentRoute = await tx.orm.public.Route.first({ id: delivery.routeId });
      if (!currentRoute) throw new Error("Current route not found.");

      const routeChanged = currentRoute.assignedUserId !== assignedUserId || currentRoute.date !== date;
      let targetRoute = currentRoute;

      if (routeChanged) {
        const existingRoute = await tx.orm.public.Route.first({ assignedUserId, date });
        if (!existingRoute) {
          targetRoute = await tx.orm.public.Route.create({ assignedUserId, date });
        } else {
          targetRoute = existingRoute;
        }
      }

      let position = delivery.position;

      if (routeChanged) {
        const existingDeliveries = await tx.orm.public.Delivery.where({ routeId: targetRoute.id }).all();
        position = existingDeliveries.length + 1;
      }

      await tx.orm.public.Delivery.where({ id: deliveryId }).update({
        routeId: targetRoute.id,
        locationId,
        contactId,
        position,
        notes,
        tankDetails
      });

      if (routeChanged) {
        const remainingDeliveries = await tx.orm.public.Delivery.where({ routeId: currentRoute.id }).all();
        if (remainingDeliveries.length === 0) {
          await tx.orm.public.Route.where({ id: currentRoute.id }).delete();
        }
      }

      return targetRoute.id;
    });
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unable to update delivery." };
  }

  revalidatePath("/routes");
  revalidatePath(`/routes/${routeId}`);
  revalidatePath("/deliveries");
  revalidatePath(`/deliveries/${deliveryId}`);
  revalidatePath(`/deliveries/${deliveryId}/edit`);

  redirect(`/deliveries/${deliveryId}`);
}
