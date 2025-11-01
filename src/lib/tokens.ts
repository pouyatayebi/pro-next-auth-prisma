// /src/lib/tokens.ts
/**
 * Helpers to create and consume email verification tokens
 * using Prisma's VerificationToken model.
 *
 * - createEmailVerificationToken(email, ttlMinutes): generates and stores a token
 * - consumeEmailVerificationToken(email, token): validates & deletes the token
 */

import { db } from "@/lib/db";
import crypto from "crypto";

/** Create a verification token for an email and store it in DB. */
export async function createEmailVerificationToken(
  email: string,
  ttlMinutes = 30,
): Promise<{ token: string; expires: Date }> {
  const identifier = email.toLowerCase();
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + ttlMinutes * 60 * 1000);

  // Clean existing tokens for this email (optional but keeps table clean)
  await db.verificationToken.deleteMany({ where: { identifier } });

  await db.verificationToken.create({
    data: { identifier, token, expires },
  });

  return { token, expires };
}

/** Validate and delete a verification token. Returns true if valid. */
export async function consumeEmailVerificationToken(
  email: string,
  token: string,
): Promise<boolean> {
  const identifier = email.toLowerCase();

  const found = await db.verificationToken.findUnique({ where: { token } });
  if (!found || found.identifier !== identifier) return false;
  if (found.expires < new Date()) {
    await db.verificationToken.delete({ where: { token } });
    return false;
  }

  // Valid: delete the token to prevent reuse
  await db.verificationToken.delete({ where: { token } });
  return true;
}
