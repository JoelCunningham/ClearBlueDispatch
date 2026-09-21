import { z } from "zod";

export const createDeliverySchema = z.object({
  assignedUserId: z.coerce.number().int().positive(),
  date: z.iso.date(),
  locationId: z.coerce.number().int().positive(),
  contactId: z.coerce.number().int().positive().optional(),
  notes: z.string().trim(),
  tankDetails: z.string().trim()
});

export type CreateDeliveryInput = z.infer<typeof createDeliverySchema>;

export const updateDeliverySchema = z.object({
  deliveryId: z.coerce.number().int().positive(),
  assignedUserId: z.coerce.number().int().positive(),
  date: z.string().trim().min(1),
  locationId: z.coerce.number().int().positive(),
  contactId: z.coerce.number().int().positive().optional(),
  notes: z.string(),
  tankDetails: z.string()
});

export type UpdateDeliveryInput = z.infer<typeof updateDeliverySchema>;
