// /src/app/user/verified-toast.tsx
"use client";
import * as React from "react";
import { toast } from "sonner";

export default function VerifiedToast({ fromVerified }: { fromVerified: boolean }) {
  React.useEffect(() => {
    if (fromVerified) toast.success("Your email has been verified. You are now signed in.");
  }, [fromVerified]);
  return null;
}
