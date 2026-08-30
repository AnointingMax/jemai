import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { requireAdminSession } from "@/lib/admin/auth/session";

const AdminDashboardLayout = async ({ children }: LayoutProps<"/admin">) => {
  const session = await requireAdminSession();

  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider className="admin-surface bg-background min-h-svh">
        <AdminSidebar
          account={{ name: session.name, email: session.email }}
          permissions={session.permissions}
        />
        <SidebarInset className="bg-background min-w-0">
          <AdminHeader />
          <div className="flex min-w-0 flex-1 flex-col gap-6 p-4 sm:p-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
};

export default AdminDashboardLayout;
