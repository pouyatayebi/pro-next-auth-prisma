// /components/admin/forms/fields/PasswordField.tsx
"use client";

/**
 * Password field with show/hide toggle.
 */

import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import * as React from "react";
import type { FieldValues, Path } from "react-hook-form";
import type { BaseFieldProps, WithPlaceholder } from "./types";
import { cn } from "./types";

type PasswordFieldProps<T extends FieldValues> = BaseFieldProps<T> &
  WithPlaceholder & {
    inputClassName?: string;
    autoComplete?: "current-password" | "new-password";
  };

export function PasswordField<T extends FieldValues>({
  control,
  name,
  label = "Password",
  description,
  className,
  disabled,
  required,
  placeholder = "••••••••",
  inputClassName,
  autoComplete = "current-password",
}: PasswordFieldProps<T>) {
  const [show, setShow] = React.useState(false);

  return (
    <FormField
      control={control}
      name={name as Path<T>}
      render={({ field }) => (
        <FormItem className={className}>
          {label ? <FormLabel>{label}</FormLabel> : null}
          {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
          <div className="relative">
            <FormControl>
              <Input
                type={show ? "text" : "password"}
                autoComplete={autoComplete}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                className={cn("pr-10", inputClassName)}
                {...field}
              />
            </FormControl>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? "Hide password" : "Show password"}
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
