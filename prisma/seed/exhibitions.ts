import { prisma } from "../../lib/prisma";
import { artistIds } from "./artists";

const summary =
  "The exhibition asks how land remembers the people who pass through it, and how the places that shape us continue to live within us, even after we have moved on.";

const content =
  "In Bako's paintings, the landscape is never empty. It bears the imprint of those who cultivate it, cross it, gather beneath it and carry its memory elsewhere. Trees appear as quiet custodians—rooted in place while witnessing generations of movement and change.\n\nHer surfaces are built through thick pigment, broken colour and repeated gestures. Greens arrive with the force of the rainy season; pale blues recall the clarity of morning after harmattan; ochres and deep browns carry the warmth of laterite earth.\n\nAcross the series, branches reach towards one another like bodies gathering under a shared canopy. What begins as a study of landscape becomes a meditation on belonging: the homes we inherit, the places we leave and the ground that continues to recognize us.";

type Seed = {
  slug: string;
  name: string;
  startDate: string;
  endDate: string;
  venue: string;
  thumbnail: string;
  paid?: boolean;
  price?: number;
};

const exhibitionSeed: Seed[] = [
  {
    slug: "the-land-knows-our-names",
    name: "The Land Knows Our Names",
    startDate: "2026-08-15",
    endDate: "2026-09-14",
    venue: "JEMAI Gallery, Lagos",
    thumbnail: "/figma/exhibitions/up-next.jpg",
    paid: true,
    price: 15000,
  },
  {
    slug: "between-earth-and-light",
    name: "Between Earth and Light",
    startDate: "2026-09-12",
    endDate: "2026-09-26",
    venue: "JEMAI Gallery, Lagos",
    thumbnail: "/figma/exhibitions/soon-2.jpg",
  },
  {
    slug: "material-memory",
    name: "Material Memory",
    startDate: "2026-10-18",
    endDate: "2026-11-02",
    venue: "Victoria Island",
    thumbnail: "/figma/exhibitions/soon-1.jpg",
  },
  {
    slug: "forms-of-stillness",
    name: "Forms of Stillness",
    startDate: "2025-07-12",
    endDate: "2025-07-25",
    venue: "Victoria Island",
    thumbnail: "/figma/exhibitions/past-1.jpg",
  },
  {
    slug: "between-earth-and-light-2025",
    name: "Between Earth and Light",
    startDate: "2025-05-12",
    endDate: "2025-05-25",
    venue: "Victoria Island",
    thumbnail: "/figma/exhibitions/past-2.jpg",
  },
  {
    slug: "between-earth-and-light-lagos",
    name: "Between Earth and Light",
    startDate: "2025-05-12",
    endDate: "2025-05-25",
    venue: "JEMAI Gallery, Lagos",
    thumbnail: "/figma/exhibitions/past-3.jpg",
  },
  {
    slug: "the-land-knows-our-names-2024",
    name: "The Land Knows Our Names",
    startDate: "2024-05-18",
    endDate: "2024-06-02",
    venue: "Victoria Island",
    thumbnail: "/figma/exhibitions/past-4.jpg",
  },
  {
    slug: "material-memory-2024",
    name: "Material Memory",
    startDate: "2024-03-15",
    endDate: "2024-04-14",
    venue: "Victoria Island",
    thumbnail: "/figma/exhibitions/past-5.jpg",
  },
];

/** The installation views every seeded show shares until real photography lands. */
const gallery = [
  "/figma/exhibitions/install-1.jpg",
  "/figma/exhibitions/hero-past.jpg",
  "/figma/artworks/hero.jpg",
];

export const seedExhibitions = async () => {
  if (await prisma.exhibition.count()) return 0;

  // The links point at real rows, so the works are looked up rather than named
  // by slug. Whatever the artwork seed wrote is what the frames' rails draw.
  // Every seeded show is hers, as the frames draw it.
  const bako = (await artistIds()).get("amina-bako");

  const artworks = await prisma.artwork.findMany({
    orderBy: { createdAt: "asc" },
    take: 4,
    select: { id: true },
  });

  for (const { paid, price, startDate, endDate, ...item } of exhibitionSeed) {
    await prisma.exhibition.create({
      data: {
        ...item,
        startDate: new Date(`${startDate}T00:00:00.000Z`),
        endDate: new Date(`${endDate}T00:00:00.000Z`),
        paid: paid ?? false,
        price: price ?? 0,
        summary,
        content,
        gallery,
        ...(bako ? { artists: { create: [{ artistId: bako, position: 0 }] } } : {}),
        featured: {
          create: artworks.map((artwork, position) => ({
            artworkId: artwork.id,
            position,
          })),
        },
      },
    });
  }

  return exhibitionSeed.length;
};
