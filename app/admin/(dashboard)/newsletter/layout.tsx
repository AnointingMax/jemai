import { requireAdminPermission } from "@/lib/admin/auth/session";

const NewsletterLayout = async ({ children }: LayoutProps<"/admin/newsletter">) => {
  await requireAdminPermission("newsletter");
  return children;
};

export default NewsletterLayout;
