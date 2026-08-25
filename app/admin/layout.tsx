import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JEMAI Admin",
  description: "Internal tools for managing the JEMAI catalogue and exhibitions.",
};

/**
 * The admin tree splits in two: `(auth)` renders the sign-in frames on bare
 * white, `(dashboard)` renders the console shell. Only the metadata is shared,
 * so this layout is a pass-through.
 */
const AdminLayout = ({ children }: LayoutProps<"/admin">) => <>{children}</>;

export default AdminLayout;
