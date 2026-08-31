import { slugify, uniqueSlug } from "@/lib/admin/content";
import { prisma } from "@/lib/prisma";
import { searchAcross } from "@/lib/admin/table-query";
import type { Artist as ArtistRecord } from "@/lib/generated/prisma/client";

/**
 * The people the gallery shows. An artist is held once and pointed at from both
 * the catalogue and the programme, so a name is spelled one way everywhere and
 * a biography written once is the biography everywhere it appears.
 */
export type Artist = {
  id: string;
  slug: string;
  name: string;
  /** The "About the Artist" copy. Empty until somebody writes it. */
  bio: string;
  portrait: string | null;
  updatedAt: string;
};

/** What a form sends for one artist. The name is what resolves the record. */
export type ArtistInput = {
  name: string;
  bio: string;
  portrait: string | null;
};

const toArtist = (record: ArtistRecord): Artist => ({
  id: record.id,
  slug: record.slug,
  name: record.name,
  bio: record.bio,
  portrait: record.portrait,
  updatedAt: record.updatedAt.toISOString(),
});

/** Alphabetical — the order a picker reads best in. */
export const listArtists = async (search?: string) => {
  const records = await prisma.artist.findMany({
    where: searchAcross(["name"], search),
    orderBy: { name: "asc" },
  });
  return records.map(toArtist);
};

/** A slug no other artist holds, suffixed `-2`, `-3`, … if one does. */
const availableSlug = async (name: string) => {
  const base = slugify(name) || "artist";
  const taken = await prisma.artist.findMany({
    where: { slug: { startsWith: base } },
    select: { slug: true },
  });
  return uniqueSlug(
    taken.map((row) => row.slug),
    base,
    "artist",
  );
};

/**
 * The artist a form's name refers to, created if this is the first anyone has
 * heard of them. The slug is the identity, so "Amina Bako" typed on an artwork
 * and again on an exhibition is one person rather than two.
 *
 * `bio` and `portrait` only ever fill blanks: a form that leaves them empty —
 * as the artwork form does, which asks for a name and nothing else — must not
 * wipe the biography somebody wrote on the artist's own screen.
 */
export const upsertArtistByName = async (input: ArtistInput) => {
  const name = input.name.trim();
  if (!name) return null;

  const slug = slugify(name) || "artist";
  const existing = await prisma.artist.findUnique({ where: { slug } });

  if (!existing) {
    return prisma.artist.create({
      data: {
        slug: await availableSlug(name),
        name,
        bio: input.bio,
        portrait: input.portrait,
      },
    });
  }

  return prisma.artist.update({
    where: { id: existing.id },
    data: {
      name,
      bio: input.bio || existing.bio,
      portrait: input.portrait ?? existing.portrait,
    },
  });
};
