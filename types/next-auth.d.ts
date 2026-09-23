import type { DefaultSession } from "next-auth";

export type UserRole = "DRIVER" | "MANAGER";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      createdAt: Date;
      sessionVersion: number;
    } & DefaultSession.User;
  }

  interface User {
    id: string;
    role: UserRole;
    createdAt: Date;
    sessionVersion: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    createdAt: Date;
    sessionVersion: number;
  }
}
