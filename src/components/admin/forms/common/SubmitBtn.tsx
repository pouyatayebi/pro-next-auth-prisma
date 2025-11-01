// File: components/common/SubmitBtn.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import * as React from "react";
import { cn } from "../fields";

type SubmitBtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  pending?: boolean;
  label: string;
  iconLeft?: React.ReactNode;
};

export default function SubmitBtn({
  pending,
  label,
  iconLeft,
  className,
  disabled,
  ...rest
}: SubmitBtnProps) {
  return (
    <Button type="submit" disabled={pending || disabled} className={cn(className)} {...rest}>
      {pending ? (
        <>
          <Loader2 className="me-2 h-4 w-4 animate-spin" />
          {label}
        </>
      ) : (
        <>
          {iconLeft ? <span className="me-2 inline-flex">{iconLeft}</span> : null}
          {label}
        </>
      )}
    </Button>
  );
}
