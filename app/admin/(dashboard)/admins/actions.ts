"use server";

import { revalidatePath } from "next/cache";
import * as Yup from "yup";

import { failWith, fail, ok, validate, type ActionResult } from "@/lib/action-result";
import {
  countActiveAdmins,
  inviteAdmin,
  setAdminActive,
  type AdminAccount,
} from "@/lib/admin/admins";
import {
  ADMIN_PERMISSIONS,
  hasPermission,
  type AdminPermission,
} from "@/lib/admin/auth/permissions";
import { readActiveAdmin } from "@/lib/admin/auth/session";
import { MIN_ADMIN_PASSWORD_LENGTH } from "@/lib/constants";

const invitePayload = () =>
  Yup.object({
    name: Yup.string().trim().required("Enter their name."),
    email: Yup
      .string()
      .trim()
      .lowercase()
      .required("Enter their email address.")
      .email("Enter a valid email address."),
    password: Yup
      .string()
      .required("Set a password for them.")
      .min(MIN_ADMIN_PASSWORD_LENGTH, `Use at least ${MIN_ADMIN_PASSWORD_LENGTH} characters.`),
    permissions: Yup
      .array()
      .of(Yup.string().trim().oneOf(ADMIN_PERMISSIONS, "Unknown permission."))
      .min(1, "Give them at least one section to work in.")
      .required("Give them at least one section to work in."),
  });

export const inviteAdminAction = async (
  values: unknown,
): Promise<ActionResult<AdminAccount>> => {
  const session = await readActiveAdmin();
  if (!session) return fail("Your session has expired. Sign in again.");
  if (!hasPermission(session.permissions, "admins"))
    return fail("You do not have access to administrator accounts.");

  const parsed = await validate(invitePayload(), values);
  if (parsed.error) return parsed;

  const permissions = parsed.data.permissions as AdminPermission[];

  const beyond = permissions.filter(
    (permission) => !hasPermission(session.permissions, permission),
  );
  if (beyond.length)
    return fail(
      `You cannot grant a permission you do not hold yourself: ${beyond.join(", ")}.`,
    );

  try {
    const admin = await inviteAdmin({ ...parsed.data, permissions });
    if (!admin) return fail("An account already exists on that email address.");

    revalidatePath("/admin/admins");
    return ok(admin);
  } catch (error) {
    return failWith("Could not open that account just now. Try again.", error);
  }
};

const activePayload = () =>
  Yup.object({
    id: Yup.string().trim().required("Pick an administrator."),
    isActive: Yup.boolean().required("Say whether the account is active."),
  });

export const setAdminActiveAction = async (
  values: unknown,
): Promise<ActionResult<string>> => {
  const session = await readActiveAdmin();
  if (!session) return fail("Your session has expired. Sign in again.");
  if (!hasPermission(session.permissions, "admins"))
    return fail("You do not have access to administrator accounts.");

  const parsed = await validate(activePayload(), values);
  if (parsed.error) return parsed;

  const { id, isActive } = parsed.data;

  if (id === session.id && !isActive)
    return fail("You cannot close your own account.");

  try {
    if (!isActive && (await countActiveAdmins()) <= 1)
      return fail("This is the last account that can sign in. Open another one first.");

    const admin = await setAdminActive(id, isActive);

    revalidatePath("/admin/admins");
    return ok(
      isActive ? `${admin.name} can sign in again` : `${admin.name} can no longer sign in`,
    );
  } catch (error) {
    return failWith("Could not update that account just now. Try again.", error);
  }
};
