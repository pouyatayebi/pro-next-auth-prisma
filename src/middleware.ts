// /src/middleware.ts
/**
 * Role-based Protection (Next.js 16 + Auth.js v5, JWT)
 * ----------------------------------------------------
 * Rules:
 * - /user/** requires authenticated USER or ADMIN
 * - /admin/** requires ADMIN
 * - Public routes (e.g. /(home)/**, /auth/**) are not matched here
 *
 * Implementation:
 * - Use `auth()` wrapper to get `req.auth` in Edge middleware safely.
 * - Redirect unauthenticated to /auth?from=<path>
 * - Redirect USER trying to access /admin to /user?denied=1
 */

import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  // Session injected by auth() wrapper
  const session = req.auth;
  const role = (session?.user as { role?: "USER" | "ADMIN" } | undefined)?.role;

  const isAdminPath = pathname.startsWith("/admin");
  const isUserPath = pathname.startsWith("/user");

  // Enforce /admin/**
  if (isAdminPath) {
    if (!session) {
      const redirectTo = new URL(`/auth?from=${encodeURIComponent(pathname)}`, nextUrl.origin);
      return NextResponse.redirect(redirectTo);
    }
    if (role !== "ADMIN") {
      // Logged-in but not admin → send to /user with a hint
      const redirectTo = new URL(`/user?denied=1`, nextUrl.origin);
      return NextResponse.redirect(redirectTo);
    }
    return NextResponse.next();
  }

  // Enforce /user/**
  if (isUserPath) {
    if (!session) {
      const redirectTo = new URL(`/auth?from=${encodeURIComponent(pathname)}`, nextUrl.origin);
      return NextResponse.redirect(redirectTo);
    }
    // USER or ADMIN both allowed for /user/**
    return NextResponse.next();
  }

  // Not matched (public): let it pass
  return NextResponse.next();
});

// Only run on these routes to minimize overhead
export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};
