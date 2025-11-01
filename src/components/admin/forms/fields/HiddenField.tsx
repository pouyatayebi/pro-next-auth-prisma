// File: components/admin/forms/fields/HiddenField.tsx
"use client";

type HiddenFieldProps = {
  name: string;
  value: string;
  nameOverride?: string;
  id?: string;
};

export function HiddenField({ name, value, nameOverride, id }: HiddenFieldProps) {
  return <input type="hidden" id={id ?? name} name={nameOverride ?? name} value={value} />;
}
