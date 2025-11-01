// /src/store/auth.store.ts
"use client";
/**
 * Auth UI Store (Zustand)
 * -----------------------
 * Holds transient UI state for auth forms (loading flags and messages).
 * Does not store tokens; Auth.js manages session.
 */

import { create } from "zustand";

type AuthUIState = {
  signingUp: boolean;
  signingIn: boolean;
  googleSigningIn: boolean;

  formError: string | null;
  successMessage: string | null;

  setSigningUp: (v: boolean) => void;
  setSigningIn: (v: boolean) => void;
  setGoogleSigningIn: (v: boolean) => void;
  setFormError: (msg: string | null) => void;
  setSuccessMessage: (msg: string | null) => void;
  reset: () => void;
};

export const useAuthStore = create<AuthUIState>((set) => ({
  signingUp: false,
  signingIn: false,
  googleSigningIn: false,

  formError: null,
  successMessage: null,

  setSigningUp: (v) => set({ signingUp: v }),
  setSigningIn: (v) => set({ signingIn: v }),
  setGoogleSigningIn: (v) => set({ googleSigningIn: v }),
  setFormError: (msg) => set({ formError: msg }),
  setSuccessMessage: (msg) => set({ successMessage: msg }),

  reset: () =>
    set({
      signingUp: false,
      signingIn: false,
      googleSigningIn: false,
      formError: null,
      successMessage: null,
    }),
}));
