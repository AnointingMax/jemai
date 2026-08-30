import { requireAdminPermission } from "@/lib/admin/auth/session";

const FurnitureLayout = async ({ children }: LayoutProps<"/admin/furniture">) => {
  await requireAdminPermission("furniture");
  return children;
};

export default FurnitureLayout;
