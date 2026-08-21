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
  `\u20a6${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

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
