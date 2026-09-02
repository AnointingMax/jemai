import type { Product } from "@/components/site/product-card";

export type CatalogueProduct = Product & {
  id: string;
  collection: string;
  colors: string[];
  inStock: boolean;
  amount: number;
};

/** Hand-rolled so server and client always agree, whatever ICU data is around. */
export const naira = (amount: number) =>
  `₦${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

export const nairaExact = (amount: number) => {
  const [whole, fraction] = amount.toFixed(2).split(".");
  return `₦${whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}.${fraction}`;
};

/* ---------------------------------------------------------------------------
   Product detail
   --------------------------------------------------------------------------- */

export type ProductColour = {
  name: string;
  /** Swatch fill; the variant's own hex, or the named-colour fallback. */
  hex: string;
};

export type ProductVariant = {
  colour: string;
  size: string;
  /** Whole naira — the variant's own price, or the product's where it has none. */
  amount: number;
  stock: number;
};

export type ProductSection = {
  title: string;
  body: string;
};

export type ProductDetail = {
  slug: string;
  name: string;
  category: string;
  /** The headline price before a combination is picked — "From ₦x" when the
   *  variants disagree, the single formatted price when they don't. */
  price: string;
  /** The lowest of those, so the stepper and the cart have a number to start on. */
  amount: number;
  summary: string;
  gallery: string[];
  colourway: ProductColour[];
  sizes: string[];
  variants: ProductVariant[];
  sections: ProductSection[];
};
