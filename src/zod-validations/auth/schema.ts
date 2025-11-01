// /src/zod-validations/auth/schema.ts
/**
 * Auth Zod Schemas
 * -----------------
 * Single source of truth for all auth-related validations:
 * - signupSchema: name, email, password, confirmPassword (with equality refine)
 * - signInCredentialsSchema: email, password
 * - verifyEmailSchema: email, token (for email verification flow)
 *
 * Notes:
 * - Avoid deprecated required_error syntax for compatibility with latest zod.
 * - Normalize email (lowercase) via .transform.
 */

import { z } from "zod";

export const signupSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(100, "Name is too long"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email")
      .transform((v) => v.toLowerCase()),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const signInCredentialsSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email")
    .transform((v) => v.toLowerCase()),
  password: z.string().min(1, "Password is required"),
});

export const verifyEmailSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email")
    .transform((v) => v.toLowerCase()),
  token: z.string().min(1, "Token is required").max(256, "Token is too long"),
});
