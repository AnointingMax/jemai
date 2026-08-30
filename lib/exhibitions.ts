import {
  formatDateShort,
  formatDateSpan,
  naira,
} from "@/lib/admin/content";
import {
  exhibitionStatus,
  isArchived,
  startOfToday,
  toDateField,
} from "@/lib/admin/exhibitions";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/lib/generated/prisma/client";

/**
 * The storefront's read side of the exhibition programme. Everything here runs
 * on the server; the shapes below are what the exhibition components read, and
 * the client ones import them as types only.
 *
 * Which record a page draws is decided by its run, not by a stored status: a
 * show is live on `/exhibitions` until the day after it ends, and in the
 * archive from then on. Nothing has to be updated for a run to end.
 */

export type ExhibitionStatus = "upcoming" | "past";

/** A photograph and the line a screen reader gets for it. */
export type Shot = { src: string; alt: string; };

/** One work in the past-detail rail. */
export type ExhibitionWork = Shot & { title: string; year: string; href: string; };

/** One exhibition as either index draws it, in its card. */
export type ExhibitionSummary = {
  slug: string;
  title: string;
  /** The card's second line: the artist for upcoming, the run for past. */
  cardMeta: string;
  card: Shot;
  href: string;
};

export type Exhibition = {
  slug: string;
  title: string;
  artist: string;
  status: ExhibitionStatus;
  /** "12 September–4 October 2026" — the detail page's date line. */
  dates: string;
  /** The detail page's full-bleed hero. */
  hero: string;
  /** Lead paragraph, set in `text-h4` on the 800px measure. */
  lead: string;
  /** Supporting paragraphs below the lead. */
  body: string[];
  /**
   * Paid exhibitions carry a ticket; free ones omit it and the register modal
   * drops its ticket summary. The frame draws both states.
   */
  ticket?: { label: string; price: string; };
};

/** The artist block both detail frames close on. */
export type ArtistNote = {
  heading: string;
  portrait: Shot;
  paragraphs: string[];
};

export type ExhibitionDetail = Exhibition & {
  /** The opening date on its own, which the register modal draws. */
  opensOn: string;
  /** Installation views — the past frame's rail. */
  installShots: Shot[];
  /** The linked catalogue works, in the order the console arranged them. */
  works: ExhibitionWork[];
  artistNote: ArtistNote;
};

/** The featured "UP NEXT" block on the upcoming index. */
export type UpNext = Pick<Exhibition, "slug" | "title" | "artist" | "ticket"> & {
  eyebrow: string;
  copy: string;
  image: Shot;
  rows: { label: string; value: string; }[];
  opensOn: string;
};

/** Stands in for a show whose photography has not been uploaded yet. */
const PLACEHOLDER_HERO = "/figma/exhibitions/detail-hero.jpg";
const PLACEHOLDER_PORTRAIT = "/figma/exhibitions/artist-portrait.jpg";

/**
 * Three slides run behind both index heroes. These are the frames' own
 * photography rather than programme data — no exhibition owns the band, so it
 * stays a fixture here.
 */
export const upcomingHero: Shot[] = [
  { src: "/figma/exhibitions/hero-upcoming.jpg", alt: "A JEMAI gallery room hung with framed landscapes" },
  { src: "/figma/artworks/hero.jpg", alt: "Visitors viewing framed works in the JEMAI gallery" },
  { src: "/figma/home/ex-sculpture.jpg", alt: "A sculpture on a plinth in the gallery" },
];

export const pastHero: Shot[] = [
  { src: "/figma/exhibitions/hero-past.jpg", alt: "Three framed paintings on a deep red gallery wall" },
  { src: "/figma/artworks/hero.jpg", alt: "Visitors viewing framed works in the JEMAI gallery" },
  { src: "/figma/home/ex-slide-1.jpg", alt: "Visitors before a framed work in the gallery" },
];

/** The console stores the long copy as plain text; blank lines are paragraphs. */
const paragraphs = (copy: string) =>
  copy
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

/** The two trees the storefront draws, out of the three states a run has. */
const status = (start: Date, end: Date): ExhibitionStatus =>
  isArchived(exhibitionStatus(start, end)) ? "past" : "upcoming";

/**
 * Still to end — everything the upcoming index lists, running shows included —
 * and its opposite, the archive.
 *
 * Both are functions, not constants: a module stays loaded for as long as the
 * server runs, so a boundary computed once at import would still be yesterday's
 * midnight tomorrow, and a show that ended overnight would never move.
 */
const live = () => ({ endDate: { gte: startOfToday() } });

const ended = () => ({ endDate: { lt: startOfToday() } });

/** Where a show's own pages live, which its status decides. */
export const exhibitionHref = (slug: string, state: ExhibitionStatus) =>
  state === "past" ? `/exhibitions/past/${slug}` : `/exhibitions/${slug}`;

const withDetail = {
  featured: {
    orderBy: { position: "asc" },
    select: {
      artwork: {
        select: { slug: true, title: true, year: true, thumbnail: true, gallery: true },
      },
    },
  },
} satisfies Prisma.ExhibitionInclude;

type DetailRecord = Prisma.ExhibitionGetPayload<{ include: typeof withDetail; }>;
type CardRecord = Pick<
  DetailRecord,
  "slug" | "name" | "artist" | "startDate" | "endDate" | "thumbnail"
>;

const ticketFor = (record: Pick<DetailRecord, "paid" | "price">) =>
  record.paid
    ? { label: "General admission", price: naira(record.price) }
    : undefined;

const toCard = (record: CardRecord): ExhibitionSummary => {
  const state = status(record.startDate, record.endDate);
  const run = formatDateSpan(toDateField(record.startDate), toDateField(record.endDate));

  return {
    slug: record.slug,
    title: record.name,
    // Upcoming cards name the artist, past ones the run — as both frames draw.
    cardMeta: state === "past" ? run : record.artist,
    card: { src: record.thumbnail ?? PLACEHOLDER_HERO, alt: record.name },
    href: exhibitionHref(record.slug, state),
  };
};

const cardColumns = {
  slug: true,
  name: true,
  artist: true,
  startDate: true,
  endDate: true,
  thumbnail: true,
} satisfies Prisma.ExhibitionSelect;

/**
 * The programme still to run, soonest first — the upcoming index's cards. A
 * show that opened last week has not ended, so it is still here rather than in
 * the archive.
 */
export const listUpcomingExhibitions = async (): Promise<ExhibitionSummary[]> => {
  const records = await prisma.exhibition.findMany({
    where: live(),
    orderBy: { startDate: "asc" },
    select: cardColumns,
  });
  return records.map(toCard);
};

/** The archive, most recently closed first. */
export const listPastExhibitions = async (): Promise<ExhibitionSummary[]> => {
  const records = await prisma.exhibition.findMany({
    where: ended(),
    orderBy: { endDate: "desc" },
    select: cardColumns,
  });
  return records.map(toCard);
};

const toDetail = (record: DetailRecord): ExhibitionDetail => {
  const startDate = toDateField(record.startDate);
  const [lead, ...body] = paragraphs(record.summary);

  return {
    slug: record.slug,
    title: record.name,
    artist: record.artist,
    status: status(record.startDate, record.endDate),
    dates: formatDateSpan(startDate, toDateField(record.endDate)),
    hero: record.thumbnail ?? PLACEHOLDER_HERO,
    lead: lead ?? "",
    // The summary is one paragraph in practice, so the detail copy is the body;
    // anything the summary carried beyond its first paragraph leads it.
    body: [...body, ...paragraphs(record.content)],
    ticket: ticketFor(record),
    opensOn: formatDateShort(startDate),
    installShots: record.gallery.map((src, index) => ({
      src,
      alt: `${record.name} — installation view ${index + 1}`,
    })),
    works: record.featured.map(({ artwork }) => ({
      src: artwork.thumbnail ?? artwork.gallery[0] ?? PLACEHOLDER_HERO,
      alt: `${artwork.title}, ${artwork.year}`,
      title: artwork.title,
      year: artwork.year,
      href: `/artworks/${artwork.slug}`,
    })),
    artistNote: {
      heading: "About the Artist",
      portrait: {
        src: record.artistProfile ?? PLACEHOLDER_PORTRAIT,
        alt: record.artist
          ? `${record.artist} photographed in their studio`
          : "The artist photographed in their studio",
      },
      paragraphs: paragraphs(record.artistBio),
    },
  };
};

/**
 * One exhibition, for the detail page of the tree that asked. `state` is the
 * tree, so an archived show does not answer on `/exhibitions/[slug]` and an
 * upcoming one does not answer in the archive — each has one canonical URL.
 */
export const getExhibition = async (
  slug: string,
  state: ExhibitionStatus,
): Promise<ExhibitionDetail | null> => {
  const record = await prisma.exhibition.findUnique({
    where: { slug },
    include: withDetail,
  });
  if (!record || status(record.startDate, record.endDate) !== state) return null;

  return toDetail(record);
};

/**
 * The next show to open, which the upcoming index features above its cards.
 *
 * The frame's third row is an opening time; the console records a run and a
 * venue but no opening hour, so admission takes that row rather than inventing
 * a time the gallery never entered.
 */
export const getUpNext = async (): Promise<UpNext | null> => {
  const record = await prisma.exhibition.findFirst({
    where: live(),
    orderBy: { startDate: "asc" },
    include: withDetail,
  });
  if (!record) return null;

  const detail = toDetail(record);

  return {
    slug: detail.slug,
    title: detail.title,
    artist: detail.artist,
    ticket: detail.ticket,
    eyebrow: "Up next",
    copy: detail.lead,
    image: {
      src: record.thumbnail ?? PLACEHOLDER_HERO,
      alt: detail.title,
    },
    rows: [
      { label: "Date", value: detail.dates },
      { label: "Venue", value: record.venue || "JEMAI Gallery, Lagos" },
      {
        label: "Admission",
        value: detail.ticket ? `${detail.ticket.label} · ${detail.ticket.price}` : "Free",
      },
    ],
    opensOn: detail.opensOn,
  };
};
