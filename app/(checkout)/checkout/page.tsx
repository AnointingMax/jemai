import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutView } from "@/components/checkout/checkout-view";

export const metadata: Metadata = {
  title: "Checkout — JEMAI",
  description:
    "Confirm your delivery details and place your JEMAI order. All transactions are secure and encrypted.",
};

const CheckoutPage = () => (
  <Suspense>
    <CheckoutView />
  </Suspense>
);

export default CheckoutPage;
