// /src/app/layout.tsx
/**
 * Root Layout
 * -----------
 * - Renders the global Header.
 * - Includes <Toaster /> from `sonner` for app-wide toasts.
 */

import Header from "@/components/layout/header";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME ?? "App",
  description: process.env.NEXT_PUBLIC_APP_SLOGAN ?? "",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang={process.env.NEXT_PUBLIC_APP_LANG ?? "en"}
      dir={process.env.NEXT_PUBLIC_APP_DIR ?? "ltr"}
    >
      <body className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="container mx-auto px-4 py-6">{children}</main>
        <Toaster richColors closeButton />
      </body>
    </html>
  );
}
