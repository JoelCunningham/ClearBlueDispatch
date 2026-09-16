import { z } from "zod";

const customerLocationSchema = z.object({
  id: z.coerce.number().int().positive().optional(),
  address: z.string().trim().min(1)
});

const customerContactSchema = z.object({
  id: z.coerce.number().int().positive().optional(),
  name: z.string().trim().min(1),
  phoneNumber: z.string().trim().min(1)
});

const customerInvoiceEmailSchema = z.object({
  id: z.coerce.number().int().positive().optional(),
  emailAddress: z.string().trim().email()
});

const customerFormSchema = z.object({
  name: z.string().trim().min(1),
  rate: z.coerce.number().nonnegative(),
  locations: z.array(customerLocationSchema),
  contacts: z.array(customerContactSchema),
  invoiceEmails: z.array(customerInvoiceEmailSchema)
});

export const createCustomerSchema = customerFormSchema;

export const updateCustomerSchema = customerFormSchema.extend({
  customerId: z.coerce.number().int().positive()
});

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
