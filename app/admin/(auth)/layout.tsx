import { redirect } from "next/navigation";

import { readAdminSession } from "@/lib/admin/auth/session";

/**
 * The admin auth shell. Every frame in the set is the same 360px column on
 * white, starting 108px down — no sidebar, no header, nothing to navigate to
 * until there is a session.
 *
 * An admin who already has one has no business on these frames, so they are
 * sent on to the console rather than being offered a second sign-in.
 */
const AdminAuthLayout = async ({ children }: LayoutProps<"/">) => {
  if (await readAdminSession()) redirect("/admin");

  return (
    <div className="admin-surface flex min-h-svh flex-1 flex-col items-center bg-white px-4 pt-27 pb-16">
      {children}
    </div>
  );
};

export default AdminAuthLayout;
