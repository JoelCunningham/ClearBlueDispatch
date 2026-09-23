import { z } from "zod";

export const createDocketSchema = z.object({
  deliveryId: z.coerce.number().int().positive(),
  volume: z.coerce.number().int().positive(),
  batchNumber: z.string().trim().min(1),
  comments: z.string().trim().optional(),
  repName: z.string().trim().min(1),
  repSignature: z.instanceof(Uint8Array<ArrayBufferLike>)
});

export type CreateDocketInput = z.infer<typeof createDocketSchema>;

export const updateDocketSchema = z.object({
  docketId: z.coerce.number().int().positive(),
  volume: z.coerce.number().int().positive(),
  batchNumber: z.string().trim().min(1),
  comments: z.string().trim().optional(),
  repName: z.string().trim().min(1),
  repSignature: z.instanceof(Uint8Array<ArrayBufferLike>)
});

export type UpdateDocketInput = z.infer<typeof updateDocketSchema>;
