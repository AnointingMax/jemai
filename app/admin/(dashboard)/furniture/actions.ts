"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { FurnitureFormValues } from "@/components/admin/furniture-form";
import {
  createFurniture,
  deleteFurniture,
  updateFurniture,
  type FurnitureInput,
} from "@/lib/admin/furniture";

/** The one place the form's strings become the store's numbers. */
const toInput = (values: FurnitureFormValues): FurnitureInput => {
  const variants = values.variants
    .filter((variant) => variant.colour.trim() || variant.size.trim())
    .map((variant) => ({
      id: "",
      size: variant.size.trim(),
      colour: variant.colour.trim(),
      quantity: Number(variant.quantity) || 0,
    }));

  return {
    slug: values.slug.trim(),
    name: values.name.trim(),
    category: values.category || "Lounge",
    price: Number(values.price) || 0,
    stock: variants.length
      ? variants.reduce((sum, variant) => sum + variant.quantity, 0)
      : Number(values.stock) || 0,
    summary: values.summary.trim(),
    variants,
    description: values.description.trim(),
    timeline: values.timeline.trim(),
    customisation: values.customisation.trim(),
    thumbnail: values.thumbnail[0] ?? null,
    media: values.media,
  };
};

/** Creates the product, then lands the author on its detail page. */
export const createFurnitureAction = async (values: FurnitureFormValues) => {
  const created = createFurniture(toInput(values));
  revalidatePath("/admin/furniture");
  revalidatePath("/admin");
  redirect(`/admin/furniture/${created.slug}`);
};

/** Same trip for an edit — the slug can change, so the redirect uses the new one. */
export const updateFurnitureAction = async (slug: string, values: FurnitureFormValues) => {
  const updated = updateFurniture(slug, toInput(values));
  if (!updated) redirect("/admin/furniture");
  revalidatePath("/admin/furniture");
  revalidatePath(`/admin/furniture/${updated.slug}`);
  redirect(`/admin/furniture/${updated.slug}`);
};

export const deleteFurnitureAction = async (slug: string) => {
  deleteFurniture(slug);
  revalidatePath("/admin/furniture");
  revalidatePath("/admin");
  redirect("/admin/furniture");
};
