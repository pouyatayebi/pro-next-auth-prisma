// /components/admin/forms/fields/types.ts
/**
 * Shared types & helpers for admin form fields.
 */
import * as React from "react";
import type { Control, FieldValues, Path } from "react-hook-form";

export type BaseFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  required?: boolean;
};

export type WithPlaceholder = {
  placeholder?: string;
};

// Basic option shape if needed later (e.g., select fields)
export type Option = { label: React.ReactNode; value: string };

export function cn(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}
