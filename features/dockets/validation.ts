import { z } from "zod";

export const createDocketSchema = z.object({
  deliveryId: z.coerce.number().int().positive(),
  volume: z.coerce.number().int().positive(),
  batchNumber: z.string().trim().min(1),
  repName: z.string().trim().min(1),
  repSignature: z.string().trim().min(1)
});

export type CreateDocketInput = z.infer<typeof createDocketSchema>;
