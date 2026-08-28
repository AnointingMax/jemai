import jwt from "jsonwebtoken";

import env from "@/lib/env";
import { prisma } from "@/lib/prisma";

/** How long a reset link stays good for. Short on purpose — it arrives by email. */
const TOKEN_TTL = "1h";

/**
 * The key a reset token is signed with. Two things are folded into the session
 * secret: a literal that keeps a reset token from ever verifying as a session
 * token, and the admin's current password hash — which is what makes the link
 * single-use. The moment the reset lands, the hash changes and every token
 * signed against the old one stops verifying, with no table to sweep.
 */
const resetSecret = (passwordHash: string) =>
  `${env.ADMIN_SESSION_SECRET}.password-reset.${passwordHash}`;

type ResetClaims = { email: string };

export const signPasswordResetToken = (admin: {
  id: string;
  email: string;
  passwordHash: string;
}) =>
  jwt.sign({ email: admin.email } satisfies ResetClaims, resetSecret(admin.passwordHash), {
    algorithm: "HS256",
    subject: admin.id,
    expiresIn: TOKEN_TTL,
  });

/**
 * Trades a token for the admin it was minted for, or null when it is malformed,
 * expired, already spent, or belongs to an account that has since been
 * deactivated. The subject is read unverified only to find the row whose hash
 * the signature is then actually checked against.
 */
export const verifyPasswordResetToken = async (token: string) => {
  const unverified = jwt.decode(token);
  if (!unverified || typeof unverified === "string" || !unverified.sub) return null;

  const admin = await prisma.admin.findUnique({ where: { id: unverified.sub } });
  if (!admin || !admin.isActive) return null;

  try {
    jwt.verify(token, resetSecret(admin.passwordHash), { algorithms: ["HS256"] });
  } catch {
    return null;
  }

  return admin;
};
