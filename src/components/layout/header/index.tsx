// /src/components/layout/header/index.tsx
/**
 * Header (Server Component, resilient to JWT errors)
 * - Catches JWTSessionError from auth()
 * - Renders "guest" UI + a small fix link to clear the bad cookie
 */
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import type { Session } from "next-auth";
import Link from "next/link";
import Navbar from "./Navbar";
import UserMenu from "./UserMenu";

export default async function Header() {
  let session: Session | null = null;
  let hadJwtError = false;

  try {
    session = await auth();
  } catch (err) {
    console.error("[header/auth] session error:", err);
    hadJwtError = true;
    session = null;
  }

  const u = session?.user
    ? {
        id: session.user.id!,
        name: session.user.name ?? null,
        email: session.user.email ?? null,
        image: session.user.image ?? null,
        role: (session.user.role ?? "USER") as "USER" | "ADMIN",
      }
    : null;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link href="/" prefetch className="font-semibold">
            {process.env.NEXT_PUBLIC_APP_NAME ?? "App"}
          </Link>
          <span className="hidden md:inline text-xs text-muted-foreground">
            {process.env.NEXT_PUBLIC_APP_SLOGAN ?? ""}
          </span>
        </div>

        {/* Center nav */}
        <Navbar />

        {/* Right side */}
        <div className="flex items-center gap-2">
          {hadJwtError ? (
            <Link
              href="/api/auth/clear-session"
              className="text-xs text-amber-600 underline underline-offset-4"
              prefetch={false}
            >
              Fix session
            </Link>
          ) : null}

          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link href="/docs" prefetch>
              Docs
            </Link>
          </Button>
          <UserMenu user={u} />
        </div>
      </div>
    </header>
  );
}
