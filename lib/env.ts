import * as Yup from "yup";
import "dotenv/config";

const schema = Yup.object({
  NODE_ENV: Yup
    .string()
    .oneOf(["development", "test", "production"])
    .default("development"),
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

const env = schema.validateSync(process.env, {
  stripUnknown: true,
  abortEarly: false,
});

export default env;

