"use client";

import { useMemo, useState } from "react";
import { CheckCheck, CreditCard, RefreshCw, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { QuantityStepper } from "@/components/shared/quantity-stepper";
import { useCart } from "@/lib/cart";
import type { ProductDetail } from "@/lib/products";

type ProductPurchaseProps = {
  product: ProductDetail;
};

const assurances = [
  { icon: Truck, copy: "Nationwide shipping" },
  { icon: CreditCard, copy: "Pay in your local currency — secure checkout" },
  { icon: RefreshCw, copy: "30-day free returns and exchanges" },
];

/** Green of the stock pill, sampled off the frame. No JEMAI token comes close. */
const stockGreen = "#74aa5b";

export const ProductPurchase = ({ product }: ProductPurchaseProps) => {
  const { colourway, sizes, variants } = product;
  const { add } = useCart();
  const [colour, setColour] = useState("");
  const [size, setSize] = useState("");
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
   * `ToggleGroup` in single mode hands back "" when the current item is
   * re-clicked, which is the clearing behaviour this picker needs anyway:
   * gating both axes can otherwise strand a selection — every other colour
   * disabled by the size you picked, and no way back.
   */
  const choose = (set: (value: string) => void) => (value: string) => {
    set(value);
    setQuantity(1);
  };

  return (
    <>
      {/* Reads the current selection, so it lives with the chips rather than
          with the static copy above it. */}
      <span
        className="border-border-default bg-surface-page text-body-sm mt-2.5 inline-flex h-8.75 w-fit items-center gap-3 border px-4"
        style={{ color: stockGreen }}
      >
        <CheckCheck aria-hidden className="size-4" strokeWidth={1.75} />
        {available > 0
          ? `${available} Item${available === 1 ? "" : "s"} In Stock`
          : "Out of stock"}
      </span>

      <p className="text-eyebrow-lg text-text-secondary mt-11 uppercase" id="product-colour">
        Color
      </p>
      <ToggleGroup
        type="single"
        variant="chip"
        size="swatch"
        spacing={3}
        value={colour}
        onValueChange={choose(setColour)}
        aria-labelledby="product-colour"
        className="mt-4 w-full flex-wrap"
      >
        {colourway.map((option) => {
          const enabled = colourInStock(option.name);
          return (
            <ToggleGroupItem
              key={option.name}
              value={option.name}
              disabled={!enabled}
              aria-label={`${option.name}${enabled ? "" : " — unavailable"}`}
              title={option.name}
            >
              <span
                className="block size-full"
                style={{ backgroundColor: option.hex }}
              />
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>

      <p className="text-eyebrow-lg text-text-secondary mt-5 uppercase" id="product-size">
        Select size
      </p>
      <ToggleGroup
        type="single"
        variant="chip"
        size="chip"
        value={size}
        onValueChange={choose(setSize)}
        aria-labelledby="product-size"
        className="mt-4 w-full flex-wrap"
      >
        {sizes.map((option) => (
          <ToggleGroupItem
            key={option}
            value={option}
            disabled={!sizeInStock(option)}
          >
            {option}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <Separator className="bg-border-default mt-4" />

      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <QuantityStepper
          size="lg"
          label={product.name}
          value={quantity}
          onChange={setQuantity}
          max={available || 1}
        />

        {/* The frame draws this live with nothing selected, which no real
            variant picker can honour — the label is kept and the button is
            disabled until a colour and size are chosen. `flex-1` is scoped to
            the row layout; in the stacked column it would resolve flex-basis
            against the height and flatten the button. */}
        <Button
          type="button"
          size="cta"
          variant="jemai"
          disabled={!complete || available === 0}
          aria-label={
            complete ? undefined : "Add to cart — choose a colour and size first"
          }
          onClick={() =>
            add({
              slug: product.slug,
              name: product.name,
              image: product.gallery[0],
              colour,
              size: size || null,
              amount: product.amount,
              quantity,
            })
          }
          className="h-14.25 w-full sm:w-auto sm:flex-1"
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
