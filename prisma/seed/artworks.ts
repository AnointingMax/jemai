import { prisma } from "../../lib/prisma";

/**
 * The gallery catalogue the artwork frames were drawn against. Written only
 * into an empty artworks table, on the same terms as the furniture seed.
 */
const artworkStory =
  "<p>Threads Of Becoming unfolds through repetition, material and gradual changes in tone. Suspended forms move from pale grey to deep umber, creating a rhythmic field that appears both ordered and organic.</p><p>Individual strands gather into a larger whole, turning fibre into a meditation on continuity, transformation and the memories carried through material.</p>";

const artworkSeed = [
  {
    slug: "threads-of-becoming",
    title: "Threads of Becoming",
    artist: "Amina Bako",
    medium: "Textile installation",
    year: "2026",
    dimensions: "180 × 240 cm",
    summary:
      "A rhythmic study in fibre and repetition, moving from light into shadow as individual strands gather into a meditation on change, continuity and memory.",
    curatorsPick: true,
    thumbnail: "/figma/artworks/detail/hero.jpg",
  },
  {
    slug: "drops-of-effervescence",
    title: "Drops of effervescence",
    artist: "Mobi Aderemi",
    medium: "Bronze sculpture",
    year: "2025",
    dimensions: "60 × 40 × 40 cm",
    summary: "Cast bronze caught mid-motion, its surface broken into rising points of light.",
    curatorsPick: false,
    thumbnail: "/figma/artworks/work-02.jpg",
  },
  {
    slug: "contour-of-class",
    title: "Contour of Class",
    artist: "Marcellina Akpojotor",
    medium: "Mixed media",
    year: "2024",
    dimensions: "2 ft × 3 ft",
    summary: "Layered paper and pigment tracing the outlines of inherited social form.",
    curatorsPick: false,
    thumbnail: "/figma/artworks/work-03.jpg",
  },
  {
    slug: "golden-thread",
    title: "Golden Thread",
    artist: "Amina Bako",
    medium: "Textile",
    year: "2024",
    dimensions: "120 × 150 cm",
    summary: "A single warm line drawn through a field of muted weave.",
    curatorsPick: false,
    thumbnail: "/figma/artworks/work-04.jpg",
  },
  {
    slug: "golden-thread-oil",
    title: "Golden Thread",
    artist: "Mobi Aderemi",
    medium: "Oil Painting",
    year: "2023",
    dimensions: "90 × 120 cm",
    summary: "Oil on linen, worked wet into wet until the seam between figure and ground closes.",
    curatorsPick: false,
    thumbnail: "/figma/artworks/work-05.jpg",
  },
  {
    slug: "golden-thread-bronze",
    title: "Golden Thread",
    artist: "Amina Bako",
    medium: "Bronze sculpture",
    year: "2023",
    dimensions: "45 × 30 × 30 cm",
    summary: "A cast filament held upright, catching light along its full length.",
    curatorsPick: false,
    thumbnail: "/figma/artworks/work-06.jpg",
  },
  {
    slug: "golden-thread-mixed",
    title: "Golden Thread",
    artist: "Marcellina Akpojotor",
    medium: "Mixed media",
    year: "2022",
    dimensions: "2 ft × 3 ft",
    summary: "Found paper, thread and pigment built into a shallow relief.",
    curatorsPick: false,
    thumbnail: "/figma/artworks/work-07.jpg",
  },
  {
    slug: "golden-thread-study",
    title: "Golden Thread",
    artist: "Mobi Aderemi",
    medium: "Mixed media",
    year: "2022",
    dimensions: "50 × 70 cm",
    summary: "A working study for the larger piece, kept for its unresolved edges.",
    curatorsPick: false,
    thumbnail: "/figma/artworks/work-08.jpg",
  },
];

export const seedArtworks = async () => {
  if (await prisma.artwork.count()) return 0;

  // The six documentation shots the detail frame draws, which every seeded work
  // shares until real photography is uploaded against each one.
  const gallery = [1, 2, 3, 4, 5, 6].map((n) => `/figma/artworks/detail/gallery-${n}.jpg`);

  await prisma.artwork.createMany({
    data: artworkSeed.map((item) => ({ ...item, story: artworkStory, gallery })),
  });

  return artworkSeed.length;
};
