import type { Product } from "@/components/site/product-card";

/**
 * The storefront's product vocabulary: the shapes the furniture pages pass
 * around and the two price formatters they draw with. Deliberately free of any
 * data access — the catalogue is read from the database in `lib/furniture`,
 * which is server-only, while these types and formatters are shared with client
 * components (the catalogue filters, the purchase panel, the cart).
 */

export type CatalogueProduct = Product & {
  id: string;
  /** Catalogue group the filter tabs switch between. */
  collection: string;
  /** Every colour the piece runs in — the colour filter matches any of them. */
  colours: string[];
  inStock: boolean;
  /** Price in kobo-free naira, for sorting. */
  amount: number;
};

/** Hand-rolled so server and client always agree, whatever ICU data is around. */
export const naira = (amount: number) =>
  `₦${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

/**
 * Prices on the detail frame carry kobo (₦150,851.19) while the catalogue cards
 * are whole naira, so the two formatters are kept apart rather than reconciled.
 */
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

/**
 * One purchasable combination. `stock` of 0 means the combination exists in the
 * range but cannot be bought, which is what drives the cross-filtering on the
 * detail page: picking a colour narrows the selectable sizes to those with
 * stock in that colour, and picking a size narrows the colours the same way.
 */
export type ProductVariant = {
  colour: string;
  size: string;
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
  /** Formatted with kobo, as the detail frame draws it. */
  price: string;
  /** The same figure unformatted, so the cart can total it. */
  amount: number;
  summary: string;
  /** Thumbnail first, then the gallery, as the thumbnail rail draws them. */
  gallery: string[];
  colourway: ProductColour[];
  sizes: string[];
  variants: ProductVariant[];
  sections: ProductSection[];
};
