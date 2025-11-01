// /src/app/(home)/layout.tsx
/**
 * (home) Layout
 * -------------
 * Route group for the public landing pages rendered at "/".
 * Keeps root layout intact while giving (home) its own shell.
 */

import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { ReactNode } from "react";

export default function HomeGroupLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-56px)] bg-gradient-to-b from-background to-muted/30">
      <section className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {process.env.NEXT_PUBLIC_APP_NAME ?? "Pro Next Starter"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {process.env.NEXT_PUBLIC_APP_SLOGAN ?? "Build fast. Ship polished."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline">
              <Link href="/auth" prefetch>
                Sign in
              </Link>
            </Button>
            <Button asChild>
              <Link href="/auth" prefetch>
                Get started
              </Link>
            </Button>
          </div>
        </div>
        {children}
      </section>
    </div>
  );
}
