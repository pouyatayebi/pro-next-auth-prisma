// /src/proxy.ts
/**
 * Global Proxy (Next.js 16) with Auth.js v5
 * -----------------------------------------
 * - Wrap the handler with `auth(...)` to inject `req.auth`.
 * - RBAC:
 *    GUEST → public routes only; otherwise redirect to /auth
 *    USER  → may access /user/** (and public); others redirect to /user
 *    ADMIN → access everywhere
 */

import { auth as withAuth } from "@/auth";
import type { Session } from "next-auth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Narrowed request type so TS knows about `req.auth`
type NextRequestWithAuth = NextRequest & { auth: Session | null };

const startsWith = (pathname: string, base: string) =>
  pathname === base || pathname.startsWith(base + "/");

// Wrap the proxy so `req.auth` is available at runtime
export const proxy = withAuth((req: NextRequest) => {
  const r = req as NextRequestWithAuth;
  const url = r.nextUrl;
  const { pathname } = url;

  // Public routes (bypass)
  if (
    pathname === "/" ||
    startsWith(pathname, "/(home)") ||
    startsWith(pathname, "/auth") ||
    startsWith(pathname, "/verify") ||
    startsWith(pathname, "/api/health")
  ) {
    return NextResponse.next();
  }

  // Read session from wrapper
  const session = r.auth;
  const role = session?.user?.role ?? null;

  // Guest → redirect to /auth with callbackUrl
  if (!session) {
    const login = new URL("/auth", r.url);
    login.searchParams.set("callbackUrl", url.pathname + url.search);
    return NextResponse.redirect(login);
  }

  // USER → only /user/**
  if (role === "USER") {
    if (pathname === "/user" || startsWith(pathname, "/user")) {
      return NextResponse.next();
    }
    const userHome = new URL("/user", r.url);
    return NextResponse.redirect(userHome);
  }

  // ADMIN → allow everything
  if (role === "ADMIN") {
    return NextResponse.next();
  }

  // Unknown role → treat as unauthenticated
  const login = new URL("/auth", r.url);
  login.searchParams.set("callbackUrl", url.pathname + url.search);
  return NextResponse.redirect(login);
});

// Limit proxy to protected sections (no regex with capturing groups)
export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};
