// /components/admin/forms/fields/EmailField.tsx
"use client";

/**
 * Email field built on top of react-hook-form + shadcn/ui Form primitives.
 * Fully typed and reusable across forms.
 */

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { FieldValues, Path } from "react-hook-form";
import type { BaseFieldProps, WithPlaceholder } from "./types";

type EmailFieldProps<T extends FieldValues> = BaseFieldProps<T> &
  WithPlaceholder & {
    inputClassName?: string;
    autoComplete?: string;
  };

export function EmailField<T extends FieldValues>({
  control,
  name,
  label = "Email",
  description,
  className,
  disabled,
  required,
  placeholder = "you@example.com",
  inputClassName,
  autoComplete = "email",
}: EmailFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name as Path<T>}
      render={({ field }) => (
        <FormItem className={className}>
          {label ? <FormLabel>{label}</FormLabel> : null}
          {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
          <FormControl>
            <Input
              type="email"
              inputMode="email"
              autoComplete={autoComplete}
              placeholder={placeholder}
              required={required}
              disabled={disabled}
              className={inputClassName}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
