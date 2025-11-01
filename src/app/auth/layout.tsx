// /src/app/auth/layout.tsx
import * as React from "react";
import { Toaster } from "sonner";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh w-full bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Toaster richColors position="top-right" />
      <div className="mx-auto flex min-h-dvh max-w-6xl items-center justify-center px-4">
        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
          <div className="hidden md:flex flex-col justify-center rounded-2xl border bg-white/70 p-8 shadow-sm backdrop-blur">
            <div className="text-3xl font-semibold tracking-tight">
              {process.env.NEXT_PUBLIC_APP_NAME ?? "Pro Next Starter"}
            </div>
            <p className="mt-2 text-muted-foreground">
              {process.env.NEXT_PUBLIC_APP_SLOGAN ?? "Build fast. Ship polished."}
            </p>
            <div className="mt-6 h-24 rounded-xl bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200" />
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">{children}</div>
        </div>
      </div>
    </div>
  );
}
