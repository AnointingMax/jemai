import Link from "next/link";

import {
  ALL_CATEGORIES,
  FurnitureTable,
  type FurnitureRow,
} from "@/components/admin/furniture-table";
import { Button } from "@/components/ui/button";
import { formatUpdatedAt } from "@/lib/admin/content";
import { param, paramOneOf } from "@/lib/admin/table-query";
import { describeVariants, listFurniture, totalStock } from "@/lib/admin/furniture";
import { furnitureCategoryNames } from "@/lib/taxonomy";

/**
 * Furniture — the catalogue index. The store is read here and flattened to the
 * columns the table draws, so the media and long copy never cross to the client.
 */
const AdminFurniturePage = async ({ searchParams }: PageProps<"/admin/furniture">) => {
  // The search box and the category filter live in the URL, so the view
  // survives a reload and can be sent as a link; the narrowing runs in the
  // query below rather than over rows already sent.
  const query = await searchParams;
  const search = param(query, "q") ?? "";
  // The vocabulary is managed at /admin/taxonomy, so the filter is read against
  // whatever is in the list now rather than a fixed set compiled into the page.
  const categories = await furnitureCategoryNames();
  const category = paramOneOf(query, "category", categories);

  const furniture = await listFurniture({ search, category });
  const rows: FurnitureRow[] = furniture.map((item) => ({
    slug: item.slug,
    name: item.name,
    category: item.category,
    price: item.price,
    stock: totalStock(item),
    options: describeVariants(item.variants),
    updatedAt: item.updatedAt,
    updatedLabel: formatUpdatedAt(item.updatedAt),
    thumbnail: item.thumbnail,
  }));

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-text-primary text-2xl font-semibold">Furniture</h1>
          <p className="text-text-secondary max-w-[70ch] text-sm">
            Add, edit and delete furniture products. Changes publish to the live catalogue
            without a developer deployment.
          </p>
        </div>
        <Button asChild size="lg" className="h-11 shrink-0 px-5 text-sm">
          <Link href="/admin/furniture/new">Add product</Link>
        </Button>
      </header>

      <FurnitureTable
        rows={rows}
        categories={categories}
        search={search}
        category={category ?? ALL_CATEGORIES}
      />
    </div>
  );
};

export default AdminFurniturePage;
