import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

/**
 * The console shell: a 256px rail, a 64px header and the page below it. Scoped
 * with `admin-surface` so the shadcn primitives inside it keep their 8px radius
 * on a white ground rather than the storefront's square corners. The provider is
 * here for the rail's collapsed state, where every row is an icon and its label
 * only reaches the reader as a tooltip.
 */
const AdminDashboardLayout = ({ children }: LayoutProps<"/admin">) => (
  <TooltipProvider delayDuration={0}>
    <SidebarProvider className="admin-surface bg-background min-h-svh">
      <AdminSidebar />
      <SidebarInset className="bg-background">
        <AdminHeader />
        <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  </TooltipProvider>
);

export default AdminDashboardLayout;
