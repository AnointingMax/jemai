import { createFurnitureAction } from "@/app/admin/(dashboard)/furniture/actions";
import { FurnitureForm } from "@/components/admin/furniture-form";
import { furnitureCategories } from "@/lib/admin/furniture";

/** Add new furniture — the create half of the shared product form. */
const AdminFurnitureNewPage = () => (
  <FurnitureForm
    categories={furnitureCategories}
    action={createFurnitureAction}
    cancelHref="/admin/furniture"
    heading="Add new furniture"
    submitLabel="Create product"
  />
);

export default AdminFurnitureNewPage;
