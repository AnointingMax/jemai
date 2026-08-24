import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JEMAI Admin",
  description: "Internal tools for managing the JEMAI catalogue and exhibitions.",
};

/**
 * The admin shell. Kept deliberately bare for now — it shares the root fonts
 * and tokens but none of the storefront chrome, so admin screens can grow their
 * own navigation without inheriting the editorial header and footer.
 */
const AdminLayout = ({ children }: LayoutProps<"/admin">) => (
  <main className="flex min-h-full flex-col px-4 py-10 sm:px-6 lg:px-page-gutter">
    {children}
  </main>
);

export default AdminLayout;
