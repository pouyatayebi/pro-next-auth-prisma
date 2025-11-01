// /src/app/user/settings/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ConnectGoogleButton from "./ConnectGoogleButton";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="mb-2 text-lg font-semibold">Linked Accounts</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Link your Google account to sign in faster.
        </p>
        <ConnectGoogleButton />
      </div>
    </div>
  );
}
