import { requireAdminPermission } from "@/lib/admin/auth/session";

const ConsultationRequestsLayout = async ({ children }: LayoutProps<"/admin/consultation-requests">) => {
  await requireAdminPermission("consultation-requests");
  return children;
};

export default ConsultationRequestsLayout;
