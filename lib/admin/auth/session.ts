import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import env from "@/lib/env";

export const ADMIN_SESSION_COOKIE = "jemai_admin_session";

const SESSION_MAX_AGE = 60 * 60 * 24 * 30;

export type AdminSession = {
  sub: string;
  email: string;
  name: string;
  permissions: string[];
};

export const signSessionToken = (session: AdminSession) =>
  jwt.sign(session, env.ADMIN_SESSION_SECRET, {
    algorithm: "HS256",
    expiresIn: SESSION_MAX_AGE,
  });

export const verifySessionToken = (token: string): AdminSession | null => {
  try {
    const payload = jwt.verify(token, env.ADMIN_SESSION_SECRET, { algorithms: ["HS256"] });
    if (typeof payload === "string" || !payload.sub) return null;

    const { sub, email, name, permissions } = payload as jwt.JwtPayload & AdminSession;
    return { sub, email, name, permissions: permissions ?? [] };
  } catch {
    return null;
  }
};

export const createAdminSession = async (session: AdminSession) => {
  const store = await cookies();
  store.set(ADMIN_SESSION_COOKIE, signSessionToken(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
};

export const readAdminSession = async () => {
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  return token ? verifySessionToken(token) : null;
};

export const destroyAdminSession = async () => {
  (await cookies()).delete(ADMIN_SESSION_COOKIE);
};

/**
 * The guard every screen under `(dashboard)` runs. A missing or expired cookie
 * lands the visitor on the sign-in frame instead of a half-rendered console.
 */
export const requireAdminSession = async () => {
  const session = await readAdminSession();
  if (!session) redirect("/admin/login");
  return session;
};
