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
