import { PrismaPg } from "@prisma/adapter-pg";

import env from "./env";
import { PrismaClient } from "./generated/prisma/client";

const createPrismaClient = () => {
  const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
  return new PrismaClient({ adapter });
};

// Next.js dev hot-reload re-evaluates modules; cache the client on globalThis so
// each reload reuses one connection pool instead of opening a new one.
const globalForPrisma = globalThis as unknown as {
  prisma?: ReturnType<typeof createPrismaClient>;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
