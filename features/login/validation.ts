import { z } from "zod";

export const loginUserSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(1, "Password is required.")
});

export type LoginUserInput = z.infer<typeof loginUserSchema>;

export const setupPasswordSchema = z
  .object({
    userId: z.number().optional(),
    password: z.string().min(12, "Password must be at least 12 characters."),
    confirmPassword: z.string(),
    callbackUrl: z.string().optional()
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"]
  });

export type SetupPasswordInput = z.infer<typeof setupPasswordSchema>;

export const resetPasswordSchema = z.object({
  email: z.email("Enter a valid email address.")
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
