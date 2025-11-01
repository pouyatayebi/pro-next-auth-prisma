// /src/app/api/verify/route.ts
/**
 * Verify & auto-login (no UI).
 * GET /api/verify?email=...&token=...
 * - Validates via "verify-token" provider (in /src/auth.ts)
 * - Creates session
 * - Redirects to /user?verified=1
 */
import { signIn } from "@/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const email = (url.searchParams.get("email") ?? "").toLowerCase();
  const token = url.searchParams.get("token") ?? "";

  if (!email || !token) {
    return NextResponse.redirect(new URL("/auth?verify_error=1", url.origin));
  }

  // Use the special credentials provider "verify-token"
  await signIn("verify-token", {
    email,
    token,
    redirectTo: "/user?verified=1",
  });

  // Fallback (signIn usually handles redirect)
  return NextResponse.redirect(new URL("/user?verified=1", url.origin));
}
