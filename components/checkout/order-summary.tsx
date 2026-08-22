"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  inkMuted,
  inkStrong,
  linkBlue,
} from "@/components/checkout/tokens";
import { useCart, type CartLine } from "@/lib/cart";
import { nairaExact } from "@/lib/products";

export type OrderTotals = {
  subtotal: number;
  shipping: number;
  total: number;
};

type OrderSummaryProps = {
  lines: CartLine[];
  totals: OrderTotals;
  canPay: boolean;
  /** Pay Now is holding a loader while the hand-off to the provider runs. */
  paying: boolean;
};

export const OrderSummary = ({
  lines,
  totals,
  canPay,
  paying,
}: OrderSummaryProps) => {
  const { setOpen } = useCart();

  return (
    <section aria-labelledby="summary-heading">
      <div className="flex items-baseline justify-between gap-4">
        <h2
          id="summary-heading"
          className="font-heading text-text-primary text-h4 font-normal"
        >
          Order Summary
        </h2>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="text-body-xs cursor-pointer hover:underline"
          style={{ color: linkBlue }}
        >
          edit cart
        </button>
      </div>

      <ul className="mt-6.75 space-y-4">
        {lines.map((line) => (
          <li key={line.id} className="flex items-start gap-5">
            {/* 64px plate: a 2px white mat and a soft drop shadow, with the
                quantity badge hung off its top-right corner. */}
            <div className="relative size-16 shrink-0 border-2 border-white bg-white shadow-[0_1px_5px_rgba(0,0,0,0.22)]">
              <Image
                src={line.image}
                alt={line.name}
                width={60}
                height={60}
                className="size-full object-cover"
              />
              <span className="absolute -top-1.25 -right-2.25 flex size-5.5 items-center justify-center bg-black text-[11px] leading-none font-medium text-white">
                {line.quantity}
              </span>
            </div>

            <div className="min-w-0 flex-1 pt-2.25">
              <p className="text-body" style={{ color: inkStrong }}>
                <Link href={`/furniture/${line.slug}`} className="hover:underline">
                  {line.name}
                </Link>
                <span className="ml-2 whitespace-nowrap">×&nbsp;{line.quantity}</span>
              </p>
              <p className="text-body-xs mt-1.75" style={{ color: inkMuted }}>
                Color: {line.colour}
                {line.size && <span className="ml-2">Size: {line.size}</span>}
              </p>
            </div>

            <p
              className="text-body pt-2.75 text-right whitespace-nowrap"
              style={{ color: inkStrong }}
            >
              {nairaExact(line.amount * line.quantity)}
            </p>
          </li>
        ))}
      </ul>

      <dl className="mt-10.25">
        <TotalRow label="Subtotal" value={nairaExact(totals.subtotal)} />
        <TotalRow label="Shipping" value={nairaExact(totals.shipping)} />
        <div className="mt-7.5 flex items-baseline justify-between gap-4">
          <dt className="text-body" style={{ color: inkStrong }}>
            Total
          </dt>
          <dd
            className="text-[21px] leading-6.5 font-semibold"
            style={{ color: inkStrong }}
          >
            {nairaExact(totals.total)}
          </dd>
        </div>
      </dl>

      <h2 className="font-heading text-text-primary text-h4 mt-11.25 font-normal">
        Payment
      </h2>
      <p className="text-body-sm mt-1.75 mb-3.75" style={{ color: inkMuted }}>
        All transactions are secure and encrypted. Card details are taken on the
        provider&apos;s page after Pay Now.
      </p>

      <Button
        type="submit"
        form="checkout-form"
        variant="jemai"
        size="cta"
        disabled={!canPay}
        aria-busy={paying}
        className="mt-3.5 h-13.25 w-full gap-3 text-[14px] font-semibold tracking-[0.04em]"
      >
        {paying && <ButtonSpinner />}
        {paying ? "REDIRECTING" : "PAY NOW"}
      </Button>
    </section>
  );
};

/** The loader Pay Now holds while the buyer is being handed to the provider. */
const ButtonSpinner = () => (
  <svg viewBox="0 0 20 20" className="size-4 animate-spin" aria-hidden>
    <circle
      cx="10"
      cy="10"
      r="8"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeDasharray="38 12"
    />
  </svg>
);

const TotalRow = ({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) => (
  <div className="mt-2 flex items-baseline justify-between gap-4 first:mt-0">
    <dt
      className="text-body-sm flex items-center gap-1.5"
      style={{ color: inkStrong }}
    >
      {label}
      {hint && (
        <span title={hint} className="cursor-help">
          <QuestionMark />
          <span className="sr-only">{hint}</span>
        </span>
      )}
    </dt>
    <dd className="text-body whitespace-nowrap" style={{ color: inkStrong }}>
      {value}
    </dd>
  </div>
);

const QuestionMark = () => (
  <svg viewBox="0 0 14 14" className="size-3.5" aria-hidden>
    <circle
      cx="7"
      cy="7"
      r="6.25"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      opacity="0.6"
    />
    <text
      x="7"
      y="10.2"
      textAnchor="middle"
      fontSize="8"
      fontFamily="var(--font-assistant), sans-serif"
      fill="currentColor"
      opacity="0.75"
    >
      ?
    </text>
  </svg>
);
