// Must come first: lib/env validates process.env the moment it is imported.
import "dotenv/config";

import { hashPassword } from "../lib/admin/auth/password";
import { ADMIN_PERMISSIONS } from "../lib/admin/auth/permissions";
import env from "../lib/env";
import { prisma } from "../lib/prisma";

const required = <T,>(value: T | undefined, name: string) => {
  if (!value) throw new Error(`Missing ${name} — set it in .env`);
  return value;
};

/**
 * The catalogue the Figma frames were drawn against. Written only into an empty
 * furniture table, so re-running the seed never overwrites what the console has
 * authored since.
 */
const blurb =
  "The unisex Classic Eames is designed to elevate the joy of feeling comfortable at home or when relaxing in nature. The chair are designed in a traditional style.";

const furnitureSeed = [
  {
    slug: "alma-accent-chair",
    name: "Alma Accent Chair",
    category: "Lounge",
    price: 458210,
    image: "/figma/home/p-alma.png",
    variants: [
      { size: "Organic", colour: "Red", quantity: 10 },
      { size: "Oversized fit", colour: "Blue", quantity: 8 },
    ],
  },
  {
    slug: "mila-velvet-chair",
    name: "Mila Velvet Chair",
    category: "Table",
    price: 387100,
    image: "/figma/home/p-mila.png",
    variants: [
      { size: "Organic", colour: "Red", quantity: 4 },
      { size: "Organic", colour: "Blue", quantity: 3 },
      { size: "Oversized fit", colour: "Green", quantity: 5 },
    ],
  },
  {
    slug: "nara-boucle-chair",
    name: "Nara Bouclé Chair",
    category: "Sofa",
    price: 718010,
    image: "/figma/home/p-nara.png",
    variants: [
      { size: "Organic", colour: "White", quantity: 4 },
      { size: "Organic", colour: "Charcoal", quantity: 2 },
    ],
  },
  {
    slug: "stone-armchair",
    name: "Stone Armchair",
    category: "Lounge",
    price: 295000,
    image: "/figma/home/p-stone.png",
    variants: [{ size: "Organic", colour: "Charcoal", quantity: 9 }],
  },
  {
    slug: "ayo-side-table",
    name: "Ayo Side Table",
    category: "Lounge",
    price: 650000,
    image: "/figma/home/p-alma.png",
    variants: [
      { size: "", colour: "Oak", quantity: 20 },
      { size: "", colour: "Walnut", quantity: 14 },
    ],
  },
  {
    slug: "mila-velvet-setee",
    name: "Mila Velvet Setee",
    category: "Setee",
    price: 945000,
    image: "/figma/home/p-mila.png",
    variants: [
      { size: "Organic", colour: "Red", quantity: 2 },
      { size: "Organic", colour: "Blue", quantity: 3 },
      { size: "Oversized fit", colour: "Green", quantity: 3 },
    ],
  },
];

const seedFurniture = async () => {
  if (await prisma.furniture.count()) return 0;

  const gallery = [
    "/figma/home/p-alma.png",
    "/figma/home/p-mila.png",
    "/figma/home/p-nara.png",
    "/figma/home/p-stone.png",
  ];

  for (const item of furnitureSeed)
    await prisma.furniture.create({
      data: {
        slug: item.slug,
        name: item.name,
        category: item.category,
        price: item.price,
        stock: item.variants.reduce((sum, variant) => sum + variant.quantity, 0),
        summary: blurb,
        description: blurb,
        timeline: blurb,
        customization: blurb,
        thumbnail: item.image,
        // The piece's own shot first, then the rest of the range as the
        // stand-in alternate views the frame's thumbnail rail draws.
        gallery: [item.image, ...gallery.filter((src) => src !== item.image)],
        variants: {
          create: item.variants.map((variant, position) => ({ ...variant, position })),
        },
      },
    });

  return furnitureSeed.length;
};

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

const seedArtworks = async () => {
  if (await prisma.artwork.count()) return 0;

  // The six documentation shots the detail frame draws, which every seeded work
  // shares until real photography is uploaded against each one.
  const gallery = [1, 2, 3, 4, 5, 6].map((n) => `/figma/artworks/detail/gallery-${n}.jpg`);

  await prisma.artwork.createMany({
    data: artworkSeed.map((item) => ({ ...item, story: artworkStory, gallery })),
  });

  return artworkSeed.length;
};

/**
 * The subscriber list the newsletter frame was drawn against — the same
 * addresses, sources and timestamps, so the index still fills a page and its
 * pager before a single real sign-up comes in.
 */
const subscriberSeed = [
  { email: "nneka.obi@example.com", name: "Nneka Obi", source: "Footer form", subscribedAt: "2026-08-18T07:56:00.000Z" },
  { email: "tolu.martins@example.com", name: "Tolu Martins", source: "Exhibition", subscribedAt: "2026-08-17T14:08:00.000Z" },
  { email: "ada.okafor@example.com", name: "Ada Okafor", source: "Checkout", subscribedAt: "2026-08-16T12:45:00.000Z" },
  { email: "sade.bello@example.com", name: "Sade Bello", source: "Footer form", subscribedAt: "2026-08-15T10:22:00.000Z" },
  { email: "femi.cole@example.com", name: "Femi Cole", source: "Footer form", subscribedAt: "2026-08-14T09:31:00.000Z" },
  { email: "chidi.eze@example.com", name: "Chidi Eze", source: "Exhibition", subscribedAt: "2026-08-13T18:04:00.000Z" },
  { email: "amaka.nwosu@example.com", name: "Amaka Nwosu", source: "Checkout", subscribedAt: "2026-08-12T11:17:00.000Z" },
  { email: "kelechi.udo@example.com", name: "", source: "Footer form", subscribedAt: "2026-08-11T08:49:00.000Z" },
  { email: "yemi.adeyemi@example.com", name: "Yemi Adeyemi", source: "Footer form", subscribedAt: "2026-08-10T16:35:00.000Z" },
  { email: "ifeoma.balogun@example.com", name: "Ifeoma Balogun", source: "Exhibition", subscribedAt: "2026-08-09T13:02:00.000Z" },
  { email: "seyi.ogunlade@example.com", name: "Seyi Ogunlade", source: "Checkout", subscribedAt: "2026-08-08T19:20:00.000Z" },
  { email: "hauwa.ibrahim@example.com", name: "Hauwa Ibrahim", source: "Footer form", subscribedAt: "2026-08-07T07:11:00.000Z" },
  { email: "obinna.aneke@example.com", name: "", source: "Exhibition", subscribedAt: "2026-08-06T15:58:00.000Z" },
  { email: "zainab.lawal@example.com", name: "Zainab Lawal", source: "Footer form", subscribedAt: "2026-08-05T10:07:00.000Z" },
];

const seedSubscribers = async () => {
  if (await prisma.subscriber.count()) return 0;

  await prisma.subscriber.createMany({
    data: subscriberSeed.map((item) => ({
      ...item,
      subscribedAt: new Date(item.subscribedAt),
    })),
  });

  return subscriberSeed.length;
};

const main = async () => {
  const email = required(env.ADMIN_SEED_EMAIL, "ADMIN_SEED_EMAIL").toLowerCase();
  const name = env.ADMIN_SEED_NAME;
  const passwordHash = await hashPassword(
    required(env.ADMIN_SEED_PASSWORD, "ADMIN_SEED_PASSWORD"),
  );

  const permissions = [...ADMIN_PERMISSIONS];

  const admin = await prisma.admin.upsert({
    where: { email },
    // Re-running the seed refreshes the password and restores full access.
    update: { name, passwordHash, permissions, isActive: true },
    create: { email, name, passwordHash, permissions },
  });

  console.log(`Seeded admin ${admin.email} (${admin.permissions.length} permissions)`);

  const furniture = await seedFurniture();
  console.log(
    furniture
      ? `Seeded ${furniture} furniture products`
      : "Furniture already present — left untouched",
  );

  const artworks = await seedArtworks();
  console.log(
    artworks
      ? `Seeded ${artworks} artworks`
      : "Artworks already present — left untouched",
  );

  const subscribers = await seedSubscribers();
  console.log(
    subscribers
      ? `Seeded ${subscribers} newsletter subscribers`
      : "Subscribers already present — left untouched",
  );
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
