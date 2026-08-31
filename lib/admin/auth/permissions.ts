/**
 * The permission slugs an Admin's `permissions` array is drawn from — one per
 * console section, matching the routes in components/admin/nav.ts.
 */
export const ADMIN_PERMISSIONS = [
  "furniture",
  "artworks",
  "exhibitions",
  "orders",
  "artwork-enquiries",
  "consultation-requests",
  "newsletter",
  "admins",
] as const;

export type AdminPermission = (typeof ADMIN_PERMISSIONS)[number];

export const hasPermission = (
  permissions: readonly string[],
  permission: AdminPermission,
) => permissions.includes(permission);
