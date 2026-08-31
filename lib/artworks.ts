import { prisma } from "@/lib/prisma";
import type { Artwork, ArtworkDetail, CuratedArtwork } from "@/lib/gallery";
import type { Prisma } from "@/lib/generated/prisma/client";

/** Every read pulls the artist the work is attributed to. */
const withArtist = { artist: { select: { name: true } } } satisfies Prisma.ArtworkInclude;

type ArtworkRecord = Prisma.ArtworkGetPayload<{ include: typeof withArtist; }>;

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

export const listArtworkMediums = async (): Promise<string[]> => {
  const rows = await prisma.artwork.findMany({
    distinct: ["medium"],
    select: { medium: true },
    orderBy: { medium: "asc" },
  });
  return rows.map((row) => row.medium).filter(Boolean);
};

export const listArtworks = async (medium?: string): Promise<Artwork[]> => {
  const records = await prisma.artwork.findMany({
    where: medium ? { medium } : undefined,
    include: withArtist,
    orderBy: { createdAt: "desc" },
  });
  return records.map(toArtwork);
};

export const curatedArtworks = async (
  limit = 3,
  medium?: string,
): Promise<CuratedArtwork[]> => {
  const records = await prisma.artwork.findMany({
    where: medium ? { medium, curatorsPick: true } : undefined,
    include: withArtist,
    orderBy: [{ curatorsPick: "desc" }, { createdAt: "desc" }],
    take: limit,
  });

  return records.map((record) => ({
    slug: record.slug,
    title: record.title,
    artist: record.artist?.name ?? "",
    summary: record.summary,
    medium: record.medium,
    dimensions: record.dimensions,
    src: images(record)[0],
  }));
};

export const getArtworkDetail = async (slug: string): Promise<ArtworkDetail | null> => {
  const record = await prisma.artwork.findUnique({ where: { slug }, include: withArtist });
  if (!record) return null;

  const [hero, ...rest] = images(record);

  return {
    slug: record.slug,
    title: record.title,
    medium: caption(record),
    src: hero,
    artist: record.artist?.name ?? "",
    lead: record.summary,
    story: record.story,
    hero,
    gallery: rest.slice(0, 6).map((src, index) => ({
      src,
      alt: `${record.title} — view ${index + 2}`,
    })),
  };
};
