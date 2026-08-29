import { prisma } from "@/lib/prisma";
import type { Artwork, ArtworkDetail, CuratedArtwork } from "@/lib/gallery";
import type { Artwork as ArtworkRecord } from "@/lib/generated/prisma/client";

/**
 * The storefront's read side of the gallery catalogue. Everything here runs on
 * the server — `lib/gallery` keeps the types and the page size, so the client
 * components that share them never pull the database in behind them.
 */

/** Stands in for a work whose photography has not been uploaded yet. */
const PLACEHOLDER_IMAGE = "/figma/artworks/work-01.jpg";

/** Thumbnail first, then the gallery in its authored order, de-duplicated. */
const images = (record: ArtworkRecord) => {
  const sources = [
    ...new Set([...(record.thumbnail ? [record.thumbnail] : []), ...record.gallery]),
  ];
  return sources.length ? sources : [PLACEHOLDER_IMAGE];
};

/** The caption run: medium and dimensions, whichever of the two is filled in. */
const caption = (record: ArtworkRecord) =>
  [record.medium, record.dimensions].filter(Boolean).join(" · ");

const toArtwork = (record: ArtworkRecord): Artwork => ({
  slug: record.slug,
  title: record.title,
  medium: caption(record),
  src: images(record)[0],
});

/** The whole catalogue, newest first — what the grid pages through. */
export const listArtworks = async (): Promise<Artwork[]> => {
  const records = await prisma.artwork.findMany({ orderBy: { createdAt: "desc" } });
  return records.map(toArtwork);
};

/**
 * The curated introduction above the grid, and the home page's carousel. Works
 * flagged in the console come first; the newest top the list up when there are
 * fewer flagged than the frame draws, so the carousel is never short.
 */
export const curatedArtworks = async (limit = 3): Promise<CuratedArtwork[]> => {
  const records = await prisma.artwork.findMany({
    orderBy: [{ curatorsPick: "desc" }, { createdAt: "desc" }],
    take: limit,
  });

  return records.map((record) => ({
    slug: record.slug,
    title: record.title,
    artist: record.artist,
    summary: record.summary,
    medium: record.medium,
    dimensions: record.dimensions,
    src: images(record)[0],
  }));
};

export const getArtworkDetail = async (slug: string): Promise<ArtworkDetail | null> => {
  const record = await prisma.artwork.findUnique({ where: { slug } });
  if (!record) return null;

  const [hero, ...rest] = images(record);

  return {
    slug: record.slug,
    title: record.title,
    medium: caption(record),
    src: hero,
    artist: record.artist,
    lead: record.summary,
    story: record.story,
    hero,
    // The frame draws six documentation shots below the rule; a work with fewer
    // simply draws fewer cells rather than repeating one to fill the grid.
    gallery: rest.slice(0, 6).map((src, index) => ({
      src,
      alt: `${record.title} — view ${index + 2}`,
    })),
  };
};
