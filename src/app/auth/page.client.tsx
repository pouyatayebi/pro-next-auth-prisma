// /src/app/auth/page.client.tsx
"use client";
import AuthForm from "@/components/admin/forms/AuthForm";
import * as React from "react";
import { toast } from "sonner";

export default function AuthPageClient({ error }: { error?: string }) {
  React.useEffect(() => {
    if (!error) return;
    if (error.toLowerCase() === "oauthaccountnotlinked") {
      toast.error(
        "An account with this email already exists. Sign in with email/password, then link Google in Settings.",
      );
    } else {
      toast.error(error);
    }
  }, [error]);

  return <AuthForm />;
}
