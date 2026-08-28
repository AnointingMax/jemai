// Must come first: lib/env validates process.env the moment it is imported.
import "dotenv/config";

import { hashPassword } from "../lib/admin/auth/password";
import { ADMIN_PERMISSIONS } from "../lib/admin/auth/permissions";
import env from "../lib/env";
import { prisma } from "../lib/prisma";

const required = <T,>(value: T | undefined, name: string) => {
  if (!value) throw new Error(`Missing ${name} — set it in .env`);
  return value;
};

const main = async () => {
  const email = required(env.ADMIN_SEED_EMAIL, "ADMIN_SEED_EMAIL").toLowerCase();
  const name = env.ADMIN_SEED_NAME;
  const passwordHash = await hashPassword(
    required(env.ADMIN_SEED_PASSWORD, "ADMIN_SEED_PASSWORD"),
  );

  const permissions = [...ADMIN_PERMISSIONS];

  const admin = await prisma.admin.upsert({
    where: { email },
    // Re-running the seed refreshes the password and restores full access.
    update: { name, passwordHash, permissions, isActive: true },
    create: { email, name, passwordHash, permissions },
  });

  console.log(`Seeded admin ${admin.email} (${admin.permissions.length} permissions)`);
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
