import { SiteHeader } from "@/components/site/site-header";

/**
 * Checkout runs on a stripped-back shell: the `Nav` frame for this flow is 76px
 * tall against the 119px the rest of the site draws, so the announcement bar is
 * gone and the header closes on the same 3px rule every section opens with. No
 * newsletter and no footer either — the page ends on Pay Now.
 */
const CheckoutLayout = ({ children }: LayoutProps<"/">) => (
  <>
    <SiteHeader />
    <div className="w-full px-4 sm:px-6 lg:px-page-gutter">
      <div className="border-border-strong mx-auto mt-3.25 w-full max-w-432 border-t-3" />
    </div>
    <main className="flex flex-col">{children}</main>
  </>
);

export default CheckoutLayout;
