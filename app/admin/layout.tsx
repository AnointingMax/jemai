import type { Metadata } from "next";

import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "JEMAI Admin",
  description: "Internal tools for managing the JEMAI catalogue and exhibitions.",
};

/**
 * The admin tree splits in two: `(auth)` renders the sign-in frames on bare
 * white, `(dashboard)` renders the console shell. What they share is the
 * metadata and the toast host — every server action in the console reports its
 * failures through it, and both halves run actions.
 */
const AdminLayout = ({ children }: LayoutProps<"/admin">) => (
  <>
    {children}
    <Toaster position="top-right" richColors closeButton />
  </>
);

export default AdminLayout;
