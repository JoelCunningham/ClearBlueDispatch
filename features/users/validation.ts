import { string, z } from "zod";

export const passwordSchema = z
  .string()
  .min(12, "Password must be at least 12 characters.")
  .max(128, "Password must be 128 characters or fewer.");

export const changeOwnPasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required."),
  newPassword: passwordSchema
});

export const resetUserPasswordSchema = z.object({
  userId: z.coerce.number().int().positive(),
  newPassword: passwordSchema
});

export const createUserSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  email: z.email("Enter a valid email address."),
  role: z.enum(["DRIVER", "MANAGER"])
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  userId: z.coerce.number().int().positive(),
  name: z.string().trim().min(1, "Name is required."),
  email: z.email("Enter a valid email address."),
  role: z.enum(["DRIVER", "MANAGER"])
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
