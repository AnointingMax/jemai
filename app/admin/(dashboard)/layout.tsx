import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { requireAdminSession } from "@/lib/admin/auth/session";

/**
 * The console shell: a 256px rail, a 64px header and the page below it. Scoped
 * with `admin-surface` so the shadcn primitives inside it keep their 8px radius
 * on a white ground rather than the storefront's square corners. The provider is
 * here for the rail's collapsed state, where every row is an icon and its label
 * only reaches the reader as a tooltip.
 *
 * This is also the single gate on the console. Every screen under it is behind
 * one `await`, so no page has to remember to check for itself.
 */
const AdminDashboardLayout = async ({ children }: LayoutProps<"/admin">) => {
  const session = await requireAdminSession();

  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider className="admin-surface bg-background min-h-svh">
        <AdminSidebar account={{ name: session.name, email: session.email }} />
        <SidebarInset className="bg-background min-w-0">
          <AdminHeader />
          <div className="flex min-w-0 flex-1 flex-col gap-6 p-4 sm:p-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
};

export default AdminDashboardLayout;
