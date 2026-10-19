import { z } from "zod";

export const createDocketSchema = z.object({
  deliveryId: z.coerce.number().int().positive(),
  volume: z.coerce.number().int().positive(),
  batchNumber: z.string().trim().min(1).max(128),
  comments: z.string().trim().max(2000).optional(),
  repName: z.string().trim().min(1).max(200),
  repSignature: z.string().trim().min(1).max(1_000_000),
  photos: z.array(z.instanceof(File)).max(5, "You can upload a maximum of 5 5Mb photos.")
});

export type CreateDocketInput = z.infer<typeof createDocketSchema>;

export const updateDocketSchema = z.object({
  docketId: z.coerce.number().int().positive(),
  volume: z.coerce.number().int().positive(),
  batchNumber: z.string().trim().min(1).max(128),
  comments: z.string().trim().max(2000).optional(),
  repName: z.string().trim().min(1).max(200),
  repSignature: z.string().trim().min(1).max(1_000_000),
  photos: z.array(z.instanceof(File)).max(5, "You can upload a maximum of 5 5Mb photos.")
});

export type UpdateDocketInput = z.infer<typeof updateDocketSchema>;
