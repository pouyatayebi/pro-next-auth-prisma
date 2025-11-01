// /src/app/admin/layout.tsx
/**
 * Admin Layout
 * ------------
 * Professional admin shell with a minimal sidebar and content area.
 * Access is enforced by middleware; layout assumes authorized ADMIN user.
 */

import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { ReactNode } from "react";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth(); // optional display; middleware already guards
  const name = session?.user?.name ?? session?.user?.email ?? "Admin";

  return (
    <div className="grid min-h-[calc(100vh-56px)] grid-cols-12">
      <aside className="col-span-12 border-b bg-card/60 p-4 md:col-span-3 md:border-r md:border-b-0">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Admin Panel</h2>
          <p className="text-xs text-muted-foreground">Welcome, {name}</p>
        </div>
        <nav className="space-y-2 text-sm">
          <Link className="block rounded px-2 py-1 hover:bg-muted" href="/admin" prefetch>
            Overview
          </Link>
          <Link className="block rounded px-2 py-1 hover:bg-muted" href="/admin/users" prefetch>
            Users
          </Link>
          <Link className="block rounded px-2 py-1 hover:bg-muted" href="/admin/settings" prefetch>
            Settings
          </Link>
          <div className="pt-2">
            <Button asChild size="sm" variant="outline">
              <Link href="/" prefetch>
                Back to site
              </Link>
            </Button>
          </div>
        </nav>
      </aside>

      <main className="col-span-12 p-4 md:col-span-9">
        <div className="mx-auto w-full max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
