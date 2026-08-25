"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { ArtworkFormValues } from "@/components/admin/artwork-form";
import {
  createArtwork,
  deleteArtwork,
  updateArtwork,
  type ArtworkInput,
} from "@/lib/admin/artworks";

/** The one place the form's values become the store's record. */
const toInput = (values: ArtworkFormValues): ArtworkInput => ({
  slug: values.slug.trim(),
  title: values.title.trim(),
  artist: values.artist.trim(),
  medium: values.medium,
  year: values.year,
  dimensions: values.dimensions.trim(),
  summary: values.summary.trim(),
  // Left as authored here; the store sanitises it, so every write goes through
  // the same filter whatever calls it.
  story: values.story,
  curatorsPick: values.curatorsPick,
  thumbnail: values.thumbnail[0] ?? null,
  media: values.media,
});

/** Creates the artwork, then lands the author on its detail page. */
export const createArtworkAction = async (values: ArtworkFormValues) => {
  const created = createArtwork(toInput(values));
  revalidatePath("/admin/artworks");
  revalidatePath("/admin");
  redirect(`/admin/artworks/${created.slug}`);
};

/** Same trip for an edit — the slug can change, so the redirect uses the new one. */
export const updateArtworkAction = async (slug: string, values: ArtworkFormValues) => {
  const updated = updateArtwork(slug, toInput(values));
  if (!updated) redirect("/admin/artworks");
  revalidatePath("/admin/artworks");
  revalidatePath(`/admin/artworks/${updated.slug}`);
  redirect(`/admin/artworks/${updated.slug}`);
};

export const deleteArtworkAction = async (slug: string) => {
  deleteArtwork(slug);
  revalidatePath("/admin/artworks");
  revalidatePath("/admin");
  redirect("/admin/artworks");
};
