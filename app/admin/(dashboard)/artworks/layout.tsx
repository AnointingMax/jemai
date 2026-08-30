import { requireAdminPermission } from "@/lib/admin/auth/session";

const ArtworksLayout = async ({ children }: LayoutProps<"/admin/artworks">) => {
  await requireAdminPermission("artworks");
  return children;
};

export default ArtworksLayout;
