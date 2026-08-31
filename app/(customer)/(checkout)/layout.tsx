import { SiteHeader } from "@/components/site/site-header";
import { siteMenus } from "@/lib/navigation";

const CheckoutLayout = async ({ children }: LayoutProps<"/">) => (
  <>
    <SiteHeader menus={await siteMenus()} />
    <div className="w-full px-4 sm:px-6 lg:px-page-gutter">
      <div className="border-border-strong mx-auto mt-3.25 w-full max-w-432 border-t-3" />
    </div>
    <main className="flex flex-col">{children}</main>
  </>
);

export default CheckoutLayout;
