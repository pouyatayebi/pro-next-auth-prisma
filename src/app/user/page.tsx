// /src/app/user/page.tsx
/**
 * User Home (Server Component, Next 16)
 * - Protected by middleware; here we just render content.
 * - `searchParams` is async in Next 16 → unwrap if needed.
 */

import { auth } from "@/auth";
import type { Session } from "next-auth";

export const dynamic = "force-dynamic";

type AsyncSearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function UserHomePage({ searchParams }: { searchParams: AsyncSearchParams }) {
  const session = (await auth()) as Session | null;

  const sp = await searchParams;
  const raw = sp?.verified;
  const verifiedFlag =
    (typeof raw === "string" && raw === "1") || (Array.isArray(raw) && raw.includes("1"));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">
        Welcome, {session?.user?.name ?? session?.user?.email ?? "User"}!
      </h1>
      <p className="text-sm text-muted-foreground">
        Your role: <strong>{session?.user?.role ?? "USER"}</strong>
      </p>
      {verifiedFlag ? (
        <p className="text-sm text-emerald-600">Your email was verified successfully.</p>
      ) : null}
    </div>
  );
}
