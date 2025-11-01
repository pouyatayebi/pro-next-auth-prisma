// /src/app/api/auth/[...nextauth]/route.ts
/**
 * Explicit NextAuth route binding
 * - Forces Node runtime (not Edge) to keep Prisma adapter happy
 * - Forces dynamic to avoid any caching around session handling
 */
import { handlers } from "@/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = handlers.GET;
export const POST = handlers.POST;
