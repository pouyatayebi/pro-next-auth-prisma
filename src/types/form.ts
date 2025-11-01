// /types/form.ts
export type FormState = {
  success: boolean;
  version?: number;
  fields?: Record<string, string>;
  errors?: Record<string, string[]>;
};
