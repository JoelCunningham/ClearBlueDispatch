import { UserRole } from "@/types/next-auth";

export type UserSummary = {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  role: UserRole;
};

export type UpdateUserInput = {
  userId: number;
  name: string;
  email: string;
  role: UserRole;
};

export type ChangeOwnPasswordInput = {
  currentPassword?: string;
  newPassword: string;
};

export type ResetUserPasswordInput = {
  userId: number;
  newPassword: string;
};

export type UpdateOwnProfileInput = {
  name: string;
  email: string;
  userId: number;
};
