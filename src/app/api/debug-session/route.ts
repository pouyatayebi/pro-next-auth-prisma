// /src/app/api/debug-session/route.ts
/**
 * Debug Session Endpoint (Next 16 compatible)
 * -------------------------------------------
 * - Uses `await cookies()` since dynamic APIs are async in Next 16
 * - Node runtime + force-dynamic to avoid caching and Edge pitfalls
 * - Returns minimal session info, cookie presence, and matching DB session row
 *   (safe to keep locally; remove before production)
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const now = new Date().toISOString();

  // 1) What NextAuth sees as the current session on the server
  const sess = await auth();

  const safeSession = sess
    ? {
        user: {
          id: sess.user?.id ?? null,
          email: sess.user?.email ?? null,
          role: sess.user?.role ?? null,
        },
        expires: (sess as { expires?: string }).expires ?? null,
      }
    : null;

  // 2) Read the cookie sent by the browser (Next 16: await cookies())
  const cookieStore = await cookies();
  const token = cookieStore.get("authjs.session-token")?.value ?? null;

  // 3) Check DB for a session row with that token (database sessions)
  let sessionRow: { id: string; userId: string; expires: string } | null = null;
  if (token) {
    const row = await db.session.findUnique({
      where: { sessionToken: token },
      select: { id: true, userId: true, expires: true },
    });
    sessionRow = row
      ? { id: row.id, userId: row.userId, expires: row.expires.toISOString() }
      : null;
  }

  return NextResponse.json({
    now,
    session: safeSession,
    cookie: {
      hasSessionToken: Boolean(token),
      // token value not echoed for safety
    },
    db: {
      sessionRow, // null if not found
    },
    hints: [
      "If cookie.hasSessionToken is false → Browser didn't send the cookie. Check NEXTAUTH_URL, cookie Path=/, and Secure flag (should be off on http).",
      "If db.sessionRow is null but cookie exists → Prisma Session model mismatch or adapter write issue. Re-check prisma schema & run migrations.",
      "If both cookie and db row exist but session is null → Ensure /api/auth/[...nextauth] is nodejs runtime + dynamic, and trustHost:true in /src/auth.ts.",
    ],
  });
}
