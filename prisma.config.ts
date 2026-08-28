// Must come first: lib/env validates process.env the moment it is imported.
import "dotenv/config";

import { defineConfig } from "prisma/config";

import env from "./lib/env";

export default defineConfig({
  schema: "prisma/schema",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env.DATABASE_URL,
  },
});
