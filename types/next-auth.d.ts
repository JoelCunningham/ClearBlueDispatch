import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "DRIVER" | "MANAGER";
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: "DRIVER" | "MANAGER";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "DRIVER" | "MANAGER";
  }
}
