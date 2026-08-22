"use client";

import { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  CheckoutModal,
  type CheckoutStatus,
} from "@/components/checkout/checkout-modal";
import {
  DeliveryForm,
  emptyCheckout,
  type CheckoutFormValues,
} from "@/components/checkout/delivery-form";
import { OrderSummary } from "@/components/checkout/order-summary";
import { useCart } from "@/lib/cart";

/** Flat national rate until a shipping service exists. */
const SHIPPING = 25000;
/** How long Pay Now holds its loader before the "provider" sends us back. */
const HANDOFF_MS = 1200;
/** How long the verification takes to answer. */
const VERIFY_MS = 2200;

const orderReference = () => {
  const now = new Date();
  const stamp = [now.getFullYear() % 100, now.getMonth() + 1, now.getDate()]
    .map((part) => part.toString().padStart(2, "0"))
    .join("");
  return `JEM-${stamp}-${Math.floor(1000 + Math.random() * 9000)}`;
};

const verifyPayment = (reference: string, declined: boolean) =>
  new Promise<{ reference: string; }>((resolve, reject) => {
    setTimeout(() => {
      if (declined) reject(new Error("Payment declined"));
      else resolve({ reference });
    }, VERIFY_MS);
  });

export const CheckoutView = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");
  /** Append `?outcome=failed` before paying to walk the declined path. */
  const declined = searchParams.get("outcome") === "failed";
  const { lines, count, subtotal, setOpen, clear } = useCart();

  const form = useForm<CheckoutFormValues>({
    defaultValues: emptyCheckout,
    mode: "onChange",
  });

  const [paying, setPaying] = useState(false);
  /**
   * What was sent to the provider. The bag is emptied once the payment is
   * confirmed, so the outcome modal reads its piece and its count from here
   * rather than from the cart.
   */
  const [placed, setPlaced] = useState<{
    pieceCount: number;
    item: { name: string; image: string };
  } | null>(null);
  /**
   * What the verification answered, tagged with the reference it belongs to. A
   * reference in the URL with no answer yet *is* the pending state, so the
   * modal's status is derived rather than switched on by an effect.
   */
  const [outcome, setOutcome] = useState<{ reference: string; status: Exclude<CheckoutStatus, "pending">; } | null>(null);

  const status: CheckoutStatus | null = reference
    ? outcome?.reference === reference
      ? outcome.status
      : "pending"
    : null;

  /**
   * The buyer is back from the payment page with a reference, so the payment is
   * verified. The modal sits on `pending` for as long as this runs and settles
   * on whichever way it answers.
   */
  useEffect(() => {
    if (!reference) return;

    let cancelled = false;
    verifyPayment(reference, declined)
      .then(() => {
        if (cancelled) return;
        setOutcome({ reference, status: "success" });
        // The order is paid for, so the bag it came from is spent.
        clear();
      })
      .catch(() => {
        if (!cancelled) setOutcome({ reference, status: "failed" });
      });

    return () => {
      cancelled = true;
    };
  }, [reference, declined, clear]);

  /** Drops `?reference=…` so the outcome modal doesn't re-open on a reload. */
  const dismiss = useCallback(() => {
    setOutcome(null);
    router.replace(declined ? "/checkout?outcome=failed" : "/checkout");
  }, [declined, router]);

  const shipping = lines.length > 0 ? SHIPPING : 0;
  const totals = {
    subtotal,
    shipping,
    total: subtotal + shipping,
  };

  const canPay = form.formState.isValid && lines.length > 0 && !paying;

  const submit = () => {
    if (lines.length === 0 || paying) return;
    setPaying(true);
    setPlaced({
      pieceCount: count,
      item: { name: lines[0].name, image: lines[0].image },
    });
    const query = new URLSearchParams({ reference: orderReference() });
    if (declined) query.set("outcome", "failed");
    setTimeout(() => {
      setPaying(false);
      router.replace(`/checkout?${query}`);
    }, HANDOFF_MS);
  };

  if (lines.length === 0 && !reference)
    return (
      <div className="mx-auto w-full max-w-243 px-4 pt-2.5 pb-20 sm:px-6 lg:px-0">
        <h1 className="font-heading text-text-primary text-h3">Checkout</h1>
        <p className="text-body text-text-secondary mt-6">
          There is nothing in your bag yet, so there is nothing to check out.
        </p>
        <Button asChild variant="jemai" size="cta" className="mt-6">
          <Link href="/furniture">Browse furniture</Link>
        </Button>
      </div>
    );

  const feature = placed?.item ?? lines[0];

  return (
    <div className="mx-auto w-full max-w-243 px-4 pt-2.5 pb-20 sm:px-6 lg:px-0">
      <h1 className="font-heading text-text-primary text-h3">Checkout</h1>

      <FormProvider {...form}>
        <form
          id="checkout-form"
          onSubmit={(event) => form.handleSubmit(submit)(event)}
          className="mt-6.75 flex flex-col gap-12 lg:flex-row lg:gap-8"
        >
          <div className="lg:flex-1">
            <DeliveryForm />
          </div>
          <div className="lg:flex-1">
            <OrderSummary
              lines={lines}
              totals={totals}
              canPay={canPay}
              paying={paying}
            />
          </div>
        </form>
      </FormProvider>

      <CheckoutModal
        status={status}
        onOpenChange={(open) => !open && dismiss()}
        feature={{
          name: feature?.name ?? "Palma Side Chair",
          image: feature?.image ?? "/figma/home/p-mila.png",
        }}
        orderReference={reference ?? ""}
        pieceCount={placed?.pieceCount ?? count}
        onContinueShopping={() => router.push("/furniture")}
        onReturnToPayment={dismiss}
        onReviewOrder={() => {
          dismiss();
          setOpen(true);
        }}
      />
    </div>
  );
};
