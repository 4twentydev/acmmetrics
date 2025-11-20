import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: DefaultSession["user"] & {
      id?: string;
      role?: "admin" | "manager" | "employee";
    };
  }

  interface User {
    id: string;
    role?: "admin" | "manager" | "employee";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "admin" | "manager" | "employee";
  }
}
