import { hashPassword } from "@/lib/admin/auth/password";
import { ADMIN_PERMISSIONS, type AdminPermission } from "@/lib/admin/auth/permissions";
import { formatDateTimeShort } from "@/lib/admin/content";
import { searchAcross } from "@/lib/admin/table-query";
import { prisma } from "@/lib/prisma";
import type { Admin as AdminRecord } from "@/lib/generated/prisma/client";

export type AdminAccount = {
  id: string;
  name: string;
  email: string;
  permissions: AdminPermission[];
  isActive: boolean;
  createdAt: string;
};

export const addedOn = (admin: Pick<AdminAccount, "createdAt">) =>
  formatDateTimeShort(admin.createdAt);

const toAccount = (record: AdminRecord): AdminAccount => ({
  id: record.id,
  name: record.name,
  email: record.email,
  permissions: ADMIN_PERMISSIONS.filter((permission) =>
    record.permissions.includes(permission),
  ),
  isActive: record.isActive,
  createdAt: record.createdAt.toISOString(),
});

export const listAdmins = async (search?: string) => {
  const records = await prisma.admin.findMany({
    where: searchAcross(["name", "email"], search),
    orderBy: { createdAt: "desc" },
  });
  return records.map(toAccount);
};

/**
 * Who is entitled to hear about a section's work — every active account holding
 * that permission, and nobody else. An internal notice carries a customer's
 * name, address and money, so it goes to the desks that already read those in
 * the console and stops there.
 */
export const adminsWithPermission = async (permission: AdminPermission) => {
  const records = await prisma.admin.findMany({
    where: { isActive: true, permissions: { has: permission } },
    orderBy: { name: "asc" },
  });
  return records.map(toAccount);
};

export const findActiveAdmin = async (id: string) => {
  const record = await prisma.admin.findUnique({ where: { id } });
  if (!record || !record.isActive) return null;
  return toAccount(record);
};

export type AdminInvite = {
  name: string;
  email: string;
  password: string;
  permissions: AdminPermission[];
};

export const inviteAdmin = async (invite: AdminInvite): Promise<AdminAccount | null> => {
  const email = invite.email.trim().toLowerCase();

  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) return null;

  try {
    const record = await prisma.admin.create({
      data: {
        email,
        name: invite.name.trim(),
        passwordHash: await hashPassword(invite.password),
        permissions: invite.permissions,
      },
    });
    return toAccount(record);
  } catch {
    return null;
  }
};

export const setAdminActive = async (id: string, isActive: boolean) => {
  const record = await prisma.admin.update({ where: { id }, data: { isActive } });
  return toAccount(record);
};

export const countActiveAdmins = () => prisma.admin.count({ where: { isActive: true } });
