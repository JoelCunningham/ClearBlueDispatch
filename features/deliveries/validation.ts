import { z } from "zod";

export const createDeliverySchema = z.object({
  assignedUserId: z.coerce.number().int().positive("Select a driver."),
  date: z.iso.date("Enter a valid delivery date."),
  locationId: z.coerce.number().int().positive("Select a customer."),
  contactId: z.coerce.number().int().positive("Select a valid contact.").optional(),
  notes: z.string().trim(),
  tankDetails: z.string().trim()
});

export type CreateDeliveryInput = z.infer<typeof createDeliverySchema>;

export const updateDeliverySchema = z.object({
  deliveryId: z.coerce.number().int().positive("Delivery ID must be positive."),
  assignedUserId: z.coerce.number().int().positive("Select a driver."),
  date: z.string().trim().min(1, "Enter a delivery date."),
  locationId: z.coerce.number().int().positive("Select a customer."),
  contactId: z.coerce.number().int().positive("Select a valid contact.").optional(),
  notes: z.string(),
  tankDetails: z.string()
});

export type UpdateDeliveryInput = z.infer<typeof updateDeliverySchema>;
