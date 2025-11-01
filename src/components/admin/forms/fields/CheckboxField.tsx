// /components/admin/forms/fields/CheckboxField.tsx
"use client";

/**
 * Checkbox field (boolean) with label and description.
 */

import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import * as React from "react";
import type { FieldValues, Path } from "react-hook-form";
import type { BaseFieldProps } from "./types";

type CheckboxFieldProps<T extends FieldValues> = BaseFieldProps<T> & {
  hint?: React.ReactNode;
};

export function CheckboxField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  hint,
  className,
  disabled,
  required,
}: CheckboxFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name as Path<T>}
      render={({ field }) => (
        <FormItem className={className}>
          <div className="flex items-center gap-2">
            <FormControl>
              <Checkbox
                checked={!!field.value}
                onCheckedChange={(v) => field.onChange(Boolean(v))}
                disabled={disabled}
                required={required}
              />
            </FormControl>
            {label ? <FormLabel className="!mt-0">{label}</FormLabel> : null}
          </div>
          {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
          {hint ? <p className="text-xs">{hint}</p> : null}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
