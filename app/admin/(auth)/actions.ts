"use server";

import * as Yup from "yup";

import { failWith, ok, validate, type ActionResult } from "@/lib/action-result";
import { sendPasswordResetEmail } from "@/lib/admin/auth/mailer";
import { hashPassword, needsRehash, verifyPassword } from "@/lib/admin/auth/password";
import {
  signPasswordResetToken,
  verifyPasswordResetToken,
} from "@/lib/admin/auth/reset-token";
import {
  createAdminSession,
  destroyAdminSession,
  type AdminSession,
} from "@/lib/admin/auth/session";
import { prisma } from "@/lib/prisma";

/**
 * One message for a wrong address and a wrong password alike. Telling them apart
 * would let anyone walk a list of emails and learn which ones have accounts.
 */
const INVALID_CREDENTIALS = "Email or password is incorrect";

/**
 * Signs an admin in and sets the session cookie. The caller does the navigation
 * so a failure can surface as a toast on the frame the reader is already on.
 */
export const signInAction = async (
  values: unknown,
): Promise<ActionResult<Pick<AdminSession, "name" | "email">>> => {
  const parsed = await validate(
    Yup.object({
      email: Yup
        .string()
        .trim()
        .lowercase()
        .required("Enter your email address")
        .email("Enter a valid email address"),
      // Sign-in checks the password against a hash, so a length rule here would
      // only leak what the stored password looks like. Presence is all it asks.
      password: Yup.string().required("Enter your password"),
    }),
    values,
  );
  if (parsed.error) return parsed;

  const { email, password } = parsed.data;

  try {
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin || !admin.isActive) return { error: true, message: INVALID_CREDENTIALS };

    const matches = await verifyPassword(password, admin.passwordHash);
    if (!matches) return { error: true, message: INVALID_CREDENTIALS };

    // A correct password is the only moment the plaintext is in hand, so it is
    // the only moment a hash written under an older cost can be brought forward.
    if (needsRehash(admin.passwordHash))
      await prisma.admin.update({
        where: { id: admin.id },
        data: { passwordHash: await hashPassword(password) },
      });

    await createAdminSession({
      sub: admin.id,
      email: admin.email,
      name: admin.name,
      permissions: admin.permissions,
    });

    return ok({ name: admin.name, email: admin.email });
  } catch (error) {
    return failWith("Could not sign you in. Please try again.", error);
  }
};

export const signOutAction = async (): Promise<ActionResult<string>> => {
  try {
    await destroyAdminSession();
    return ok("You have been signed out");
  } catch (error) {
    return failWith("Could not sign you out. Please try again.", error);
  }
};

/**
 * Starts password recovery. It reports success for an address that has no
 * account too — the reply is the same either way, for the same reason sign-in
 * gives one message.
 */
export const requestPasswordResetAction = async (
  values: unknown,
): Promise<ActionResult<{ email: string }>> => {
  const parsed = await validate(
    Yup.object({
      email: Yup
        .string()
        .trim()
        .lowercase()
        .required("Enter your email address")
        .email("Enter a valid email address"),
    }),
    values,
  );
  if (parsed.error) return parsed;

  const { email } = parsed.data;

  try {
    const admin = await prisma.admin.findUnique({ where: { email } });

    if (admin?.isActive)
      await sendPasswordResetEmail(admin.email, signPasswordResetToken(admin));

    return ok({ email });
  } catch (error) {
    return failWith("Could not send the reset link. Please try again.", error);
  }
};

/** Finishes recovery: verifies the link's token and writes the new password. */
export const resetPasswordAction = async (
  values: unknown,
): Promise<ActionResult<string>> => {
  const parsed = await validate(
    Yup.object({
      token: Yup.string().trim().required("This reset link is missing its token"),
      password: Yup
        .string()
        .required("Enter your new password")
        .min(8, "Password must be at least 8 characters"),
      confirmPassword: Yup
        .string()
        .required("Confirm your new password")
        .oneOf([Yup.ref("password")], "Both passwords must match"),
    }),
    values,
  );
  if (parsed.error) return parsed;

  const { token, password } = parsed.data;

  try {
    const admin = await verifyPasswordResetToken(token);
    if (!admin)
      return { error: true, message: "This reset link has expired or already been used" };

    // Writing the hash is also what spends the link: the token was signed
    // against the old one, so it stops verifying the moment this lands.
    await prisma.admin.update({
      where: { id: admin.id },
      data: { passwordHash: await hashPassword(password) },
    });

    // The password just changed, so any session opened under the old one should
    // not survive the reset on this device.
    await destroyAdminSession();

    return ok("Your password has been reset");
  } catch (error) {
    return failWith("Could not reset your password. Please try again.", error);
  }
};
