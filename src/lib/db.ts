// /src/lib/db.ts
/**
 * Prisma Client (Neon) for Next.js 16
 * -----------------------------------
 * - No "dotenv/config" (Next injects envs).
 * - Dynamic import('ws') only on Node runtime.
 * - Caches PrismaClient on globalThis to survive HMR.
 */

import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

// Detect Node (not Edge/browser)
const isNode =
  typeof process !== "undefined" &&
  typeof process.versions !== "undefined" &&
  typeof process.versions.node !== "undefined";

if (isNode) {
  // Top-level await is supported in Next 16 server modules
  const wsMod = await import("ws");
  const WebSocketCtor = wsMod.WebSocket ?? wsMod.default ?? wsMod;
  if (WebSocketCtor) {
    neonConfig.webSocketConstructor = WebSocketCtor;
  }
  // If you target edge later:
  // neonConfig.poolQueryViaFetch = true;
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set. Define it in .env and restart the dev server.");
}

const adapter = new PrismaNeon({ connectionString });

function createClient() {
  return new PrismaClient({
    adapter,
    // log: ["query", "warn", "error"], // uncomment for verbose logs
  });
}

// Use globalThis to cache Prisma instance (HMR-safe)
const g = globalThis as unknown as { __PRISMA__?: PrismaClient };
export const db = g.__PRISMA__ ?? (g.__PRISMA__ = createClient());
