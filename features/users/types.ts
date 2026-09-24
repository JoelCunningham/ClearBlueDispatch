import { UserRole } from "@/types/next-auth";

export type UserSummary = {
  id: number;
  name: string;
  email: string;
  createdAt: Temporal.Instant;
  role: UserRole;
  deleted?: boolean;
};

export type UserFormInput = {
  name: string;
  email: string;
  role: UserRole;
};

export type CreateUserInput = UserFormInput;

export type UpdateUserInput = UserFormInput & { userId: number };

export type UpdateOwnProfileInput = UserFormInput & { userId: number };

export type PasswordFormInput = {
  currentPassword?: string;
  newPassword: string;
};

export type ChangeOwnPasswordInput = PasswordFormInput;

export type ResetUserPasswordInput = PasswordFormInput & { userId: number };
