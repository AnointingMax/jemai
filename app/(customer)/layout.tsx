import type { Metadata } from "next";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { CartProvider } from "@/lib/cart";

export const metadata: Metadata = {
  title: "JEMAI — Signature style for every square inch",
  description:
    "Considered furniture, contemporary artwork, exhibitions and design services, brought together by a belief that every space should reflect the people within it.",
};

/**
 * The storefront shell. Everything a shopper can reach — the editorial site and
 * the checkout flow — hangs off this group, so the cart lives here rather than
 * at the root: the admin tree never mounts it.
 */
const CustomerLayout = ({ children }: LayoutProps<"/">) => (
  <CartProvider>
    {children}
    <CartDrawer />
  </CartProvider>
);

export default CustomerLayout;
