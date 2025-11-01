// ESLint flat config for Next.js + TypeScript + Prettier.
// - Aligns with Next core-web-vitals + TS
// - Runs Prettier as an ESLint rule
// - Disables react-hooks/purity ONLY for shadcn-generated UI files

import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettierConfig from "eslint-config-prettier";
import pluginPrettier from "eslint-plugin-prettier";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  // Next recommended configs
  ...nextVitals,
  ...nextTs,

  // Turn off rules that conflict with Prettier
  prettierConfig,

  // General project rules
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: {
      prettier: pluginPrettier,
    },
    rules: {
      "prettier/prettier": ["error", { endOfLine: "lf" }],
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },

  // ⛳ Override ONLY for shadcn-generated UI components
  // Do NOT touch the source files; just relax purity here.
  {
    files: ["src/components/ui/**/*.{ts,tsx}"],
    rules: {
      "react-hooks/purity": "off",
    },
  },

  // Ignores
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "dist/**", "coverage/**"]),
]);
