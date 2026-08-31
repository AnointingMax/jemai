import { requireAdminPermission } from "@/lib/admin/auth/session";

const AdminsLayout = async ({ children }: LayoutProps<"/admin/admins">) => {
  await requireAdminPermission("admins");
  return children;
};

export default AdminsLayout;
