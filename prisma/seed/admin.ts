import { hashPassword } from "../../lib/admin/auth/password";
import { ADMIN_PERMISSIONS } from "../../lib/admin/auth/permissions";
import env from "../../lib/env";
import { prisma } from "../../lib/prisma";

const required = <T,>(value: T | undefined, name: string) => {
  if (!value) throw new Error(`Missing ${name} — set it in .env`);
  return value;
};

/**
 * The one account the console is reachable through. Unlike the catalogue seeds
 * this is an upsert, not a skip-if-present: re-running it is how a locked-out
 * developer gets back in.
 */
export const seedAdmin = async () => {
  const email = required(env.ADMIN_SEED_EMAIL, "ADMIN_SEED_EMAIL").toLowerCase();
  const name = env.ADMIN_SEED_NAME;
  const passwordHash = await hashPassword(
    required(env.ADMIN_SEED_PASSWORD, "ADMIN_SEED_PASSWORD"),
  );

  const permissions = [...ADMIN_PERMISSIONS];

  return prisma.admin.upsert({
    where: { email },
    // Re-running the seed refreshes the password and restores full access.
    update: { name, passwordHash, permissions, isActive: true },
    create: { email, name, passwordHash, permissions },
  });
};
