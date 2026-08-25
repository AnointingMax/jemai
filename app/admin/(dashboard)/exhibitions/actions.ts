"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { ExhibitionFormValues } from "@/components/admin/exhibition-form";
import {
  createExhibition,
  deleteExhibition,
  getExhibition,
  updateExhibition,
  type ExhibitionInput,
} from "@/lib/admin/exhibitions";

/** The one place the form's strings become the store's numbers and booleans. */
const toInput = (values: ExhibitionFormValues): ExhibitionInput => ({
  slug: values.slug.trim(),
  name: values.name.trim(),
  artist: values.artist.trim(),
  startDate: values.startDate,
  endDate: values.endDate,
  venue: values.venue.trim(),
  admission: {
    paid: values.admission === "paid",
    price: Number(values.price) || 0,
  },
  status: values.status,
  summary: values.summary.trim(),
  content: values.content.trim(),
  artistBio: values.artistBio.trim(),
  thumbnail: values.thumbnail[0] ?? null,
  artistProfile: values.artistProfile[0] ?? null,
  media: values.media,
  featured: values.featured,
});

/** Creates the exhibition, then lands the author on its detail page. */
export const createExhibitionAction = async (values: ExhibitionFormValues) => {
  const created = createExhibition(toInput(values));
  revalidatePath("/admin/exhibitions");
  revalidatePath("/exhibitions");
  redirect(`/admin/exhibitions/${created.slug}`);
};

/** Same trip for an edit — the slug can change, so the redirect uses the new one. */
export const updateExhibitionAction = async (slug: string, values: ExhibitionFormValues) => {
  const updated = updateExhibition(slug, toInput(values));
  if (!updated) redirect("/admin/exhibitions");
  revalidatePath("/admin/exhibitions");
  revalidatePath(`/admin/exhibitions/${updated.slug}`);
  revalidatePath("/exhibitions");
  redirect(`/admin/exhibitions/${updated.slug}`);
};

/**
 * The trash button beside a single-image card on the detail screen. Clearing a
 * slot is a one-field edit, so it goes through the store directly rather than
 * round-tripping the whole form.
 */
export const clearExhibitionImageAction = async (
  slug: string,
  slot: "thumbnail" | "artistProfile"
) => {
  const exhibition = getExhibition(slug);
  if (!exhibition) redirect("/admin/exhibitions");
  updateExhibition(slug, { ...exhibition, [slot]: null });
  revalidatePath(`/admin/exhibitions/${slug}`);
  revalidatePath("/exhibitions");
};

export const deleteExhibitionAction = async (slug: string) => {
  deleteExhibition(slug);
  revalidatePath("/admin/exhibitions");
  revalidatePath("/exhibitions");
  redirect("/admin/exhibitions");
};
