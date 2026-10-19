import { z } from "zod";

const customerLocationSchema = z.object({
  id: z.coerce.number().int().positive("Location ID must be positive.").optional(),
  address: z.string().trim().min(1, "Enter a location address.")
});

const customerContactSchema = z.object({
  id: z.coerce.number().int().positive("Contact ID must be positive.").optional(),
  name: z.string().trim().min(1, "Enter the contact name."),
  phoneNumber: z.string().trim().min(1, "Enter the contact phone number.")
});

const customerInvoiceEmailSchema = z.object({
  id: z.coerce.number().int().positive("Invoice email ID must be positive.").optional(),
  emailAddress: z.email("Enter a valid invoice email address.")
});

const customerFormSchema = z.object({
  name: z.string().trim().min(1, "Enter a customer name."),
  rate: z.coerce.number().nonnegative("Delivery rate cannot be negative."),
  locations: z.array(customerLocationSchema),
  contacts: z.array(customerContactSchema),
  emails: z.array(customerInvoiceEmailSchema)
});

export const createCustomerSchema = customerFormSchema;

export const updateCustomerSchema = customerFormSchema.extend({
  customerId: z.coerce.number().int().positive()
});

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
