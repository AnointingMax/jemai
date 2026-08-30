import {
  formatDateRange,
  formatDateSpan,
  naira,
  slugify,
  uniqueSlug,
} from "@/lib/admin/content";
import { upsertArtistByName, type ArtistInput } from "@/lib/admin/artists";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/lib/generated/prisma/client";

/**
 * Where a show sits in its own run. Derived from the dates on every read, never
 * stored and never chosen: a run that ended last night is archived this morning
 * whether or not anybody opened the console, which is the one thing a status
 * field can never promise.
 */
export const exhibitionStatuses = ["Upcoming", "Open now", "Archived"] as const;

export type ExhibitionStatus = (typeof exhibitionStatuses)[number];

/**
 * Today as the date columns hold it — UTC midnight — so a comparison is a
 * comparison of days rather than of instants, and a show whose last day is
 * today is still open at 11pm in Lagos.
 */
export const startOfToday = () => {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
};

/** The status the dates imply. Both ends are inclusive: a run includes its last day. */
export const exhibitionStatus = (start: Date, end: Date): ExhibitionStatus => {
  const today = startOfToday();
  if (end < today) return "Archived";
  if (start > today) return "Upcoming";
  return "Open now";
};

/**
 * The same three states asked in SQL, for the index's status filter. The status
 * is a reading of the run rather than a column, so a filter is a comparison of
 * the dates against today — which keeps the narrowing in the query instead of
 * over rows already fetched, and keeps it agreeing with `exhibitionStatus`.
 */
export const statusWhere = (
  status?: ExhibitionStatus,
): Prisma.ExhibitionWhereInput => {
  const today = startOfToday();
  if (status === "Archived") return { endDate: { lt: today } };
  if (status === "Upcoming") return { startDate: { gt: today } };
  if (status === "Open now")
    return { startDate: { lte: today }, endDate: { gte: today } };
  return {};
};

/** Only archived shows sit in the storefront's past record; the rest are live. */
export const isArchived = (status: ExhibitionStatus) => status === "Archived";

/**
 * Admission is either free or a single ticket price. The frames draw it as a
 * radio pair with an amount field that only matters on the paid branch, so the
 * price is kept even while free — flipping back and forth must not lose it.
 */
export type Admission = { paid: boolean; price: number; };

export type Exhibition = {
  id: string;
  slug: string;
  name: string;
  /**
   * The artists showing, in the order the console arranged them. A group show
   * has several and a show whose line-up is not settled has none — which is
   * what draws no artist block at all rather than an empty one.
   */
  artists: ArtistInput[];
  /** `yyyy-mm-dd`, the value a native date field hands back. */
  startDate: string;
  endDate: string;
  venue: string;
  admission: Admission;
  /** The short line under the title on the detail record. */
  summary: string;
  /** The exhibition's own detail-page copy. */
  content: string;
  /** Derived from the run — see `exhibitionStatus`. Never written. */
  status: ExhibitionStatus;
  /** Source of the thumbnail shot, or null before one is uploaded. */
  thumbnail: string | null;
  /** Installation sources, in the order the detail rail draws them. */
  media: string[];
  /** Slugs out of the artwork catalogue, linked onto the exhibition page. */
  featured: string[];
  /** ISO string; the index sorts on it. */
  updatedAt: string;
};

/** "Paid · ₦15,000", or "Free" — the index's Admission column and the record row. */
export const describeAdmission = (admission: Admission) =>
  admission.paid ? `Paid · ${naira(admission.price)}` : "Free";

/** "15 Aug – 14 Sep" — the index's Date column. */
export const exhibitionDates = (exhibition: Pick<Exhibition, "startDate" | "endDate">) =>
  formatDateRange(exhibition.startDate, exhibition.endDate);

/** "12 September–4 October 2026" — the detail record's Date row. */
export const exhibitionSpan = (exhibition: Pick<Exhibition, "startDate" | "endDate">) =>
  formatDateSpan(exhibition.startDate, exhibition.endDate);

/**
 * A `DATE` column back as the `yyyy-mm-dd` a date field speaks. The driver
 * hands it over as UTC midnight, so the UTC parts are the authored day — the
 * local ones would be the day before for half the world.
 */
export const toDateField = (value: Date) => value.toISOString().slice(0, 10);

/** The other direction: a date field's value as the UTC midnight it means. */
const toDateColumn = (value: string) => new Date(`${value}T00:00:00.000Z`);

/** Every read below pulls its linked works in the author's order. */
const withArtists = {
  artists: {
    orderBy: { position: "asc" },
    select: { artist: { select: { name: true, bio: true, portrait: true } } },
  },
  featured: {
    orderBy: { position: "asc" },
    select: { artwork: { select: { slug: true } } },
  },
} satisfies Prisma.ExhibitionInclude;

type ExhibitionRecord = Prisma.ExhibitionGetPayload<{ include: typeof withArtists; }>;

const toExhibition = (record: ExhibitionRecord): Exhibition => ({
  id: record.id,
  slug: record.slug,
  name: record.name,
  artists: record.artists.map(({ artist }) => ({
    name: artist.name,
    bio: artist.bio,
    portrait: artist.portrait,
  })),
  startDate: toDateField(record.startDate),
  endDate: toDateField(record.endDate),
  venue: record.venue,
  admission: { paid: record.paid, price: record.price },
  summary: record.summary,
  content: record.content,
  status: exhibitionStatus(record.startDate, record.endDate),
  thumbnail: record.thumbnail,
  media: record.gallery,
  featured: record.featured.map((link) => link.artwork.slug),
  updatedAt: record.updatedAt.toISOString(),
});

export type ExhibitionQuery = { search?: string; status?: ExhibitionStatus; };

/**
 * Newest first — the order the index draws — narrowed by the index's search and
 * status filter.
 */
export const listExhibitions = async ({ search, status }: ExhibitionQuery = {}) => {
  const records = await prisma.exhibition.findMany({
    where: {
      ...statusWhere(status),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" as const } },
              { venue: { contains: search, mode: "insensitive" as const } },
              // The artists are records now, so a search for one goes through
              // the link rather than a column on the show.
              { artists: { some: { artist: { name: { contains: search, mode: "insensitive" as const } } } } },
            ],
          }
        : {}),
    },
    orderBy: { updatedAt: "desc" },
    include: withArtists,
  });
  return records.map(toExhibition);
};

/**
 * The overview's counter: shows still to run — everything that has not ended,
 * which is the same question the derivation answers, asked in SQL so the whole
 * programme is not read to count it.
 */
export const countUpcomingExhibitions = () =>
  prisma.exhibition.count({ where: { endDate: { gte: startOfToday() } } });

export const getExhibition = async (slug: string) => {
  const record = await prisma.exhibition.findUnique({
    where: { slug },
    include: withArtists,
  });
  return record ? toExhibition(record) : null;
};

export type ExhibitionInput = Omit<
  Exhibition,
  "id" | "slug" | "status" | "updatedAt"
> & { slug: string; };

/**
 * A slug no other exhibition holds, suffixed `-2`, `-3`, … if one does. Only
 * the candidate's own family is fetched rather than the whole programme, and
 * `ignore` is the record's current slug so re-saving it unchanged does not push
 * it to `-2`.
 */
const availableSlug = async (candidate: string, name: string, ignore?: string) => {
  const base = slugify(candidate || name) || "exhibition";
  const taken = await prisma.exhibition.findMany({
    where: { slug: { startsWith: base } },
    select: { slug: true },
  });
  return uniqueSlug(
    taken.map((row) => row.slug),
    base,
    "exhibition",
    ignore,
  );
};

/** The columns both writes set — everything except the slug and the links. */
const columns = (input: ExhibitionInput) => ({
  name: input.name,
  startDate: toDateColumn(input.startDate),
  endDate: toDateColumn(input.endDate),
  venue: input.venue,
  paid: input.admission.paid,
  price: input.admission.price,
  summary: input.summary,
  content: input.content,
  thumbnail: input.thumbnail,
  gallery: input.media,
});

/**
 * The featured rows for the slugs the picker sent, in the order it sent them.
 * A slug that no longer resolves is dropped rather than failing the save — the
 * work it named was deleted while the form was open, which is not the author's
 * problem to fix mid-save.
 */
/**
 * The artists a form sent, as links in the order they were arranged. Each is
 * resolved by name — created the first time it is used, and updated with the
 * biography and portrait this form carries, since the exhibition form is where
 * that copy is authored.
 *
 * An artist dropped from the form is unlinked, never deleted: their other shows
 * and their works still point at them.
 */
const artistLinks = async (artists: ArtistInput[]) => {
  const links: { artistId: string; position: number; }[] = [];

  for (const [position, input] of artists.entries()) {
    const artist = await upsertArtistByName(input);
    if (artist) links.push({ artistId: artist.id, position });
  }

  // Two rows for one artist would break the link's own primary key, and the
  // form has no way of knowing a name was typed twice.
  return links.filter(
    (link, index) => links.findIndex((other) => other.artistId === link.artistId) === index,
  );
};

const featuredLinks = async (slugs: string[]) => {
  if (!slugs.length) return [];
  const artworks = await prisma.artwork.findMany({
    where: { slug: { in: slugs } },
    select: { id: true, slug: true },
  });
  const ids = new Map(artworks.map((artwork) => [artwork.slug, artwork.id]));

  return slugs
    .map((slug, position) => ({ artworkId: ids.get(slug), position }))
    .filter((link): link is { artworkId: string; position: number; } =>
      Boolean(link.artworkId),
    );
};

export const createExhibition = async (input: ExhibitionInput) => {
  const record = await prisma.exhibition.create({
    data: {
      slug: await availableSlug(input.slug, input.name),
      ...columns(input),
      artists: { create: await artistLinks(input.artists) },
      featured: { create: await featuredLinks(input.featured) },
    },
    include: withArtists,
  });
  return toExhibition(record);
};

export const updateExhibition = async (slug: string, input: ExhibitionInput) => {
  const existing = await prisma.exhibition.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (!existing) return null;

  const record = await prisma.exhibition.update({
    where: { id: existing.id },
    data: {
      slug: await availableSlug(input.slug, input.name, slug),
      ...columns(input),
      // The links carry no state of their own, so each list replaces its own
      // outright rather than being diffed row by row.
      artists: { deleteMany: {}, create: await artistLinks(input.artists) },
      featured: { deleteMany: {}, create: await featuredLinks(input.featured) },
    },
    include: withArtists,
  });
  return toExhibition(record);
};

export const deleteExhibition = async (slug: string) => {
  const { count } = await prisma.exhibition.deleteMany({ where: { slug } });
  return count > 0;
};
