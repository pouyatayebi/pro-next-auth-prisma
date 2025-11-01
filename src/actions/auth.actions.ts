// /src/actions/auth.actions.ts
"use server";
/**
 * Auth Server Actions (Form-friendly)
 * -----------------------------------
 * - Credentials login uses `redirect:false` (no NEXT_REDIRECT throw).
 * - After signIn, we optionally verify Session row existence (database strategy) and return a
 *   client-side redirect hint so the UI can navigate to `/user`.
 */

import { signIn, signOut } from "@/auth";
import { db } from "@/lib/db";
import { sendEmailVerificationLink } from "@/lib/email";
import { createEmailVerificationToken } from "@/lib/tokens";
import type { FormState } from "@/types/form";
import { AuthSchema } from "@/zod-validations";
import type { SignInCredentialsInput, SignUpInput } from "@/zod-validations/auth/types";
import { compare, hash } from "bcryptjs";
import { AuthError } from "next-auth";

function tag(t: string) {
  return `[auth.actions:${t}] ${new Date().toISOString()}`;
}

/** Sign Up: reads FormData, validates, creates user, sends verification link */
export async function signUpFormAction(
  _prev: FormState | null,
  formData: FormData,
): Promise<FormState> {
  console.group(tag("signUp:start"));
  const input: SignUpInput = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    confirmPassword: String(formData.get("confirmPassword") ?? ""),
  };
  console.log("payload(FormData):", { name: input.name, email: input.email });

  const parsed = AuthSchema.signupSchema.safeParse(input);
  if (!parsed.success) {
    const issues = parsed.error.flatten();
    console.warn("validation_failed:", issues.fieldErrors);
    console.groupEnd();
    return {
      success: false,
      version: Date.now(),
      errors: {
        name: issues.fieldErrors.name ?? [],
        email: issues.fieldErrors.email ?? [],
        password: issues.fieldErrors.password ?? [],
        confirmPassword: issues.fieldErrors.confirmPassword ?? [],
      },
    };
  }

  const { name, email, password } = parsed.data;

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    console.warn("user_exists:", { email });
    console.groupEnd();
    return {
      success: false,
      version: Date.now(),
      errors: { _form: ["User already exists"] },
    };
  }

  const hashed = await hash(password, 10);
  const user = await db.user.create({
    data: { name, email, password: hashed },
    select: { id: true, email: true },
  });
  console.log("user_created:", user);

  const { token } = await createEmailVerificationToken(email);
  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const verifyUrl = `${baseUrl}/verify?email=${encodeURIComponent(email)}&token=${encodeURIComponent(
    token,
  )}`;
  console.log("verify_link:", verifyUrl);

  try {
    await sendEmailVerificationLink(email, verifyUrl);
    console.log("verification_email_sent:", { to: email });
  } catch (err) {
    console.error("email_send_error:", err);
    console.groupEnd();
    return {
      success: false,
      version: Date.now(),
      errors: { _form: ["Could not send the verification email. Check SMTP settings."] },
    };
  }

  console.groupEnd();
  return { success: true, version: Date.now(), fields: { userId: user.id } };
}

/**
 * Sign In (credentials)
 * - Validates input and password
 * - Calls NextAuth signIn with redirect:false
 * - Returns `fields.redirectTo` so client can navigate to `/user`
 */
export async function signInFormAction(
  _prev: FormState | null,
  formData: FormData,
): Promise<FormState> {
  console.group(tag("signIn:start"));
  const input: SignInCredentialsInput = {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  };
  console.log("payload(FormData):", { email: input.email });

  const parsed = AuthSchema.signInCredentialsSchema.safeParse(input);
  if (!parsed.success) {
    const issues = parsed.error.flatten();
    console.warn("validation_failed:", issues.fieldErrors);
    console.groupEnd();
    return {
      success: false,
      version: Date.now(),
      errors: {
        email: issues.fieldErrors.email ?? [],
        password: issues.fieldErrors.password ?? [],
      },
    };
  }

  const { email, password } = parsed.data;

  const user = await db.user.findUnique({
    where: { email },
    select: { id: true, emailVerified: true, password: true },
  });

  if (!user) {
    console.warn("user_not_found:", { email });
    console.groupEnd();
    return {
      success: false,
      version: Date.now(),
      errors: { _form: ["No account found with this email"] },
    };
  }
  if (!user.emailVerified) {
    console.warn("user_not_verified:", { email, id: user.id });
    console.groupEnd();
    return {
      success: false,
      version: Date.now(),
      errors: {
        _form: ["You signed up but your email is not verified yet. Please check your inbox."],
      },
    };
  }
  if (!user.password) {
    console.warn("oauth_only_account:", { email, id: user.id });
    console.groupEnd();
    return {
      success: false,
      version: Date.now(),
      errors: { _form: ["This account uses a different sign-in method."] },
    };
  }

  const ok = await compare(password, user.password);
  if (!ok) {
    console.warn("invalid_password:", { email, id: user.id });
    console.groupEnd();
    return { success: false, version: Date.now(), errors: { _form: ["Invalid credentials"] } };
  }

  try {
    console.log("nextauth_signIn_call:", {
      provider: "credentials",
      redirect: false,
      redirectTo: "/user",
    });

    // Set cookie + DB session; do not throw NEXT_REDIRECT
    await signIn("credentials", { email, password, redirect: false, redirectTo: "/user" });

    // (Optional) You can inspect DB session row here if you wish (left out to reduce noise)
    console.groupEnd();
    return { success: true, version: Date.now(), fields: { redirectTo: "/user" } };
  } catch (e) {
    if (e instanceof AuthError) {
      console.error("nextauth_auth_error:", { type: e.type, cause: e.cause });
      console.groupEnd();
      return { success: false, version: Date.now(), errors: { _form: ["Sign-in failed"] } };
    }
    console.error("unexpected_error:", e);
    console.groupEnd();
    return { success: false, version: Date.now(), errors: { _form: ["Unexpected error"] } };
  }
}

/** Google OAuth sign-in (server redirect thrown; call inside startTransition) */
export async function signInWithGoogleAction(): Promise<FormState> {
  console.group(tag("googleSignIn:start"));
  try {
    await signIn("google", { redirectTo: "/user" });
    console.log("google_signIn_returned_without_redirect (unexpected)");
    console.groupEnd();
    return { success: true, version: Date.now() };
  } catch (e) {
    if (e instanceof AuthError) {
      console.error("google_auth_error:", { type: e.type, cause: e.cause });
      console.groupEnd();
      return { success: false, version: Date.now(), errors: { _form: ["Google sign-in failed"] } };
    }
    console.log("non-AuthError thrown (likely redirect):", e);
    console.groupEnd();
    throw e;
  }
}

// /src/actions/auth.actions.ts — اضافه در انتهای فایل
/**
 * Sign Out (server action)
 * ------------------------
 * - Calls NextAuth `signOut` and redirects to the given URL (default: /auth).
 * - When called from a Client Component inside `startTransition`, the thrown redirect
 *   will be handled by Next.js navigation.
 */
export async function signOutAction(redirectTo = "/auth"): Promise<FormState> {
  // Avoid throwing NEXT_REDIRECT
  await signOut({ redirect: false });
  return { success: true, version: Date.now(), fields: { redirectTo } };
}
