import { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import {
  naira,
  nairaExact,
  type CatalogueProduct,
  type ProductColour,
  type ProductDetail,
  type ProductSection,
  type ProductVariant,
} from "@/lib/products";
import type { Product } from "@/components/site/product-card";

/**
 * The storefront's read side of the furniture catalogue. Everything here runs
 * on the server — `lib/products` keeps the types and the formatters, so the
 * client components that share them never pull the database in behind them.
 */

/** Stands in for a product whose imagery has not been uploaded yet. */
const PLACEHOLDER_IMAGE = "/figma/home/p-mila.png";

/**
 * Swatch fills for the colour names the catalogue actually uses. A variant can
 * carry its own hex, and anything unrecognised without one falls back to the
 * frame's cream rather than dropping the swatch out of the row.
 */
const SWATCHES: Record<string, string> = {
  cream: "#efe7db",
  tan: "#d1a97f",
  amber: "#cc5500",
  olive: "#3c4c24",
  white: "#f4f2ee",
  charcoal: "#3a3a3a",
  black: "#1c1c1c",
  green: "#3c4c24",
  red: "#8c2f24",
  blue: "#2f4a6d",
  oak: "#c8a978",
  walnut: "#6b4a30",
};

const swatch = (colour: string, hex: string | null) =>
  hex ?? SWATCHES[colour.toLowerCase()] ?? SWATCHES.cream;

/** Shipping and returns is policy, not product copy, so it is written here. */
const SHIPPING_SECTION: ProductSection = {
  title: "Shipping/Returns",
  body: "Nationwide delivery is included on orders over ₦1,818,510. Stocked pieces can be returned within 30 days in their original condition for a full refund; made-to-order and customised pieces are final sale.",
};

const withRelations = {
  variants: { orderBy: { position: "asc" } },
} satisfies Prisma.FurnitureInclude;

type FurnitureRecord = Prisma.FurnitureGetPayload<{ include: typeof withRelations; }>;

/** Thumbnail first, then the gallery in its authored order, de-duplicated. */
const images = (record: FurnitureRecord) => {
  const sources = [
    ...new Set([...(record.thumbnail ? [record.thumbnail] : []), ...record.gallery]),
  ];
  return sources.length ? sources : [PLACEHOLDER_IMAGE];
};

/** Anything with a variant in stock, or — for a product with none — its own count. */
const inStock = (record: FurnitureRecord) =>
  record.variants.length
    ? record.variants.some((variant) => variant.quantity > 0)
    : record.stock > 0;

const toCatalogueProduct = (record: FurnitureRecord): CatalogueProduct => ({
  id: record.id,
  name: record.name,
  category: record.category,
  collection: record.category,
  colours: [...new Set(record.variants.map((variant) => variant.colour).filter(Boolean))],
  inStock: inStock(record),
  amount: record.price,
  price: naira(record.price),
  image: images(record)[0],
  href: `/furniture/${record.slug}`,
});

/** The card shape the home rail and the related row draw. */
const toCard = (record: FurnitureRecord): Product => ({
  name: record.name,
  category: record.category,
  price: naira(record.price),
  image: images(record)[0],
  href: `/furniture/${record.slug}`,
});

/**
 * The catalogue grid and the filter options it offers, in one trip. The tabs and
 * the colour list are drawn from the products on the page rather than from a
 * fixed vocabulary, so a filter can never come up empty.
 */
export const loadCatalogue = async () => {
  const records = await prisma.furniture.findMany({
    include: withRelations,
    orderBy: { createdAt: "desc" },
  });
  const products = records.map(toCatalogueProduct);

  return {
    products,
    collections: [...new Set(products.map((product) => product.collection))].sort(),
    colours: [...new Set(products.flatMap((product) => product.colours))].sort(),
  };
};

/** The four pieces the home page leads with — the newest in the catalogue. */
export const featuredFurniture = async (limit = 4): Promise<Product[]> => {
  const records = await prisma.furniture.findMany({
    include: withRelations,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return records.map(toCard);
};

export const getFurnitureDetail = async (slug: string): Promise<ProductDetail | null> => {
  const record = await prisma.furniture.findUnique({
    where: { slug },
    include: withRelations,
  });
  if (!record) return null;

  // Both axes come off the variant rows in authoring order, de-duplicated: the
  // detail frame draws one swatch per colour and one chip per size, and crosses
  // them against the stock table below.
  const colourway: ProductColour[] = [];
  const sizes: string[] = [];

  for (const variant of record.variants) {
    if (variant.colour && !colourway.some((colour) => colour.name === variant.colour))
      colourway.push({
        name: variant.colour,
        hex: swatch(variant.colour, variant.colourHex),
      });
    if (variant.size && !sizes.includes(variant.size)) sizes.push(variant.size);
  }

  /**
   * A product whose variants only vary by colour still needs one size for the
   * picker to complete on, since the frame requires both axes before it will
   * add to the cart. "One size" is that single chip.
   */
  const axes = sizes.length ? sizes : ["One size"];

  const variants: ProductVariant[] = colourway.flatMap((colour) =>
    axes.map((size) => ({
      colour: colour.name,
      size,
      stock: record.variants
        .filter(
          (variant) =>
            variant.colour === colour.name &&
            (sizes.length ? variant.size === size : true),
        )
        .reduce((total, variant) => total + variant.quantity, 0),
    })),
  );

  return {
    slug: record.slug,
    name: record.name,
    category: record.category,
    price: nairaExact(record.price),
    amount: record.price,
    summary: record.summary,
    gallery: images(record).slice(0, 4),
    colourway,
    sizes: axes,
    variants,
    sections: [
      { title: "Description", body: record.description },
      { title: "Production/Delivery Timeline", body: record.timeline },
      { title: "Customization", body: record.customization },
      SHIPPING_SECTION,
    ],
  };
};

/**
 * The "You May Also Like" rail: the rest of the piece's own category first,
 * topped up from the wider catalogue when that category is thin.
 */
export const relatedFurniture = async (slug: string, limit = 4): Promise<Product[]> => {
  const record = await prisma.furniture.findUnique({
    where: { slug },
    select: { category: true },
  });

  const records = await prisma.furniture.findMany({
    where: { slug: { not: slug } },
    include: withRelations,
    orderBy: { createdAt: "desc" },
    take: limit * 3,
  });

  const sameCategory = records.filter((item) => item.category === record?.category);
  const rest = records.filter((item) => item.category !== record?.category);

  return [...sameCategory, ...rest].slice(0, limit).map(toCard);
};
