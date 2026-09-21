"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/prisma/db";

import { CreateDocketInput, createDocketSchema } from "./validation";

export async function createDocket(input: CreateDocketInput) {
  const result = createDocketSchema.safeParse(input);
  if (!result.success) {
    return { success: false, error: "Invalid docket details." };
  }

  const { deliveryId, volume, batchNumber, repName, repSignature } = result.data;

  try {
    await db.transaction(async tx => {
      const delivery = await tx.orm.public.Delivery.where({ id: deliveryId }).first();
      if (!delivery) throw new Error("Delivery not found.");

      const existingDocket = await tx.orm.public.Docket.where({ deliveryId }).first();
      if (existingDocket) throw new Error("This delivery already has a docket.");

      await tx.orm.public.Docket.create({ deliveryId, volume, batchNumber, repName, repSignature });
    });
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unable to create docket." };
  }

  revalidatePath(`/deliveries/${deliveryId}`);
  redirect(`/deliveries/${deliveryId}`);
}
