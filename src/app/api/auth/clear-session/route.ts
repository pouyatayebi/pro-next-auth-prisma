// /src/app/api/auth/clear-session/route.ts
/**
 * Clear Auth Session Cookie (JWT) and redirect to /auth
 * Use when JWTSessionError happens due to old/invalid cookie.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

export async function GET() {
  const res = NextResponse.redirect(new URL("/auth", "http://localhost:3000"));
  // Delete JWT session cookie
  res.cookies.set({
    name: "authjs.session-token",
    value: "",
    maxAge: 0,
    path: "/",
  });
  return res;
}
