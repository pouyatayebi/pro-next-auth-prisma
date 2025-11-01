// /src/proxy.ts
/**
 * Global Proxy (Next.js 16) with Auth.js v5
 * -----------------------------------------
 * - Wrap the handler with `auth(...)` to have `req.auth` injected.
 * - We define a narrowed type for the request so TS knows about `req.auth`.
 * - RBAC rules:
 *    GUEST → public routes only; others redirect to /auth
 *    USER  → may access /user/** (and public); others redirect to /user
 *    ADMIN → access everywhere
 */

import { auth as withAuth } from "@/auth";
import type { Session } from "next-auth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Narrowed request type (Auth.js wrapper attaches `auth`)
type NextRequestWithAuth = NextRequest & { auth: Session | null };

// Small helper
const startsWith = (pathname: string, base: string) =>
  pathname === base || pathname.startsWith(base + "/");

// Wrap the proxy so `req.auth` is available at runtime.
// We cast `req` to `NextRequestWithAuth` to make TS aware of `.auth`.
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

  // Session injected by the wrapper
  const session = r.auth;
  const role = session?.user?.role ?? null;

  // Not authenticated → redirect to /auth with callbackUrl
  if (!session) {
    const login = new URL("/auth", r.url);
    login.searchParams.set("callbackUrl", url.pathname + url.search);
    return NextResponse.redirect(login);
  }

  // USER role → only allow /user/**
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

// Limit the proxy to non-asset, non-internal paths
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(css|js|map|png|jpg|jpeg|gif|svg|ico|webp|woff2?)$).*)",
  ],
};
