// /src/app/user/settings/ConnectGoogleButton.tsx
"use client";
import { signInWithGoogleAction } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";

export default function ConnectGoogleButton() {
  const [pending, start] = useTransition();

  return (
    <Button
      variant="outline"
      onClick={() => {
        start(async () => {
          try {
            // کاربر لاگین است → NextAuth پس از بازگشت، حساب Google را به همین کاربر لینک می‌کند
            await signInWithGoogleAction(); // پرتاب redirect
          } catch {
            toast.error("Failed to initiate Google linking");
          }
        });
      }}
      disabled={pending}
      className="inline-flex items-center gap-2"
    >
      <FcGoogle className="h-4 w-4" />
      {pending ? "Connecting..." : "Connect Google"}
    </Button>
  );
}
