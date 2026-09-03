import { requireAdminPermission } from "@/lib/admin/auth/session";

const ChristmasRequestsLayout = async ({
  children,
}: LayoutProps<"/admin/christmas-requests">) => {
  await requireAdminPermission("christmas-requests");
  return children;
};

export default ChristmasRequestsLayout;
