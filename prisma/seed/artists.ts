import { prisma } from "../../lib/prisma";

/**
 * The people behind the seeded catalogue and programme. As everywhere else in
 * this design the copy is placeholder — the exhibition frames draw one artist
 * across every show — so only she carries a biography and a portrait. The other
 * two are seeded as names alone, which is also what the storefront's "nothing
 * written, nothing drawn" behaviour is worth checking against.
 */
const artistSeed = [
  {
    slug: "amina-bako",
    name: "Amina Bako",
    portrait: "/figma/exhibitions/artist-portrait.jpg",
    bio: "Amina Bako is a Nigerian painter whose practice explores the relationship between land, memory and belonging. Drawing from the Guinea savannah and her memories of family compounds in Kaduna, she approaches landscape not simply as scenery, but as a living record of the people, rituals and histories held within it.\n\nWorking through layered colour, textured surfaces and recurring images of trees, pathways and gathering places, Bako creates paintings that move between observation and remembrance. Woven cloth, weathered walls, red earth and shifting light reappear throughout her work, allowing familiar environments to carry both personal and collective meaning.",
  },
  { slug: "mobi-aderemi", name: "Mobi Aderemi", portrait: null, bio: "" },
  { slug: "marcellina-akpojotor", name: "Marcellina Akpojotor", portrait: null, bio: "" },
];

export const seedArtists = async () => {
  if (await prisma.artist.count()) return 0;

  await prisma.artist.createMany({ data: artistSeed });
  return artistSeed.length;
};

/** The seeded artists by slug, for the catalogue and programme seeds to link. */
export const artistIds = async () => {
  const artists = await prisma.artist.findMany({ select: { id: true, slug: true } });
  return new Map(artists.map((artist) => [artist.slug, artist.id]));
};
