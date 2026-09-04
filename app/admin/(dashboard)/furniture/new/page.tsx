import { createFurnitureAction } from "@/app/admin/(dashboard)/furniture/actions";
import { FurnitureForm } from "@/components/admin/furniture-form";
import { furnitureCategoryNames } from "@/lib/taxonomy";

/** Add new furniture — the create half of the shared product form. */
const AdminFurnitureNewPage = async () => (
  <FurnitureForm
    categories={await furnitureCategoryNames()}
    action={createFurnitureAction}
    cancelHref="/admin/furniture"
    heading="Add new furniture"
    submitLabel="Create product"
  />
);

export default AdminFurnitureNewPage;
