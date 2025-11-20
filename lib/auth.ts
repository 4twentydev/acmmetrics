import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import type { Role } from "@/lib/employees";
import { findEmployeeByUsername } from "@/lib/employees";

function isRole(value: unknown): value is Role {
  return value === "admin" || value === "manager" || value === "employee";
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "ACM Weekly",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const employee = findEmployeeByUsername(credentials.username.trim());
        if (!employee) {
          return null;
        }

        if (employee.password !== credentials.password) {
          return null;
        }

        return {
          id: employee.id,
          email: employee.email,
          name: employee.name,
          role: employee.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
      }
      if (user && "role" in user) {
        const role = (user as { role?: unknown }).role;
        if (isRole(role)) {
          token.role = role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token?.id) {
        session.user.id = token.id as string;
      }
      if (session.user && token?.role) {
        session.user.role = token.role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET ?? "acmweekly-dev-secret",
};
