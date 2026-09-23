import { UserRole } from "@/types/next-auth";

export type UserSummary = {
  id: number;
  name: string;
  email: string;
  createdAt: Temporal.Instant;
  role: UserRole;
};

export type UpdateUserInput = {
  userId: number;
  name: string;
  email: string;
  role: UserRole;
};

export type UpdateOwnProfileInput = {
  name: string;
  email: string;
  userId: number;
};

export type PasswordFormInput = {
  currentPassword?: string;
  newPassword: string;
};

export type ChangeOwnPasswordInput = PasswordFormInput;

export type ResetUserPasswordInput = PasswordFormInput & { userId: number };
