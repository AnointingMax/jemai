import {
  formatFileSize,
  formatUpdatedAt,
  naira,
  slugify,
  uniqueSlug,
  type MediaAsset,
} from "@/lib/admin/content";

export { formatFileSize, formatUpdatedAt, naira, slugify };

/** A media entry — thumbnail or gallery slot. Shared with every other catalogue. */
export type FurnitureAsset = MediaAsset;

/**
 * One buyable combination. The frames drew variants as two free-text tag rails
 * (sizes, then colours); stock is tracked per combination instead, so a row
 * carries its own count and the product's total is their sum.
 */
export type FurnitureVariant = {
  id: string;
  size: string;
  colour: string;
  quantity: number;
};

export type Furniture = {
  slug: string;
  name: string;
  category: string;
  /** Whole naira. Formatting happens at the edge so sorting stays numeric. */
  price: number;
  /** Total units. Derived from the variant rows whenever there are any. */
  stock: number;
  summary: string;
  variants: FurnitureVariant[];
  description: string;
  timeline: string;
  customisation: string;
  thumbnail: FurnitureAsset | null;
  media: FurnitureAsset[];
  /** ISO string; the index sorts on it and renders it as "15 May 2020 9:00 pm". */
  updatedAt: string;
};

/** The catalogue groups the index filter and the form's category select share. */
export const furnitureCategories = ["Lounge", "Table", "Sofa", "Setee", "Bed", "Storage"];

/** The product's stock: the sum of its variant counts, or its own field if bare. */
export const totalStock = (item: Pick<Furniture, "stock" | "variants">) =>
  item.variants.length
    ? item.variants.reduce((sum, variant) => sum + variant.quantity, 0)
    : item.stock;

/** "2 colours \u00b7 1 size" — the index's Options column. */
export const describeVariants = (variants: FurnitureVariant[]) => {
  const count = (values: string[]) => new Set(values.filter(Boolean)).size;
  const colours = count(variants.map((variant) => variant.colour));
  const sizes = count(variants.map((variant) => variant.size));
  const parts = [
    colours ? `${colours} ${colours === 1 ? "colour" : "colours"}` : "",
    sizes ? `${sizes} ${sizes === 1 ? "size" : "sizes"}` : "",
  ].filter(Boolean);
  return parts.length ? parts.join(" \u00b7 ") : "No variants";
};

const asset = (name: string, src: string): FurnitureAsset => ({
  id: `${name}-${src}`,
  name,
  size: 167301,
  src,
});

type Seed = Omit<
  Furniture,
  "summary" | "description" | "timeline" | "customisation" | "thumbnail" | "media" | "variants"
> & { variants: Omit<FurnitureVariant, "id">[] };

const blurb =
  "The unisex Classic Eames is designed to elevate the joy of feeling comfortable at home or when relaxing in nature. The chair are designed in a traditional style.";

const seed = ({ variants, ...input }: Seed): Furniture => ({
  variants: variants.map((variant, index) => ({
    ...variant,
    id: `${input.slug}-v${index}`,
  })),
  summary: blurb,
  description: blurb,
  timeline: blurb,
  customisation: blurb,
  thumbnail: asset("chair-white01.jpg", "/figma/home/p-alma.png"),
  media: [
    asset("hite01.jpg", "/figma/home/p-alma.png"),
    asset("bwhite01.jpg", "/figma/home/p-mila.png"),
    asset("chair white01.jpg", "/figma/home/p-nara.png"),
    asset("chair-white01.jpg", "/figma/home/p-stone.png"),
  ],
  ...input,
});

/**
 * The catalogue lives in module memory: this console has no backend yet, so
 * creates and edits survive for the life of the server process and no longer.
 * Swapping this for a real store means replacing the six functions below and
 * nothing that imports them.
 */
const store: Furniture[] = [
  seed({
    slug: "alma-accent-chair",
    name: "Alma Accent Chair",
    category: "Lounge",
    price: 458210,
    stock: 18,
    variants: [
      { size: "Organic", colour: "Red", quantity: 10 },
      { size: "Oversized fit", colour: "Blue", quantity: 8 },
    ],
    updatedAt: "2020-05-15T21:00:00.000Z",
  }),
  seed({
    slug: "mila-velvet-chair",
    name: "Mila Velvet Chair",
    category: "Table",
    price: 387100,
    stock: 12,
    variants: [
      { size: "Organic", colour: "Red", quantity: 4 },
      { size: "Organic", colour: "Blue", quantity: 3 },
      { size: "Oversized fit", colour: "Green", quantity: 5 },
    ],
    updatedAt: "2020-05-15T20:00:00.000Z",
  }),
  seed({
    slug: "nara-boucle-chair",
    name: "Nara Bouclé Chair",
    category: "Sofa",
    price: 718010,
    stock: 6,
    variants: [
      { size: "Organic", colour: "White", quantity: 4 },
      { size: "Organic", colour: "Charcoal", quantity: 2 },
    ],
    updatedAt: "2020-05-15T19:00:00.000Z",
  }),
  seed({
    slug: "stone-armchair",
    name: "Stone Armchair",
    category: "Lounge",
    price: 295000,
    stock: 9,
    variants: [{ size: "Organic", colour: "Charcoal", quantity: 9 }],
    updatedAt: "2020-05-15T17:00:00.000Z",
  }),
  seed({
    slug: "ayo-side-table",
    name: "Ayo Side Table",
    category: "Lounge",
    price: 650000,
    stock: 34,
    variants: [
      { size: "", colour: "Oak", quantity: 20 },
      { size: "", colour: "Walnut", quantity: 14 },
    ],
    updatedAt: "2020-05-15T23:00:00.000Z",
  }),
  seed({
    slug: "alma-accent-chair-oak",
    name: "Alma Accent Chair",
    category: "Lounge",
    price: 675000,
    stock: 23,
    variants: [
      { size: "Organic", colour: "Red", quantity: 11 },
      { size: "Organic", colour: "Blue", quantity: 12 },
    ],
    updatedAt: "2020-05-15T22:00:00.000Z",
  }),
  seed({
    slug: "mila-velvet-setee",
    name: "Mila Velvet Chair",
    category: "Setee",
    price: 945000,
    stock: 8,
    variants: [
      { size: "Organic", colour: "Red", quantity: 2 },
      { size: "Organic", colour: "Blue", quantity: 3 },
      { size: "Oversized fit", colour: "Green", quantity: 3 },
    ],
    updatedAt: "2020-05-15T18:00:00.000Z",
  }),
  seed({
    slug: "mila-velvet-sofa",
    name: "Mila Velvet Chair",
    category: "Sofa",
    price: 650000,
    stock: 14,
    variants: [{ size: "", colour: "Green", quantity: 14 }],
    updatedAt: "2020-05-15T18:00:00.000Z",
  }),
];

/** Newest first — the order the index draws and the order the seeds imply. */
const byRecency = (a: Furniture, b: Furniture) => b.updatedAt.localeCompare(a.updatedAt);

export const listFurniture = () => [...store].sort(byRecency);

export const getFurniture = (slug: string) => store.find((item) => item.slug === slug);

const slugsInUse = () => store.map((item) => item.slug);

export type FurnitureInput = Omit<Furniture, "slug" | "updatedAt"> & { slug: string };

/** Stable ids for the variant rows, which arrive from the form without them. */
const identify = (slug: string, variants: FurnitureVariant[]) =>
  variants.map((variant, index) => ({ ...variant, id: `${slug}-v${index}` }));

export const createFurniture = (input: FurnitureInput) => {
  const slug = uniqueSlug(slugify(input.slug || input.name), slugsInUse(), "furniture");
  const created: Furniture = {
    ...input,
    slug,
    variants: identify(slug, input.variants),
    updatedAt: new Date().toISOString(),
  };
  store.push(created);
  return created;
};

export const updateFurniture = (slug: string, input: FurnitureInput) => {
  const index = store.findIndex((item) => item.slug === slug);
  if (index === -1) return undefined;
  const next = uniqueSlug(slugify(input.slug || input.name), slugsInUse(), "furniture", slug);
  const updated: Furniture = {
    ...input,
    slug: next,
    variants: identify(next, input.variants),
    updatedAt: new Date().toISOString(),
  };
  store[index] = updated;
  return updated;
};

export const deleteFurniture = (slug: string) => {
  const index = store.findIndex((item) => item.slug === slug);
  if (index === -1) return false;
  store.splice(index, 1);
  return true;
};
