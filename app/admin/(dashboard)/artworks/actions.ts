"use server";

import { revalidatePath } from "next/cache";
import * as Yup from "yup";

import { failWith, ok, validate, fail, type ActionResult } from "@/lib/action-result";
import { readActiveAdmin } from "@/lib/admin/auth/session";
import { hasPermission } from "@/lib/admin/auth/permissions";
import {
  createArtwork,
  deleteArtwork,
  updateArtwork,
  type ArtworkInput,
} from "@/lib/admin/artworks";
import { imageAssetSchema } from "@/lib/cloudinary";
import { artworkMediumNames } from "@/lib/taxonomy";


const requireArtworkAccess = async (): Promise<ActionResult<string>> => {
  const session = await readActiveAdmin();
  if (!session) return fail("Your session has expired. Sign in again.");
  if (!hasPermission(session.permissions, "artworks"))
    return fail("You do not have access to the gallery catalogue.");
  return ok(session.id);
};

const artworkPayload = (mediums: string[]) =>
  Yup.object({
    title: Yup.string().trim().required("An artwork title is required."),
    slug: Yup.string().trim().default(""),
    artist: Yup.string().trim().required("An artist is required."),
    // Saved onto the artist, not the work — the form carries it so a picked
    // artist arrives with their copy in view.
    artistBio: Yup.string().trim().default(""),
    artistPortrait: Yup
      .array(imageAssetSchema)
      .max(1, "An artist has one portrait.")
      .default([]),
    medium: Yup
      .string()
      .trim()
      .default("")
      .oneOf(["", ...mediums], "Pick a medium from the list."),
    year: Yup
      .string()
      .trim()
      .default("")
      .matches(/^(\d{4})?$/, "Pick a year from the list."),
    dimensions: Yup.string().trim().required("Dimensions are required."),
    summary: Yup.string().trim().required("A short summary is required."),
    story: Yup.string().default(""),
    curatorsPick: Yup.boolean().default(false),
    thumbnail: Yup.array(imageAssetSchema).max(1, "An artwork has one thumbnail.").default([]),
    media: Yup.array(imageAssetSchema).default([]),
  });

type ArtworkPayload = Yup.InferType<ReturnType<typeof artworkPayload>>;

const toInput = (values: ArtworkPayload): ArtworkInput => ({
  slug: values.slug,
  title: values.title,
  artist: values.artist,
  artistBio: values.artistBio,
  artistPortrait: values.artistPortrait[0]?.src ?? null,
  medium: values.medium,
  year: values.year,
  dimensions: values.dimensions,
  summary: values.summary,
  story: values.story,
  curatorsPick: values.curatorsPick,
  thumbnail: values.thumbnail[0]?.src ?? null,
  media: values.media.map((asset) => asset.src),
});

const revalidateArtwork = (slug?: string) => {
  revalidatePath("/admin/artworks");
  revalidatePath("/admin/exhibitions");
  revalidatePath("/admin");
  revalidatePath("/artworks");
  revalidatePath("/");
  if (slug) {
    revalidatePath(`/admin/artworks/${slug}`);
    revalidatePath(`/artworks/${slug}`);
  }
};

/** Creates the artwork. The caller navigates to the slug that comes back. */
export const createArtworkAction = async (
  values: unknown,
): Promise<ActionResult<{ slug: string; title: string; }>> => {
  const access = await requireArtworkAccess();
  if (access.error) return access;

  const parsed = await validate(artworkPayload(await artworkMediumNames()), values);
  if (parsed.error) return parsed;

  try {
    const created = await createArtwork(toInput(parsed.data));
    revalidateArtwork(created.slug);
    return ok({ slug: created.slug, title: created.title });
  } catch (error) {
    return failWith("Could not save this artwork. Try again.", error);
  }
};

/** Same trip for an edit — the slug can change, so the new one comes back. */
export const updateArtworkAction = async (
  slug: string,
  values: unknown,
): Promise<ActionResult<{ slug: string; title: string; }>> => {
  const access = await requireArtworkAccess();
  if (access.error) return access;

  const parsed = await validate(artworkPayload(await artworkMediumNames()), values);
  if (parsed.error) return parsed;

  try {
    const updated = await updateArtwork(slug, toInput(parsed.data));
    if (!updated) return fail("That artwork no longer exists.");

    revalidateArtwork(updated.slug);
    if (updated.slug !== slug) revalidateArtwork(slug);

    return ok({ slug: updated.slug, title: updated.title });
  } catch (error) {
    return failWith("Could not save this artwork. Try again.", error);
  }
};

export const deleteArtworkAction = async (
  slug: string,
): Promise<ActionResult<string>> => {
  const access = await requireArtworkAccess();
  if (access.error) return access;

  try {
    const deleted = await deleteArtwork(slug);
    if (!deleted) return fail("That artwork no longer exists.");

    revalidateArtwork(slug);
    return ok("Artwork deleted");
  } catch (error) {
    return failWith("Could not delete this artwork. Try again.", error);
  }
};
