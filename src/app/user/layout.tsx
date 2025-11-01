// /src/app/user/layout.tsx
/**
 * User Layout
 * -----------
 * Polished user shell with a lightweight header strip and content area.
 * Access is enforced by middleware; layout assumes authenticated user.
 */

import { auth } from "@/auth";
import Link from "next/link";
import type { ReactNode } from "react";

export default async function UserLayout({ children }: { children: ReactNode }) {
  const session = await auth(); // optional display

  return (
    <div className="min-h-[calc(100vh-56px)]">
      <div className="border-b bg-background/60 px-4 py-3">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Signed in as{" "}
            <span className="font-medium text-foreground">
              {session?.user?.email ?? session?.user?.name ?? "User"}
            </span>
          </div>
          <div className="text-sm">
            <Link href="/" className="hover:underline" prefetch>
              Back to home
            </Link>
          </div>
        </div>
      </div>
      <main className="mx-auto w-full max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
