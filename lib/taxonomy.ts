import { cache } from "react";

import { prisma } from "@/lib/prisma";

export type TaxonomyKind = "furniture-category" | "artwork-medium";

export const TAXONOMY_KINDS = ["furniture-category", "artwork-medium"] as const;

export const DEFAULT_TAXONOMY: Record<TaxonomyKind, string[]> = {
  "furniture-category": ["Lounge", "Table", "Sofa", "Setee", "Bed", "Storage"],
  "artwork-medium": [
    "Textile installation",
    "Bronze sculpture",
    "Mixed media",
    "Oil Painting",
    "Textile",
    "Sculpture",
    "Photography",
  ],
};

/** A row of either table. Neither carries anything the other does not. */
export type TaxonomyRecord = { id: string; name: string; position: number; };

/** Authoring order, then name — see the `position` note on the models. */
const ORDER = [{ position: "asc" as const }, { name: "asc" as const }];

export const readTaxonomy = (kind: TaxonomyKind): Promise<TaxonomyRecord[]> =>
  kind === "furniture-category"
    ? prisma.furnitureCategory.findMany({ orderBy: ORDER })
    : prisma.artworkMedium.findMany({ orderBy: ORDER });

export const readTaxonomyTerm = (
  kind: TaxonomyKind,
  id: string,
): Promise<TaxonomyRecord | null> =>
  kind === "furniture-category"
    ? prisma.furnitureCategory.findUnique({ where: { id } })
    : prisma.artworkMedium.findUnique({ where: { id } });

export const taxonomyNames = cache(async (kind: TaxonomyKind): Promise<string[]> => {
  const terms = await readTaxonomy(kind);
  return terms.map((term) => term.name);
});

export const furnitureCategoryNames = () => taxonomyNames("furniture-category");

export const artworkMediumNames = () => taxonomyNames("artwork-medium");
