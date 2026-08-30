// Must come first: lib/env validates process.env the moment it is imported.
import "dotenv/config";

import { prisma } from "../../lib/prisma";
import { seedAdmin } from "./admin";
import { seedArtists } from "./artists";
import { seedArtworks } from "./artworks";
import { seedEnquiries } from "./enquiries";
import { seedExhibitions } from "./exhibitions";
import { seedFurniture } from "./furniture";
import { seedSubscribers } from "./newsletter";

/**
 * The seed's running order. Each table's fixtures live in their own module
 * beside this one; this file only says what runs, in what order, and what it
 * reports. Order matters twice — artists come before the
 * catalogue and the programme that point at them, and enquiries resolve their
 * pieces against the artworks table, so they follow it.
 */
const main = async () => {
  const admin = await seedAdmin();
  console.log(`Seeded admin ${admin.email} (${admin.permissions.length} permissions)`);

  // Every catalogue seed skips a table that already has rows, so a re-run never
  // overwrites what the console has authored since. Same report either way.
  const seeds = [
    { run: seedArtists, one: "artist", many: "artists", subject: "Artists" },
    { run: seedFurniture, one: "furniture product", many: "furniture products", subject: "Furniture" },
    { run: seedArtworks, one: "artwork", many: "artworks", subject: "Artworks" },
    { run: seedSubscribers, one: "newsletter subscriber", many: "newsletter subscribers", subject: "Subscribers" },
    { run: seedEnquiries, one: "artwork enquiry", many: "artwork enquiries", subject: "Enquiries" },
    { run: seedExhibitions, one: "exhibition", many: "exhibitions", subject: "Exhibitions" },
  ];

  for (const seed of seeds) {
    const count = await seed.run();
    console.log(
      count
        ? `Seeded ${count} ${count === 1 ? seed.one : seed.many}`
        : `${seed.subject} already present — left untouched`,
    );
  }
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
