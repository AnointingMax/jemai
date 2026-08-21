"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { QuantityStepper } from "@/components/shared/quantity-stepper";
import { useCart, type CartLine } from "@/lib/cart";
import { nairaExact } from "@/lib/products";

/**
 * Three colours in this frame sit outside the JEMAI palette — the same story as
 * the catalogue's Load-more block. The rules and the secondary copy are a cool
 * neutral grey, and the primary copy a cool near-black, none of which is within
 * reach of a token (`--color-border-default` composites warm, at #dcd7d7). They
 * are literal hex with this comment rather than invented tokens; worth raising
 * with the designer.
 */
const rule = "#dee2e6";
const inkStrong = "#202025";
const inkMuted = "#636366";

const CartItem = ({ line }: { line: CartLine; }) => {
  const { remove, setQuantity } = useCart();

  return (
    <li className="flex gap-grid-gutter">
      <Link href={`/furniture/${line.slug}`} className="shrink-0">
        <Image
          src={line.image}
          alt={line.name}
          width={96}
          height={96}
          className="size-24 object-cover"
        />
      </Link>

      <div className="min-w-0 flex-1 pt-[6px]">
        <Link
          href={`/furniture/${line.slug}`}
          className="font-heading text-text-primary block text-[17px] leading-[20px]"
        >
          {line.name}
        </Link>
        <p className="text-body-sm text-text-secondary mt-[3px]">
          Color: {line.colour}
          {line.size && <span className="ml-2">Size: {line.size}</span>}
        </p>
        <p className="text-body-sm mt-[3px]" style={{ color: inkMuted }}>
          {nairaExact(line.amount)}
        </p>

        <div className="mt-[5px] flex items-center justify-between gap-4">
          <QuantityStepper
            size="sm"
            label={line.name}
            value={line.quantity}
            onChange={(quantity) => setQuantity(line.id, quantity)}
            className="border-[#dee2e6] text-[#202025]"
          />
          <Button
            variant="link"
            type="button"
            onClick={() => remove(line.id)}
            className="text-body-xs underline underline-offset-[3px]"
            style={{ color: inkMuted }}
          >
            Remove
          </Button>
        </div>
      </div>
    </li>
  );
};

export const CartDrawer = () => {
  const router = useRouter();
  const { lines, count, subtotal, open, setOpen } = useCart();
  const [consented, setConsented] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="right"
        aria-describedby={undefined}
        showCloseButton={false}
        // Full-bleed below the 500px panel width the frame draws, rather than
        // shadcn's 3/4-viewport default.
        className="gap-0 border-0 bg-white p-0 shadow-[-6px_0_24px_rgba(22,5,7,0.10)] data-[side=right]:w-full sm:max-w-[500px]"
      >
        {/* Header — the rule below it is inset to the cart gutter, not bled
            to the panel edge. */}
        <div className="px-cart-gutter shrink-0 pt-[30px] pb-[22px]">
          <div className="flex h-6 items-center justify-between">
            <SheetTitle className="text-body flex items-center gap-[9px] font-medium uppercase">
              <span style={{ color: inkStrong }}>Your Cart</span>
              <span className="bg-action-primary text-action-primary-content flex size-5 items-center justify-center rounded-full text-[11px] font-semibold">
                {count}
              </span>
            </SheetTitle>
            <SheetClose asChild>
              <Button
                variant="quiet"
                size="icon-lg"
                aria-label="Close cart"
                className="mr-1.5"
                style={{ color: inkStrong }}
              >
                <X className="size-6" strokeWidth={2} />
              </Button>
            </SheetClose>
          </div>
        </div>
        <Separator
          className="mx-cart-gutter w-auto shrink-0"
          style={{ backgroundColor: rule }}
        />

        {lines.length === 0 ? (
          <div className="px-cart-gutter flex flex-1 flex-col items-center justify-center pt-5">
            <p className="text-body text-text-primary">Your bag is empty</p>
            <Button
              asChild
              size="cta"
              variant="jemai-outline"
              className="mt-[15px] h-[51px] px-8"
            >
              <Link href="/furniture" onClick={() => setOpen(false)}>
                Shop our products
              </Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Item rows sit 14px inside the cart gutter — the frame insets
                them from the header rule and the totals below. */}
            <ul className="flex flex-1 flex-col gap-8 overflow-y-auto px-[20px] pt-[29px] pb-6">
              {lines.map((line) => (
                <CartItem key={line.id} line={line} />
              ))}
            </ul>

            <div className="px-cart-gutter shrink-0 pb-6">
              <div className="border-t pt-[16px]" style={{ borderColor: rule }}>
                <div className="flex items-baseline justify-between">
                  <span
                    className="font-heading text-[16px] leading-[20px]"
                    style={{ color: inkStrong }}
                  >
                    Sub Total:
                  </span>
                  <span
                    className="text-[17px] leading-[24px] font-semibold"
                    style={{ color: inkStrong }}
                  >
                    {nairaExact(subtotal)}
                  </span>
                </div>
                <p className="text-body-xs mt-[11px]" style={{ color: inkMuted }}>
                  Taxes and shipping calculated at checkout
                </p>

                {/* The frame draws a square 16px box in the near-black, so the
                    shadcn 4px corners and `--primary` fill are overridden. */}
                <div className="mt-[17px] flex items-center gap-5">
                  <Checkbox
                    id="cart-terms"
                    checked={consented}
                    onCheckedChange={(state) => setConsented(state === true)}
                    className="rounded-none border-[1.5px] border-[#202025] data-checked:border-[#202025] data-checked:bg-[#202025] data-checked:text-white"
                  />
                  <label
                    htmlFor="cart-terms"
                    className="text-body-sm cursor-pointer"
                    style={{ color: inkStrong }}
                  >
                    I agree with the{" "}
                    <span style={{ color: inkMuted }}>terms and conditions</span>
                  </label>
                </div>

                <Button
                  type="button"
                  size="cta"
                  variant="jemai"
                  disabled={!consented}
                  onClick={() => {
                    setOpen(false);
                    router.push("/checkout");
                  }}
                  className="mt-[23px] h-[52px] w-full text-[14px] tracking-[0.04em]"
                >
                  CHECKOUT
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
