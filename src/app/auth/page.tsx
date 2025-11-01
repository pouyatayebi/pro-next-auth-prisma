// /src/app/auth/page.tsx
/**
 * Auth Page (Server) — Next 16
 * - `searchParams` is async → await it before reading.
 * - Pass the plain string to the client component for toast handling.
 */

import { Suspense } from "react";
import AuthPageClient from "./page.client";

type AsyncSearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function AuthPage({ searchParams }: { searchParams: AsyncSearchParams }) {
  const sp = await searchParams; // ✅ unwrap the promise
  const errorParam = Array.isArray(sp?.error) ? sp?.error[0] : sp?.error;

  return (
    <Suspense>
      <AuthPageClient error={errorParam} />
    </Suspense>
  );
}
