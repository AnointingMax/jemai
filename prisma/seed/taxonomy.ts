import { prisma } from "../../lib/prisma";
import { DEFAULT_TAXONOMY } from "../../lib/taxonomy";

const rows = (kind: keyof typeof DEFAULT_TAXONOMY) =>
  DEFAULT_TAXONOMY[kind].map((name, position) => ({ name, position }));

export const seedTaxonomy = async () => {
  let seeded = 0;

  if (!(await prisma.furnitureCategory.count())) {
    const data = rows("furniture-category");
    await prisma.furnitureCategory.createMany({ data });
    seeded += data.length;
  }

  if (!(await prisma.artworkMedium.count())) {
    const data = rows("artwork-medium");
    await prisma.artworkMedium.createMany({ data });
    seeded += data.length;
  }

  return seeded;
};
