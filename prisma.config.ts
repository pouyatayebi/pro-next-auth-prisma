// /prisma.config.ts
// Load .env BEFORE reading any env variables.
import "dotenv/config";
import { defineConfig } from "prisma/config";

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("Missing DATABASE_URL. Make sure .env is loaded at project root.");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    // Now safe to reference it because dotenv has already loaded .env
    url,
  },
});
