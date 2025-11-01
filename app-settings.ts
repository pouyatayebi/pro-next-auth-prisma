// All settings for the app in one place.
// Reads from environment variables with sensible defaults.
// Use these constants across the app to avoid hard-coding.

export type Direction = "ltr" | "rtl";

export const APP = {
  // Project identity (shown in <title>, meta, header, etc.)
  name: process.env.NEXT_PUBLIC_APP_NAME ?? "My Next Starter",
  slogan: process.env.NEXT_PUBLIC_APP_SLOGAN ?? "Build fast. Ship polished.",
  // Default UI direction; can be overridden per-project (rtl/ltr)
  dir: (process.env.NEXT_PUBLIC_APP_DIR as Direction) ?? "ltr",
  // Default language tag for the document (<html lang="...">)
  language: process.env.NEXT_PUBLIC_APP_LANG ?? "en",
} as const;
