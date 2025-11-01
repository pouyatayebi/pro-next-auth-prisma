// /src/components/admin/forms/AuthForm.tsx
"use client";
/**
 * Unified Auth Form (Sign In / Sign Up)
 * -------------------------------------
 * - `useActionState` wired directly to server actions via `action` prop.
 * - Client-side validation (react-hook-form + zod) blocks invalid submits.
 * - On successful credentials login: client navigates to `/user` and refreshes.
 * - Toasts via `sonner`; UI flags via zustand store.
 */

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useActionState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import SubmitBtn from "@/components/admin/forms/common/SubmitBtn";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FcGoogle } from "react-icons/fc";

import {
  CheckboxField,
  EmailField,
  PasswordField,
  TextField,
} from "@/components/admin/forms/fields";

import { signInFormAction, signInWithGoogleAction, signUpFormAction } from "@/actions/auth.actions";
import { useAuthStore } from "@/store/auth.store";
import { AuthSchema, AuthTypes } from "@/zod-validations";

type Mode = "signin" | "signup";
type SignUpFormValues = AuthTypes.SignUpInput & { accept?: boolean };

export default function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = React.useState<Mode>("signin");

  const {
    setSigningIn,
    setSigningUp,
    setGoogleSigningIn,
    signingIn,
    signingUp,
    googleSigningIn,
    formError,
    setFormError,
    setSuccessMessage,
  } = useAuthStore();

  const [pendingGoogle, startGoogle] = useTransition();

  const signInForm = useForm<AuthTypes.SignInCredentialsInput>({
    resolver: zodResolver(AuthSchema.signInCredentialsSchema),
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
  });

  const signUpForm = useForm<SignUpFormValues>({
    resolver: zodResolver(AuthSchema.signupSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "", accept: false },
    mode: "onSubmit",
  });

  const [signInState, signInDispatch, signInPending] = useActionState(signInFormAction, null);
  const [signUpState, signUpDispatch, signUpPending] = useActionState(signUpFormAction, null);

  React.useEffect(() => setSigningIn(signInPending), [signInPending, setSigningIn]);
  React.useEffect(() => setSigningUp(signUpPending), [signUpPending, setSigningUp]);

  // Handle credentials sign-in result (client navigation)
  React.useEffect(() => {
    if (!signInState) return;

    if (signInState.success) {
      setSuccessMessage("Signed in successfully");
      toast.success("Signed in successfully");
      const dest = signInState.fields?.redirectTo ?? "/user";
      router.replace(dest);
      router.refresh(); // ensure SSR sees the fresh session cookie
    } else if (signInState.errors) {
      const errors = signInState.errors;
      if (errors._form?.[0]) setFormError(errors._form[0]);
      if (errors.email?.[0]) signInForm.setError("email", { message: errors.email[0] });
      if (errors.password?.[0]) signInForm.setError("password", { message: errors.password[0] });

      if (errors._form?.[0]) toast.error(errors._form[0]);
      else toast.error("Sign in failed");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signInState]);

  // Handle sign-up result (just feedback)
  React.useEffect(() => {
    if (!signUpState) return;

    if (signUpState.success) {
      setSuccessMessage("Verification email sent. Please check your inbox.");
      toast.success("Verification email sent. Please check your inbox.");
    } else if (signUpState.errors) {
      const errors = signUpState.errors;
      if (errors._form?.[0]) setFormError(errors._form[0]);
      if (errors.name?.[0]) signUpForm.setError("name", { message: errors.name[0] });
      if (errors.email?.[0]) signUpForm.setError("email", { message: errors.email[0] });
      if (errors.password?.[0]) signUpForm.setError("password", { message: errors.password[0] });
      if (errors.confirmPassword?.[0])
        signUpForm.setError("confirmPassword", { message: errors.confirmPassword[0] });

      if (errors._form?.[0]) toast.error(errors._form[0]);
      else toast.error("Sign up failed");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signUpState]);

  const onGoogle = () => {
    startGoogle(async () => {
      setGoogleSigningIn(true);
      try {
        await signInWithGoogleAction(); // server-side redirect thrown & handled by Next
      } finally {
        setGoogleSigningIn(false);
      }
    });
  };

  return (
    <div className="mx-auto w-full max-w-md">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          {mode === "signin" ? "Welcome back" : "Create your account"}
        </h1>
        <Button
          type="button"
          variant="link"
          className="px-0"
          onClick={() => {
            setFormError(null);
            setMode((m) => (m === "signin" ? "signup" : "signin"));
          }}
        >
          {mode === "signin" ? "Create account" : "I already have an account"}
        </Button>
      </div>

      {/* Google button */}
      <Button
        variant="outline"
        className="w-full mb-4"
        onClick={onGoogle}
        disabled={pendingGoogle || googleSigningIn}
      >
        <span className="mr-2 inline-flex">
          <FcGoogle size={18} />
        </span>
        Continue with Google
      </Button>

      {/* Divider */}
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-muted-foreground">Or continue with email</span>
        </div>
      </div>

      {/* Forms */}
      {mode === "signin" ? (
        <Form {...signInForm}>
          <form
            className="space-y-4"
            action={signInDispatch}
            onSubmit={async (e) => {
              const valid = await signInForm.trigger();
              if (!valid) {
                e.preventDefault();
                return;
              }
              setFormError(null);
            }}
          >
            <EmailField control={signInForm.control} name="email" />
            <PasswordField control={signInForm.control} name="password" />
            {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
            <SubmitBtn label="Sign in" pending={signingIn || signInPending} className="w-full" />
          </form>
        </Form>
      ) : (
        <Form {...signUpForm}>
          <form
            className="space-y-4"
            action={signUpDispatch}
            onSubmit={async (e) => {
              const valid = await signUpForm.trigger();
              if (!valid) {
                e.preventDefault();
                return;
              }
              setFormError(null);
            }}
          >
            <TextField control={signUpForm.control} name="name" label="Name" />
            <EmailField control={signUpForm.control} name="email" />
            <PasswordField control={signUpForm.control} name="password" label="Password" />
            <PasswordField
              control={signUpForm.control}
              name="confirmPassword"
              label="Confirm password"
              autoComplete="new-password"
            />
            {/* Optional future UX (hidden for now) */}
            <CheckboxField control={signUpForm.control} name="accept" className="hidden" />
            {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
            <SubmitBtn
              label="Create account"
              pending={signingUp || signUpPending}
              className="w-full"
            />
          </form>
        </Form>
      )}
    </div>
  );
}
