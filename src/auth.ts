// /src/auth.ts
/**
 * NextAuth v5 configuration (JWT sessions)
 * ----------------------------------------
 * - Switch to JWT session strategy to avoid DB session row issues.
 * - Prisma Adapter still used for users/accounts/verification tokens.
 * - `jwt` callback embeds `id` and `role` into the token.
 * - `session` callback exposes `id` and `role` on `session.user`.
 */

import { db } from "@/lib/db";
import { AuthSchema } from "@/zod-validations";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import type { User as NextAuthUser } from "next-auth";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  adapter: PrismaAdapter(db),

  // ✅ Use JWT sessions (no DB session row required)
  session: { strategy: "jwt" },

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: false,
    }),
    Credentials({
      id: "credentials",
      name: "Credentials",
      authorize: async (raw): Promise<NextAuthUser | null> => {
        const parsed = AuthSchema.signInCredentialsSchema.safeParse(raw);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const user = await db.user.findUnique({
          where: { email },
          select: {
            id: true,
            role: true,
            name: true,
            email: true,
            image: true,
            password: true,
            emailVerified: true,
          },
        });

        if (!user || !user.password || !user.emailVerified) return null;
        const ok = await compare(password, user.password);
        if (!ok) return null;

        return {
          id: user.id,
          name: user.name ?? null,
          email: user.email ?? null,
          image: user.image ?? null,
          role: user.role,
        };
      },
    }),
    Credentials({
      id: "verify-token",
      name: "VerifyToken",
      authorize: async (raw): Promise<NextAuthUser | null> => {
        const parsed = AuthSchema.verifyEmailSchema.safeParse(raw);
        if (!parsed.success) return null;

        const email = parsed.data.email;
        const token = parsed.data.token;

        const v = await db.verificationToken.findUnique({ where: { token } });
        if (!v || v.identifier !== email || v.expires < new Date()) return null;

        await db.verificationToken.delete({ where: { token } });
        await db.user.update({ where: { email }, data: { emailVerified: new Date() } });

        const u = await db.user.findUnique({
          where: { email },
          select: { id: true, role: true, name: true, email: true, image: true },
        });
        if (!u) return null;

        return {
          id: u.id,
          name: u.name ?? null,
          email: u.email ?? null,
          image: u.image ?? null,
          role: u.role,
        };
      },
    }),
  ],

  callbacks: {
    // Put id/role into JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },

    // Expose id/role on session.user
    async session({ session, token }) {
      if (session.user) {
        // @ts-expect-error token fields from jwt callback
        session.user.id = token.id as string | undefined;
        // @ts-expect-error token fields from jwt callback
        session.user.role = token.role as "USER" | "ADMIN" | undefined;
      }
      return session;
    },
  },
});
