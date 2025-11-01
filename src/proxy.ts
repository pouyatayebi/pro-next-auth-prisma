// /src/proxy.ts
/**
 * Global Proxy (Next.js 16) with Auth.js v5
 * -----------------------------------------
 * - Use the Auth.js wrapper to inject `req.auth` (session from JWT).
 * - Do NOT call `auth(req)` directly; wrap your handler: `const proxy = auth((req) => ...)`.
 * - RBAC:
 *    USER  → may access /user/** and public routes
 *    ADMIN → may access everything
 *    GUEST → public routes only; otherwise redirected to /auth
 */

import { auth as withAuth } from "@/auth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Small helper
const startsWith = (pathname: string, base: string) =>
  pathname === base || pathname.startsWith(base + "/");

// Wrap the proxy handler so `req.auth` is available
export const proxy = withAuth((req: NextRequest) => {
  const url = req.nextUrl;
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
  const session = req.auth;
  const role = session?.user?.role ?? null;

  // Not authenticated → redirect to /auth with callbackUrl
  if (!session) {
    const login = new URL("/auth", req.url);
    login.searchParams.set("callbackUrl", url.pathname + url.search);
    return NextResponse.redirect(login);
  }

  // USER → only allow /user/**
  if (role === "USER") {
    if (pathname === "/user" || startsWith(pathname, "/user")) {
      return NextResponse.next();
    }
    const userHome = new URL("/user", req.url);
    return NextResponse.redirect(userHome);
  }

  // ADMIN → allow everything
  if (role === "ADMIN") {
    return NextResponse.next();
  }

  // Unknown role → treat as unauthenticated
  const login = new URL("/auth", req.url);
  login.searchParams.set("callbackUrl", url.pathname + url.search);
  return NextResponse.redirect(login);
});

// Limit the proxy to non-asset, non-internal paths
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(css|js|map|png|jpg|jpeg|gif|svg|ico|webp|woff2?)$).*)",
  ],
};
