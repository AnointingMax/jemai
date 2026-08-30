import { requireAdminPermission } from "@/lib/admin/auth/session";

const ExhibitionsLayout = async ({ children }: LayoutProps<"/admin/exhibitions">) => {
  await requireAdminPermission("exhibitions");
  return children;
};

export default ExhibitionsLayout;
