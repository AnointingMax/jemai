"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eyebrow } from "@/components/site/eyebrow";

export type CheckoutStatus = "pending" | "success" | "failed";

type CheckoutModalProps = {
  status: CheckoutStatus | null;
  onOpenChange: (open: boolean) => void;
  /** The piece the left panel shows off, taken from the first line in the bag. */
  feature: { name: string; image: string; };
  orderReference: string;
  pieceCount: number;
  onContinueShopping: () => void;
  onReturnToPayment: () => void;
  onReviewOrder: () => void;
};

/**
 * The 1120 x 560 wrapper the three payment outcomes share: a 544px photograph
 * on the left with a caption block inset 32px from its edges, and a 576px
 * surface-page panel on the right padded 48px all round.
 */
export const CheckoutModal = ({
  status,
  onOpenChange,
  feature,
  orderReference,
  pieceCount,
  onContinueShopping,
  onReturnToPayment,
  onReviewOrder,
}: CheckoutModalProps) => (
  <Dialog open={status !== null} onOpenChange={onOpenChange}>
    <DialogContent
      onEscapeKeyDown={(event) => status === "pending" && event.preventDefault()}
      onPointerDownOutside={(event) => status === "pending" && event.preventDefault()}
      onInteractOutside={(event) => status === "pending" && event.preventDefault()}
      className="flex h-140 w-[min(1120px,calc(100vw-2rem))] max-w-none overflow-hidden max-lg:h-auto max-lg:max-h-[calc(100dvh-2rem)] max-lg:overflow-y-auto"
    >
      {/* Left: the piece, with its caption block */}
      <div className="relative hidden w-136 shrink-0 bg-[#f6ede4] lg:block">
        <Image
          src={feature.image}
          alt={feature.name}
          fill
          sizes="544px"
          className="object-cover"
        />
        <div className="bg-surface-inverse absolute inset-x-8 bottom-8 px-4 py-4">
          <Eyebrow className="text-text-inverse">JEMAI FURNITURE</Eyebrow>
          <p className="text-body text-text-inverse mt-0.5">
            {feature.name} · Crafted for considered living.
          </p>
        </div>
      </div>

      {/* Right: the outcome */}
      <div className="bg-surface-page relative flex-1 p-8 lg:w-144 lg:p-12">
        {status !== "pending" && (
          <DialogClose asChild>
            <Button
              type="button"
              variant="quiet"
              aria-label="Close"
              className="border-border-default text-icon-primary absolute top-8 right-8 size-10 rounded-full border lg:top-12 lg:right-12"
            >
              <X className="size-3.5" />
            </Button>
          </DialogClose>
        )}

        {status === "pending" && <PendingState />}
        {status === "success" && (
          <SuccessState
            orderReference={orderReference}
            pieceCount={pieceCount}
            onContinueShopping={onContinueShopping}
            onReviewOrder={onReviewOrder}
          />
        )}
        {status === "failed" && (
          <FailedState
            onReturnToPayment={onReturnToPayment}
            onReviewOrder={onReviewOrder}
          />
        )}
      </div>
    </DialogContent>
  </Dialog>
);

const PendingState = () => (
  <div className="flex h-full flex-col items-center justify-center pb-19 text-center">
    <svg
      viewBox="0 0 56 56"
      className="text-action-primary size-14 animate-spin"
      style={{ animationDuration: "1.1s" }}
      aria-hidden
    >
      <circle
        cx="28"
        cy="28"
        r="26"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="136 27"
      />
    </svg>
    <DialogTitle className="mt-7 text-[32px] leading-10 font-normal">
      Confirming your order
    </DialogTitle>
    <DialogDescription className="text-body-sm text-text-primary mt-2">
      Please keep this window open while we securely confirm your payment.
    </DialogDescription>
  </div>
);

const OutcomeSeal = () => (
  <Image
    src="/figma/brand/badge-logo.svg"
    alt=""
    width={60}
    height={60}
    unoptimized
    className="size-15"
  />
);

const SuccessState = ({
  orderReference,
  pieceCount,
  onContinueShopping,
  onReviewOrder,
}: {
  orderReference: string;
  pieceCount: number;
  onContinueShopping: () => void;
  onReviewOrder: () => void;
}) => (
  <div className="flex h-full flex-col pt-16.5">
    <OutcomeSeal />
    <DialogTitle className="mt-7 text-[32px] leading-10 font-normal">
      Your order was successful.
    </DialogTitle>
    <DialogDescription className="text-body text-text-primary mt-5.75">
      Thank you for choosing JEMAI. Your receipt and order details have been sent
      to your email.
    </DialogDescription>

    <dl className="bg-surface-subtle text-body-sm mt-6.75 space-y-1.5 px-4 py-4">
      <div>
        <dt className="sr-only">Order reference</dt>
        <dd>Order · {orderReference}</dd>
      </div>
      <div>
        <dt className="sr-only">Contents</dt>
        <dd>
          {pieceCount} furniture {pieceCount === 1 ? "piece" : "pieces"}
        </dd>
      </div>
      <div>
        <dt className="sr-only">Delivery</dt>
        <dd>Delivery updates will be shared by email</dd>
      </div>
    </dl>

    <OutcomeActions
      primary={{ label: "Continue shopping", onClick: onContinueShopping }}
      secondary={{ label: "View order summary", onClick: onReviewOrder }}
    />
  </div>
);

const FailedState = ({
  onReturnToPayment,
  onReviewOrder,
}: {
  onReturnToPayment: () => void;
  onReviewOrder: () => void;
}) => (
  <div className="flex h-full flex-col pt-16.5">
    <OutcomeSeal />
    <DialogTitle className="mt-7 text-[32px] leading-10 font-normal">
      Payment was not confirmed
    </DialogTitle>
    <DialogDescription className="text-body-sm text-text-primary mt-5.5">
      Your order has not been placed and you have not been charged by JEMAI.
    </DialogDescription>

    <p
      role="alert"
      className="border-border-action bg-surface-tint text-body-sm mt-6.5 flex gap-3 border px-4.5 py-3"
    >
      <span aria-hidden className="text-action-primary font-semibold">
        !
      </span>
      <span>
        Check your payment details or choose another method before trying again.
      </span>
    </p>

    <OutcomeActions
      primary={{ label: "Return to payment", onClick: onReturnToPayment }}
      secondary={{ label: "Review order", onClick: onReviewOrder }}
    />
  </div>
);

type Action = { label: string; onClick: () => void; };

const OutcomeActions = ({
  primary,
  secondary,
}: {
  primary: Action;
  secondary: Action;
}) => (
  <div className="mt-6.25 flex flex-wrap gap-3">
    <Button
      type="button"
      variant="jemai"
      size="cta"
      onClick={primary.onClick}
      className="text-body h-12 px-6.5 font-normal"
    >
      {primary.label}
    </Button>
    <Button
      type="button"
      size="cta"
      onClick={secondary.onClick}
      className="border-border-strong text-action-primary text-body h-12 rounded-none border bg-transparent px-6.5 font-normal hover:bg-transparent"
    >
      {secondary.label}
    </Button>
  </div>
);
