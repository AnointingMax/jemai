import * as Yup from "yup";
import "dotenv/config";

const schema = Yup.object({
  NODE_ENV: Yup
    .string()
    .oneOf(["development", "test", "production"])
    .default("development"),
  // Not `.url()` — yup's URL pattern rejects localhost, which is exactly the
  // value this carries in development.
  APP_URL: Yup
    .string()
    .matches(/^https?:\/\/.+/, "APP_URL must be an absolute http(s) URL")
    .default("http://localhost:3000")
    .required(),
  DATABASE_URL: Yup
    .string()
    .required("DATABASE_URL is required — the Postgres connection string"),
  ADMIN_SESSION_SECRET: Yup
    .string()
    .min(32, "ADMIN_SESSION_SECRET must be at least 32 characters")
    .required("ADMIN_SESSION_SECRET is required — it signs the admin session JWT"),
  ADMIN_SEED_EMAIL: Yup.string().email("ADMIN_SEED_EMAIL must be an email address"),
  ADMIN_SEED_PASSWORD: Yup
    .string()
    .min(8, "ADMIN_SEED_PASSWORD must be at least 8 characters"),
  ADMIN_SEED_NAME: Yup.string().default("JEMAI Admin"),
});

/**
 * A variable exported as "" is the same as an unset one as far as this file is
 * concerned, but only `undefined` reaches a yup default — so blanks are folded
 * in before validation rather than each optional entry having to allow "".
 */
const raw = Object.fromEntries(
  Object.entries(process.env).filter(([, value]) => value !== ""),
);

const env = schema.validateSync(raw, {
  stripUnknown: true,
  abortEarly: false,
});

export default env;

