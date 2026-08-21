import type { Product } from "@/components/site/product-card";

export type CatalogueProduct = Product & {
  id: string;
  /** Catalogue group the filter tabs switch between. */
  collection: string;
  colour: string;
  inStock: boolean;
  /** Price in kobo-free naira, for sorting. */
  amount: number;
};

type CatalogueSeed = Omit<CatalogueProduct, "id" | "price"> & { amount: number };

/** Hand-rolled so server and client always agree, whatever ICU data is around. */
const naira = (amount: number) =>
  `₦${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

/**
 * Prices on the detail frame carry kobo (₦150,851.19) while the catalogue cards
 * are whole naira, so the two formatters are kept apart rather than reconciled.
 */
export const nairaExact = (amount: number) => {
  const [whole, fraction] = amount.toFixed(2).split(".");
  return `₦${whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}.${fraction}`;
};

const seeds: Record<string, CatalogueSeed> = {
  mila: {
    name: "Mila Velvet Chair",
    category: "Lounge",
    collection: "Chairs",
    colour: "Green",
    inStock: true,
    amount: 218510,
    image: "/figma/home/p-mila.png",
    href: "/furniture/mila-velvet-chair",
  },
  alma: {
    name: "Alma Accent Chair",
    category: "Lounge",
    collection: "Chairs",
    colour: "Green",
    inStock: true,
    amount: 458210,
    image: "/figma/home/p-alma.png",
    href: "/furniture/alma-accent-chair",
  },
  nara: {
    name: "Nara Boucle Chair",
    category: "Lounge",
    collection: "Chairs",
    colour: "White",
    inStock: true,
    amount: 218510,
    image: "/figma/home/p-nara.png",
    href: "/furniture/nara-boucle-chair",
  },
  stone: {
    name: "Stone Armchair",
    category: "Lounge",
    collection: "Chairs",
    colour: "Charcoal",
    inStock: true,
    amount: 218510,
    image: "/figma/home/p-stone.png",
    href: "/furniture/stone-armchair",
  },
};

const build = (key: string, index: number): CatalogueProduct => ({
  ...seeds[key],
  id: `${key}-${index}`,
  price: naira(seeds[key].amount),
});

/** The four pieces the home page leads with, in the order the frame draws them. */
export const featuredProducts: Product[] = ["mila", "alma", "nara", "stone"].map(
  (key, index) => build(key, index),
);

/**
 * The catalogue grid. The Figma frame counts 44 items but only draws four real
 * pieces, cycled — the first sixteen in the fixed rotation below, which is what
 * the page renders on load. Swap `rotation` for real catalogue data.
 */
const rotation = [
  "mila", "nara", "alma", "stone",
  "nara", "alma", "mila", "stone",
  "mila", "stone", "nara", "alma",
  "alma", "mila", "stone", "nara",
];

export const catalogue: CatalogueProduct[] = Array.from({ length: 44 }, (_, i) =>
  build(rotation[i % rotation.length], i),
);

/** Tab groups, in the order the frame lists them. */
export const collections = [
  "Bookcases",
  "Chairs",
  "Home Decor",
  "Nightstands",
  "Tables",
  "Lighting",
  "Decor",
];

export const colours = [...new Set(catalogue.map((p) => p.colour))].sort();

/* ---------------------------------------------------------------------------
   Product detail
   --------------------------------------------------------------------------- */

export type ProductColour = {
  name: string;
  /** Swatch fill, sampled off the Figma frame. */
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
  /**
   * Main shot first. The frame draws four alternate views; only the catalogue
   * photography is exported, so the remaining three are stand-ins — replace
   * them with the real per-product shots.
   */
  gallery: string[];
  colourway: ProductColour[];
  sizes: string[];
  variants: ProductVariant[];
  sections: ProductSection[];
};

/** Swatches read off the frame's colour row (40px boxes, 12px apart). */
const colourway: ProductColour[] = [
  { name: "Cream", hex: "#efe7db" },
  { name: "Tan", hex: "#d1a97f" },
  { name: "Amber", hex: "#cc5500" },
  { name: "Olive", hex: "#3c4c24" },
];

const sizes = ["12", "13", "14", "15", "Custom"];

/**
 * Placeholder stock matrix. Deliberately uneven so the cross-filtering is
 * visible from either direction — Amber only runs in 14 and 15, Custom is made
 * to order in Cream alone, and Olive is down to a single 12. The counts sum to
 * 14, which is what the frame's "14 Items In Stock" pill reads before anything
 * is selected. Replace wholesale with real inventory.
 */
const stockMatrix: Record<string, Record<string, number>> = {
  Cream: { "12": 2, "13": 1, "14": 1, "15": 1, Custom: 1 },
  Tan: { "12": 1, "13": 2, "14": 1, "15": 0, Custom: 0 },
  Amber: { "12": 0, "13": 0, "14": 2, "15": 1, Custom: 0 },
  Olive: { "12": 1, "13": 0, "14": 0, "15": 0, Custom: 0 },
};

const variantsFrom = (
  matrix: Record<string, Record<string, number>>,
): ProductVariant[] =>
  colourway.flatMap((colour) =>
    sizes.map((size) => ({
      colour: colour.name,
      size,
      stock: matrix[colour.name]?.[size] ?? 0,
    })),
  );

/**
 * Copy for the four accordion rows. No frame draws an expanded panel, so the
 * bodies are written to a plausible length rather than transcribed.
 */
const sections: ProductSection[] = [
  {
    title: "Description",
    body: "A powder-coated steel base carries a padded seat and back, upholstered in a dense, hard-wearing weave. The proportions are deliberately compact, so the chair reads as light in a small room and holds its own around a larger table. Each frame is welded, ground and finished by hand in our Lagos workshop.",
  },
  {
    title: "Production/Delivery Timeline",
    body: "Pieces held in stock leave the workshop within three working days. Made-to-order and custom sizes are built in six to eight weeks, and we confirm a delivery window by email once your order is scheduled into the workshop calendar.",
  },
  {
    title: "Customisation",
    body: "Seat height, frame finish and upholstery can all be specified. Choose Custom under size and our studio will be in touch to take measurements and talk through fabric options, including customer's own material.",
  },
  {
    title: "Shipping/Returns",
    body: "Nationwide delivery is included on orders over ₦1,818,510. Stocked pieces can be returned within 30 days in their original condition for a full refund; made-to-order and customised pieces are final sale.",
  },
];

/**
 * The detail frame draws a "Palma Side Chair" at ₦150,851.19 over the Mila
 * photograph — a piece that does not appear in the catalogue. It is carried
 * here so the page can be checked against the frame directly, and is left out
 * of `rotation` so the catalogue grid still matches its own frame.
 */
const detailSeeds: Array<
  Pick<ProductDetail, "slug" | "name" | "category" | "summary"> & {
    amount: number;
    image: string;
  }
> = [
  {
    slug: "palma-side-chair",
    name: "Palma Side Chair",
    category: "Lounge",
    amount: 150851.19,
    summary:
      "Powder-coated steel base with a padded seat, clean lines and compact proportions...",
    image: "/figma/home/p-mila.png",
  },
  {
    slug: "mila-velvet-chair",
    name: "Mila Velvet Chair",
    category: "Lounge",
    amount: 218510,
    summary:
      "A low velvet lounge chair on a solid walnut frame, cut for long evenings rather than short sittings.",
    image: "/figma/home/p-mila.png",
  },
  {
    slug: "alma-accent-chair",
    name: "Alma Accent Chair",
    category: "Lounge",
    amount: 458210,
    summary:
      "A curved shell on tapered legs — an accent piece that reads as sculpture from across a room.",
    image: "/figma/home/p-alma.png",
  },
  {
    slug: "nara-boucle-chair",
    name: "Nara Boucle Chair",
    category: "Lounge",
    amount: 218510,
    summary:
      "Deep bouclé over a rounded frame, finished with a turned timber base and a single loose cushion.",
    image: "/figma/home/p-nara.png",
  },
  {
    slug: "stone-armchair",
    name: "Stone Armchair",
    category: "Lounge",
    amount: 218510,
    summary:
      "A wide charcoal armchair with a leather-wrapped back and a hand-shaped hardwood frame.",
    image: "/figma/home/p-stone.png",
  },
];

/** Stand-in alternate views, in the order the frame's thumbnail rail draws them. */
const alternates = [
  "/figma/home/p-stone.png",
  "/figma/home/p-nara.png",
  "/figma/home/p-alma.png",
];

export const productDetails: ProductDetail[] = detailSeeds.map((seed) => ({
  slug: seed.slug,
  name: seed.name,
  category: seed.category,
  price: nairaExact(seed.amount),
  amount: seed.amount,
  summary: seed.summary,
  gallery: [seed.image, ...alternates.filter((src) => src !== seed.image)].slice(
    0,
    4,
  ),
  colourway,
  sizes,
  variants: variantsFrom(stockMatrix),
  sections,
}));

export const getProductDetail = (slug: string) =>
  productDetails.find((product) => product.slug === slug);

/**
 * The "You May Also Like" rail. Only four real pieces exist in the seed data,
 * so a catalogue product can only ever offer the other three — the frame draws
 * four because the piece it details (Palma) is not one of them. Real catalogue
 * data fills the fourth slot without touching this.
 */
export const relatedProducts = (slug: string): Product[] =>
  featuredProducts
    .filter((product) => product.href !== `/furniture/${slug}`)
    .slice(0, 4);
