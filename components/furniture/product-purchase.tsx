"use client";

import { useMemo, useState } from "react";
import { CheckCheck, CreditCard, Minus, Plus, RefreshCw, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ProductColour, ProductVariant } from "@/lib/products";

type ProductPurchaseProps = {
  colourway: ProductColour[];
  sizes: string[];
  variants: ProductVariant[];
};

const assurances = [
  { icon: Truck, copy: "Nationwide shipping" },
  { icon: CreditCard, copy: "Pay in your local currency — secure checkout" },
  { icon: RefreshCw, copy: "30-day free returns and exchanges" },
];

/** Green of the stock pill, sampled off the frame. No JEMAI token comes close. */
const stockGreen = "#74aa5b";

/** Chip chrome shared by the colour swatches and the size buttons. */
const chipClass =
  "border transition-colors disabled:cursor-not-allowed disabled:opacity-35";

export const ProductPurchase = ({
  colourway,
  sizes,
  variants,
}: ProductPurchaseProps) => {
  const [colour, setColour] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const stockOf = useMemo(() => {
    const table = new Map<string, number>();
    for (const variant of variants)
      table.set(`${variant.colour}/${variant.size}`, variant.stock);
    return (c: string, s: string) => table.get(`${c}/${s}`) ?? 0;
  }, [variants]);

  /**
   * Each axis is gated by the other: with a colour picked, only sizes that are
   * in stock in that colour stay selectable, and with a size picked, only the
   * colours that carry it. With neither picked, anything with stock somewhere
   * is fair game.
   */
  const colourInStock = (name: string) =>
    size
      ? stockOf(name, size) > 0
      : variants.some((v) => v.colour === name && v.stock > 0);

  const sizeInStock = (name: string) =>
    colour
      ? stockOf(colour, name) > 0
      : variants.some((v) => v.size === name && v.stock > 0);

  /** Stock for the current selection, or everything still buyable. */
  const available =
    colour && size
      ? stockOf(colour, size)
      : variants
          .filter((v) => (colour ? v.colour === colour : true))
          .filter((v) => (size ? v.size === size : true))
          .reduce((total, v) => total + v.stock, 0);

  const complete = Boolean(colour && size);

  /**
   * Re-clicking the current chip clears it. Without that, gating both axes can
   * strand a selection — every other colour disabled by the size you picked,
   * and no way back.
   */
  const choose =
    <T,>(set: (value: T | null) => void, current: T | null) =>
    (value: T) => {
      set(current === value ? null : value);
      setQuantity(1);
    };

  return (
    <>
      {/* Reads the current selection, so it lives with the chips rather than
          with the static copy above it. */}
      <span
        className="border-border-default bg-surface-page text-body-sm mt-2.5 inline-flex h-[35px] w-fit items-center gap-3 border px-4"
        style={{ color: stockGreen }}
      >
        <CheckCheck aria-hidden className="size-4" strokeWidth={1.75} />
        {available > 0
          ? `${available} Item${available === 1 ? "" : "s"} In Stock`
          : "Out of stock"}
      </span>

      <p className="text-eyebrow-lg text-text-secondary mt-11 uppercase">
        Color
      </p>
      <ul className="mt-4 flex flex-wrap gap-3">
        {colourway.map((option) => {
          const enabled = colourInStock(option.name);
          return (
            <li key={option.name}>
              <button
                type="button"
                disabled={!enabled}
                onClick={() => choose(setColour, colour)(option.name)}
                aria-pressed={colour === option.name}
                aria-label={`${option.name}${enabled ? "" : " — unavailable"}`}
                title={option.name}
                className={cn(
                  chipClass,
                  "block size-10 p-1",
                  colour === option.name
                    ? "border-border-strong"
                    : "border-border-default enabled:hover:border-border-strong/60",
                )}
              >
                <span
                  className="block size-full"
                  style={{ backgroundColor: option.hex }}
                />
              </button>
            </li>
          );
        })}
      </ul>

      <p className="text-eyebrow-lg text-text-secondary mt-5 uppercase">
        Select size
      </p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {sizes.map((option) => {
          const enabled = sizeInStock(option);
          return (
            <li key={option}>
              <button
                type="button"
                disabled={!enabled}
                onClick={() => choose(setSize, size)(option)}
                aria-pressed={size === option}
                className={cn(
                  chipClass,
                  "text-eyebrow h-10 w-[72px] uppercase",
                  size === option
                    ? "border-border-strong text-text-primary"
                    : "border-border-default text-text-secondary enabled:hover:border-border-strong/60",
                )}
              >
                {option}
              </button>
            </li>
          );
        })}
      </ul>

      <hr className="border-border-default mt-4 border-t" />

      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <div className="border-border-default flex h-[57px] w-[143px] shrink-0 items-center justify-between border px-4">
          <button
            type="button"
            onClick={() => setQuantity((n) => Math.max(1, n - 1))}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
            className="text-text-primary disabled:opacity-30"
          >
            <Minus className="size-4" strokeWidth={1.5} />
          </button>
          <span aria-live="polite" className="text-body-sm text-text-primary">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((n) => Math.min(available || 1, n + 1))}
            disabled={quantity >= available}
            aria-label="Increase quantity"
            className="text-text-primary disabled:opacity-30"
          >
            <Plus className="size-4" strokeWidth={1.5} />
          </button>
        </div>

        {/* The frame draws this live with nothing selected, which no real
            variant picker can honour — the label is kept and the button is
            disabled until a colour and size are chosen. `flex-1` is scoped to
            the row layout; in the stacked column it would resolve flex-basis
            against the height and flatten the button. */}
        <Button
          type="button"
          size="cta"
          disabled={!complete || available === 0}
          aria-label={
            complete ? undefined : "Add to cart — choose a colour and size first"
          }
          className="h-[57px] w-full sm:w-auto sm:flex-1"
        >
          Add To Cart
        </Button>
      </div>

      <ul className="mt-10 flex flex-col gap-3">
        {assurances.map(({ icon: Icon, copy }) => (
          <li key={copy} className="flex items-center gap-3">
            <Icon
              aria-hidden
              className="text-text-secondary size-4 shrink-0"
              strokeWidth={1.5}
            />
            <span className="text-body-xs text-text-secondary">{copy}</span>
          </li>
        ))}
      </ul>
    </>
  );
};
