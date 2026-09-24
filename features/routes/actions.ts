"use server";

import { revalidatePath } from "next/cache";

import { requireRouteAccess } from "@/lib/auth/authorization";
import { db } from "@/prisma/db";

export async function reorderDeliveries(routeId: number, deliveryIds: number[]) {
  await requireRouteAccess(routeId);

  const deliveries = await db.orm.public.Delivery.where({ routeId, deleted: false }).all();
  if (deliveries.length !== deliveryIds.length) {
    return { success: false, error: "Invalid delivery order." };
  }

  const existingIds = new Set(deliveries.map(delivery => delivery.id));
  if (deliveryIds.some(id => !existingIds.has(id)) || new Set(deliveryIds).size !== deliveryIds.length) {
    return { success: false, error: "Invalid delivery order." };
  }

  await db.transaction(async tx => {
    for (let index = 0; index < deliveryIds.length; index++) {
      await tx.orm.public.Delivery.where({ id: deliveryIds[index], routeId }).update({ position: -(index + 1) });
    }
    for (let index = 0; index < deliveryIds.length; index++) {
      await tx.orm.public.Delivery.where({ id: deliveryIds[index], routeId }).update({ position: index + 1 });
    }
  });

  revalidatePath(`/routes/${routeId}`);
  revalidatePath("/routes");

  return { success: true };
}
