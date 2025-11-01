// /src/zod-validations/auth/types.ts
/**
 * Auth Type Helpers (derived from Zod schemas)
 * --------------------------------------------
 * These types are inferred from the Zod schemas in `schema.ts`.
 * Import these types across the app to keep everything in sync.
 */

import { z } from "zod";
import { signInCredentialsSchema, signupSchema, verifyEmailSchema } from "./schema";

export type SignUpInput = z.infer<typeof signupSchema>;
export type SignInCredentialsInput = z.infer<typeof signInCredentialsSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
