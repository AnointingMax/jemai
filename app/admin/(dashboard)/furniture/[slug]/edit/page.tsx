import { notFound } from "next/navigation";

import { updateFurnitureAction } from "@/app/admin/(dashboard)/furniture/actions";
import { FurnitureForm, type FurnitureFormValues } from "@/components/admin/furniture-form";
import { furnitureCategories, getFurniture } from "@/lib/admin/furniture";

/**
 * Edit — the same form, handed the product as defaults. The action is the update
 * one with the current slug bound to it, so a renamed product still resolves.
 */
const AdminFurnitureEditPage = async ({ params }: PageProps<"/admin/furniture/[slug]/edit">) => {
  const { slug } = await params;
  const furniture = getFurniture(slug);
  if (!furniture) notFound();

  const values: FurnitureFormValues = {
    name: furniture.name,
    slug: furniture.slug,
    category: furniture.category,
    price: String(furniture.price),
    stock: String(furniture.stock),
    summary: furniture.summary,
    variants: furniture.variants.length
      ? furniture.variants.map((variant) => ({
          size: variant.size,
          colour: variant.colour,
          quantity: String(variant.quantity),
        }))
      : [{ size: "", colour: "", quantity: "" }],
    description: furniture.description,
    timeline: furniture.timeline,
    customisation: furniture.customisation,
    thumbnail: furniture.thumbnail ? [furniture.thumbnail] : [],
    media: furniture.media,
  };

  return (
    <FurnitureForm
      furniture={values}
      categories={furnitureCategories}
      action={updateFurnitureAction.bind(null, furniture.slug)}
      cancelHref={`/admin/furniture/${furniture.slug}`}
      heading={`Edit ${furniture.name}`}
      submitLabel="Save changes"
    />
  );
};

export default AdminFurnitureEditPage;
