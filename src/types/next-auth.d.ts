// /src/types/next-auth.d.ts
import type { Role } from "@prisma/client";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: { id: string; role: Role } & DefaultSession["user"];
  }
  interface User {
    id: string;
    role: Role;
  }
}

declare module "next-auth/adapters" {
  interface AdapterUser {
    role?: Role; // ← optional to avoid adapter signature conflicts
  }
}
