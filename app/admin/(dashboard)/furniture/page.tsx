import Link from "next/link";

import { FurnitureTable, type FurnitureRow } from "@/components/admin/furniture-table";
import { Button } from "@/components/ui/button";
import { formatUpdatedAt } from "@/lib/admin/content";
import {
  describeVariants,
  furnitureCategories,
  listFurniture,
  totalStock,
} from "@/lib/admin/furniture";

/**
 * Furniture — the catalogue index. The store is read here and flattened to the
 * columns the table draws, so the media and long copy never cross to the client.
 */
const AdminFurniturePage = async () => {
  const furniture = await listFurniture();
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

      <FurnitureTable rows={rows} categories={furnitureCategories} />
    </div>
  );
};

export default AdminFurniturePage;
