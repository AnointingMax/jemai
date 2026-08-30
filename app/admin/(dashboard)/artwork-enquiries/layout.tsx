import { requireAdminPermission } from "@/lib/admin/auth/session";

const ArtworkEnquiriesLayout = async ({ children }: LayoutProps<"/admin/artwork-enquiries">) => {
  await requireAdminPermission("artwork-enquiries");
  return children;
};

export default ArtworkEnquiriesLayout;
