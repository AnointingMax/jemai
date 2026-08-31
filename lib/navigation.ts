import { cache } from "react";

import { listArtworkMediums } from "@/lib/artworks";
import { listFurnitureCategories } from "@/lib/furniture";

/** One entry in a header dropdown. */
export type MenuLink = { label: string; href: string; };

/** The two dropdowns the header draws, keyed by the nav item they hang under. */
export type SiteMenus = {
  furniture: MenuLink[];
  art: MenuLink[];
};

export const siteMenus = cache(async (): Promise<SiteMenus> => {
  const [categories, mediums] = await Promise.all([
    listFurnitureCategories(),
    listArtworkMediums(),
  ]);

  return {
    furniture: [
      { label: "Shop All", href: "/furniture" },
      ...categories.map((category) => ({
        label: category,
        href: `/furniture?collection=${encodeURIComponent(category)}`,
      })),
    ],
    art: [
      { label: "Shop All", href: "/artworks" },
      ...mediums.map((medium) => ({
        label: medium,
        href: `/artworks?medium=${encodeURIComponent(medium)}`,
      })),
    ],
  };
});
