// File: components/admin/forms/fields/TextField.tsx
"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import * as React from "react";
import type { Control, FieldValues, Path } from "react-hook-form";

type NativeInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "name" | "value" | "defaultValue"
>;

type TextFieldProps<TFieldValues extends FieldValues> = NativeInputProps & {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label?: string;
  inputClassName?: string;
};

export function TextField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  className,
  inputClassName,
  ...inputProps
}: TextFieldProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input {...field} {...inputProps} className={inputClassName} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
