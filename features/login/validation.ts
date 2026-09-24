import { z } from "zod";

export const loginUserSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(1, "Password is required.")
});

export type LoginUserInput = z.infer<typeof loginUserSchema>;

export const setPasswordSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
  newPassword: z.string().min(12, "New password must be at least 12 characters.")
});

export type SetPasswordInput = z.infer<typeof setPasswordSchema>;
