import * as Yup from "yup";
import "dotenv/config";

const schema = Yup.object({
  NODE_ENV: Yup.string().oneOf(["development", "test", "production"]).default("development"),
  APP_URL: Yup.string().matches(/^https?:\/\/.+/, "APP_URL must be an absolute http(s) URL").default("http://localhost:3000").required(),

  DATABASE_URL: Yup.string().required("DATABASE_URL is required — the Postgres connection string"),

  ADMIN_SESSION_SECRET: Yup.string().min(32, "ADMIN_SESSION_SECRET must be at least 32 characters").required("ADMIN_SESSION_SECRET is required — it signs the admin session JWT"),

  ADMIN_SEED_EMAIL: Yup.string().email("ADMIN_SEED_EMAIL must be an email address"),
  ADMIN_SEED_PASSWORD: Yup.string().min(8, "ADMIN_SEED_PASSWORD must be at least 8 characters"),
  ADMIN_SEED_NAME: Yup.string().default("JEMAI Admin"),

  PAYSTACK_SECRET_KEY: Yup.string().matches(/^sk_(test|live)_/, "PAYSTACK_SECRET_KEY must be a Paystack secret key (sk_test_… or sk_live_…)"),

  RESEND_API_KEY: Yup.string().matches(/^re_/, "RESEND_API_KEY must be a Resend API key (re_…)"),
  MAIL_FROM: Yup.string().matches(/^(.+<)?[^@<>\s]+@[^@<>\s]+(>)?$/, "MAIL_FROM must be an address, optionally as \"Name <address>\""),
  MAIL_REPLY_TO: Yup.string().email("MAIL_REPLY_TO must be an email address"),

  CLOUDINARY_URL: Yup.string().matches(/^cloudinary:\/\/[^:@/]+:[^:@/]+@[^:@/]+$/, "CLOUDINARY_URL must look like cloudinary://<api_key>:<api_secret>@<cloud_name>"),
});

const raw = Object.fromEntries(
  Object.entries(process.env).filter(([, value]) => value !== ""),
);

const env = schema.validateSync(raw, {
  stripUnknown: true,
  abortEarly: false,
});

export default env;

