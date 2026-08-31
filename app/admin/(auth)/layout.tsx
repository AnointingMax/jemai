import { redirect } from "next/navigation";
import { readActiveAdmin } from "@/lib/admin/auth/session";

const AdminAuthLayout = async ({ children }: LayoutProps<"/">) => {
  if (await readActiveAdmin()) redirect("/admin");

  return (
    <div className="admin-surface flex min-h-svh flex-1 flex-col items-center bg-white px-4 pt-27 pb-16">
      {children}
    </div>
  );
};

export default AdminAuthLayout;
