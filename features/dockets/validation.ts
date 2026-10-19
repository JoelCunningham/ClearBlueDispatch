import { z } from "zod";

export const createDocketSchema = z.object({
  deliveryId: z.coerce.number().int().positive("Delivery ID must be positive."),
  volume: z.coerce.number().int().positive("Volume must be a whole number greater than zero."),
  batchNumber: z.string().trim().min(1, "Enter a batch number.").max(128, "Batch number must be 128 characters or fewer."),
  comments: z.string().trim().max(2000, "Comments must be 2,000 characters or fewer.").optional(),
  repName: z.string().trim().min(1, "Enter the representative name.").max(200, "Name must be 200 characters or fewer."),
  repSignature: z.string().trim().min(1, "Add a signature.").max(1_000_000, "Signature is too large."),
  photos: z.array(z.instanceof(File)).max(5, "You can upload a maximum of 5 photos.")
});

export type CreateDocketInput = z.infer<typeof createDocketSchema>;

export const updateDocketSchema = z.object({
  docketId: z.coerce.number().int().positive("Docket ID must be positive."),
  volume: z.coerce.number().int().positive("Volume must be a whole number greater than zero."),
  batchNumber: z.string().trim().min(1, "Enter a batch number.").max(128, "Batch number must be 128 characters or fewer."),
  comments: z.string().trim().max(2000, "Comments must be 2,000 characters or fewer.").optional(),
  repName: z.string().trim().min(1, "Enter the representative name.").max(200, "Name must be 200 characters or fewer."),
  repSignature: z.string().trim().min(1, "Add a signature.").max(1_000_000, "Signature is too large."),
  photos: z.array(z.instanceof(File)).max(5, "You can upload a maximum of 5 photos.")
});

export type UpdateDocketInput = z.infer<typeof updateDocketSchema>;
