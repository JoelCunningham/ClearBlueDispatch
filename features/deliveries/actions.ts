"use server";

import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/auth/require-role";
import { db } from "@/prisma/db";

import type { CreateDeliveryInput } from "./types";
import { createDeliverySchema } from "./validation";

export async function createDelivery(input: CreateDeliveryInput) {
  await requireRole("MANAGER");

  const result = createDeliverySchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      error: "Invalid delivery details."
    };
  }

  const { assignedUserId, date, locationId, contactId, notes, tankDetails } = result.data;

  const resultData = await db.transaction(async tx => {
    const location = await tx.orm.public.Location.first({ id: locationId });

    if (!location) throw new Error("Location not found.");

    if (contactId !== undefined) {
      const contact = await tx.orm.public.Contact.first({ id: contactId });

      if (!contact) throw new Error("Contact not found.");

      if (contact.customerId !== location.customerId) {
        throw new Error("Contact does not belong to the location's customer.");
      }
    }

    let route = await tx.orm.public.Route.first({ assignedUserId, date });

    if (!route) {
      route = await tx.orm.public.Route.create({
        assignedUserId,
        date
      });
    }

    const existingDeliveries = await tx.orm.public.Delivery.where({ routeId: route.id }).all();
    const position = existingDeliveries.length + 1;

    const delivery = await tx.orm.public.Delivery.create({
      routeId: route.id,
      locationId,
      contactId,
      position,
      notes,
      tankDetails
    });

    return {
      routeId: route.id,
      deliveryId: delivery.id
    };
  });

  revalidatePath("/routes");
  revalidatePath(`/routes/${resultData.routeId}`);
  revalidatePath("/manage/deliveries");

  return {
    success: true,
    routeId: resultData.routeId,
    deliveryId: resultData.deliveryId
  };
}
