import type { AdminPermission } from "@/lib/admin/auth/permissions";
import { prisma } from "@/lib/prisma";
import {
  readTaxonomy,
  readTaxonomyTerm,
  type TaxonomyKind,
  type TaxonomyRecord,
} from "@/lib/taxonomy";

/**
 * The write side of the two catalogue vocabularies. The reads — the ordered
 * names the selects and the storefront menus are built from — stay in
 * `lib/taxonomy`; what is here is the manage screen's own list, with usage
 * counts, and the four things it can do to a term.
 */

/** What each vocabulary is called, and who may change it. */
export const taxonomyMeta: Record<
  TaxonomyKind,
  {
    /** The console section a caller has to hold to write to this vocabulary. */
    permission: AdminPermission;
    /** How a message names one of these — "category", "medium". */
    noun: string;
    /** How a message names what is filed under one — "product", "artwork". */
    filed: string;
  }
> = {
  "furniture-category": { permission: "furniture", noun: "category", filed: "product" },
  "artwork-medium": { permission: "artworks", noun: "medium", filed: "artwork" },
};

/** A term as the manage screen draws it. */
export type TaxonomyTerm = TaxonomyRecord & {
  /** How many catalogue records are filed under this name right now. */
  usage: number;
};

/**
 * How many records sit under each name. One grouped query rather than a count
 * per term, and it is keyed by name because a name is what the catalogue rows
 * actually hold.
 */
const readUsage = async (kind: TaxonomyKind): Promise<Map<string, number>> => {
  if (kind === "furniture-category") {
    const groups = await prisma.furniture.groupBy({
      by: ["category"],
      _count: { _all: true },
    });
    return new Map(groups.map((group) => [group.category, group._count._all]));
  }

  const groups = await prisma.artwork.groupBy({ by: ["medium"], _count: { _all: true } });
  return new Map(groups.map((group) => [group.medium, group._count._all]));
};

/** The whole vocabulary with its usage counts — what the manage screen lists. */
export const listTaxonomy = async (kind: TaxonomyKind): Promise<TaxonomyTerm[]> => {
  const [terms, usage] = await Promise.all([readTaxonomy(kind), readUsage(kind)]);
  return terms.map((term) => ({ ...term, usage: usage.get(term.name) ?? 0 }));
};

/**
 * A name is taken if any other row already holds it, whatever its case. The
 * unique index is case-sensitive, but "Lounge" and "lounge" would read as one
 * category to everybody using the console.
 */
const findByName = async (kind: TaxonomyKind, name: string, exceptId?: string) => {
  const terms = await readTaxonomy(kind);
  const lowered = name.toLowerCase();
  return terms.find((term) => term.id !== exceptId && term.name.toLowerCase() === lowered);
};

/** Why a write was refused. The action turns one of these into its message. */
export type TaxonomyRefusal = "duplicate" | "missing" | "in-use";

/** Every write below hands back either the row it touched or one of those. */
export const isTaxonomyRefusal = (
  result: TaxonomyRecord | TaxonomyRefusal,
): result is TaxonomyRefusal => typeof result === "string";

/** Appends a term to the end of the list. */
export const createTerm = async (
  kind: TaxonomyKind,
  name: string,
): Promise<TaxonomyRecord | TaxonomyRefusal> => {
  if (await findByName(kind, name)) return "duplicate";

  const terms = await readTaxonomy(kind);
  const position = terms.reduce((last, term) => Math.max(last, term.position), -1) + 1;
  const data = { name, position };

  return kind === "furniture-category"
    ? prisma.furnitureCategory.create({ data })
    : prisma.artworkMedium.create({ data });
};

/**
 * Renames the term and, in the same transaction, every record filed under it —
 * the catalogue holds the name itself, so the two have to land together or the
 * vocabulary stops describing the catalogue.
 *
 * Merging into an existing term is deliberately not allowed. Renaming "Setee"
 * to "Sofa" would fold two collections into one for good, which is not a thing
 * to do as a side effect of fixing a spelling.
 */
export const renameTerm = async (
  kind: TaxonomyKind,
  id: string,
  name: string,
): Promise<TaxonomyRecord | TaxonomyRefusal> => {
  const term = await readTaxonomyTerm(kind, id);
  if (!term) return "missing";
  if (await findByName(kind, name, id)) return "duplicate";

  const [, renamed] = await prisma.$transaction([
    kind === "furniture-category"
      ? prisma.furniture.updateMany({ where: { category: term.name }, data: { category: name } })
      : prisma.artwork.updateMany({ where: { medium: term.name }, data: { medium: name } }),
    kind === "furniture-category"
      ? prisma.furnitureCategory.update({ where: { id }, data: { name } })
      : prisma.artworkMedium.update({ where: { id }, data: { name } }),
  ]);

  return renamed;
};

/**
 * Removes a term nothing is filed under. One still in use is refused rather
 * than cascaded: deleting it would either take the records with it or strand
 * them under a name the selects no longer offer, and neither belongs behind a
 * confirm dialog. Move the records first, then the term goes.
 */
export const deleteTerm = async (
  kind: TaxonomyKind,
  id: string,
): Promise<TaxonomyRecord | TaxonomyRefusal> => {
  const term = await readTaxonomyTerm(kind, id);
  if (!term) return "missing";

  const usage = await readUsage(kind);
  if (usage.get(term.name)) return "in-use";

  if (kind === "furniture-category") await prisma.furnitureCategory.delete({ where: { id } });
  else await prisma.artworkMedium.delete({ where: { id } });

  return term;
};

/**
 * Swaps a term with its neighbour. The whole list is renumbered from zero on
 * the way out rather than the pair alone being swapped — rows seeded at the
 * same position have no swap to make until they hold distinct numbers.
 */
export const moveTerm = async (
  kind: TaxonomyKind,
  id: string,
  direction: "up" | "down",
): Promise<TaxonomyRecord | TaxonomyRefusal> => {
  const terms = await readTaxonomy(kind);
  const index = terms.findIndex((term) => term.id === id);
  if (index < 0) return "missing";

  const target = direction === "up" ? index - 1 : index + 1;
  // Already at the end it was asked to move towards. Nothing to do, and nothing
  // worth calling an error either.
  if (target < 0 || target >= terms.length) return terms[index];

  const ordered = [...terms];
  [ordered[index], ordered[target]] = [ordered[target], ordered[index]];

  await prisma.$transaction(
    ordered.map((term, position) =>
      kind === "furniture-category"
        ? prisma.furnitureCategory.update({ where: { id: term.id }, data: { position } })
        : prisma.artworkMedium.update({ where: { id: term.id }, data: { position } }),
    ),
  );

  return terms[index];
};
