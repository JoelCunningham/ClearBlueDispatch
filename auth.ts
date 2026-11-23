import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { authConfig } from "./auth.config";
import { verifyPassword } from "./lib/auth/authorization";
import { clearLoginFailures, getLoginAttemptKey, isLoginAllowed, recordLoginFailure } from "./lib/auth/login-rate-limit";
import { logError, logServerEvent } from "./lib/utils/logger";
import { db } from "./prisma/db";
import { UserRole } from "./types/next-auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, request) {
        const startedAt = Date.now();
        if (typeof credentials?.email !== "string" || typeof credentials?.password !== "string") {
          logServerEvent("warn", "auth.login_rejected", { reason: "invalid_credentials_shape", durationMs: Date.now() - startedAt });
          return null;
        }

        const email = credentials.email.trim().toLowerCase();
        const attemptKey = getLoginAttemptKey(request, email);

        if (!isLoginAllowed(attemptKey)) {
          logServerEvent("warn", "auth.login_rejected", { reason: "rate_limited", durationMs: Date.now() - startedAt });
          return null;
        }

        try {
          const user = await db.orm.public.User.first({ email });
          if (!user) {
            recordLoginFailure(attemptKey);
            logServerEvent("warn", "auth.login_rejected", { reason: "unknown_user", durationMs: Date.now() - startedAt });
            return null;
          }
          if (user.deleted) {
            recordLoginFailure(attemptKey);
            logServerEvent("warn", "auth.login_rejected", { reason: "deleted_user", userId: user.id, durationMs: Date.now() - startedAt });
            return null;
          }

          const passwordMatches = await verifyPassword(credentials.password, user.passwordHash);
          if (!passwordMatches) {
            recordLoginFailure(attemptKey);
            logServerEvent("warn", "auth.login_rejected", {
              reason: "invalid_password",
              userId: user.id,
              durationMs: Date.now() - startedAt
            });
            return null;
          }

          clearLoginFailures(attemptKey);
          logServerEvent("info", "auth.login_succeeded", { userId: user.id, role: user.role, durationMs: Date.now() - startedAt });

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            sessionVersion: user.sessionVersion,
            createdAt: new Date(user.createdAt.epochMilliseconds)
          };
        } catch (error) {
          recordLoginFailure(attemptKey);
          logError("auth.login_failed", error, { durationMs: Date.now() - startedAt });
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.createdAt = user.createdAt;
        token.sessionVersion = user.sessionVersion;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as UserRole;
      session.user.createdAt = token.createdAt as Date;
      session.user.sessionVersion = token.sessionVersion as number;
      return session;
    }
  }
});
