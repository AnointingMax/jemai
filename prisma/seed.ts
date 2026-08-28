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
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
