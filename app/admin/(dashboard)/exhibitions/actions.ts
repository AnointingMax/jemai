"use server";

import { revalidatePath } from "next/cache";
import * as Yup from "yup";

import { failWith, ok, validate, fail, type ActionResult } from "@/lib/action-result";
import { readAdminSession } from "@/lib/admin/auth/session";
import { hasPermission } from "@/lib/admin/auth/permissions";
import {
  createExhibition,
  deleteExhibition,
  getExhibition,
  updateExhibition,
  type ExhibitionInput,
} from "@/lib/admin/exhibitions";
import { imageAssetSchema } from "@/lib/cloudinary";

const requireExhibitionAccess = async (): Promise<ActionResult<string>> => {
  const session = await readAdminSession();
  if (!session) return fail("Your session has expired. Sign in again.");
  if (!hasPermission(session.permissions, "exhibitions"))
    return fail("You do not have access to the exhibition programme.");
  return ok(session.sub);
};

const exhibitionPayload = () => {
  const date = (message: string) =>
    Yup.string().trim().matches(/^\d{4}-\d{2}-\d{2}$/, message).required(message);

  return Yup.object({
    name: Yup.string().trim().required("An exhibition name is required."),
    slug: Yup.string().trim().default(""),
    artist: Yup.string().trim().default(""),
    startDate: date("A start date is required."),
    endDate: date("An end date is required.").test(
      "after-start",
      "The run cannot end before it starts.",
      // Both are `yyyy-mm-dd`, so a string compare is a date compare.
      (value, context) => !value || value >= context.parent.startDate,
    ),
    venue: Yup.string().trim().default(""),
    admission: Yup
      .string()
      .trim()
      .default("free")
      .oneOf(["free", "paid"], "Admission is either free or paid."),
    // Only meaningful on the paid branch, and validated only there — the form
    // keeps whatever was typed while free, and a free show saves it as zero.
    price: Yup.string().trim().default("").test(
      "paid-price",
      "Enter a ticket price in whole naira.",
      (value, context) =>
        context.parent.admission !== "paid" ||
        (Number(value) > 0 && Number.isFinite(Number(value))),
    ),
    summary: Yup.string().trim().required("A short summary is required."),
    content: Yup.string().trim().default(""),
    artistBio: Yup.string().trim().default(""),
    thumbnail: Yup.array(imageAssetSchema).max(1, "An exhibition has one thumbnail.").default([]),
    artistProfile: Yup.array(imageAssetSchema).max(1, "An artist has one portrait.").default([]),
    media: Yup.array(imageAssetSchema).default([]),
    featured: Yup.array(Yup.string().trim().required()).default([]),
  });
};

type ExhibitionPayload = Yup.InferType<ReturnType<typeof exhibitionPayload>>;

/** The one place the form's strings become the store's numbers and booleans. */
const toInput = (values: ExhibitionPayload): ExhibitionInput => ({
  slug: values.slug,
  name: values.name,
  artist: values.artist,
  startDate: values.startDate,
  endDate: values.endDate,
  venue: values.venue,
  admission: {
    paid: values.admission === "paid",
    price: Number(values.price) || 0,
  },
  summary: values.summary,
  content: values.content,
  artistBio: values.artistBio,
  thumbnail: values.thumbnail[0]?.src ?? null,
  artistProfile: values.artistProfile[0]?.src ?? null,
  media: values.media.map((asset) => asset.src),
  featured: values.featured,
});

const revalidateExhibition = (slug?: string) => {
  revalidatePath("/admin/exhibitions");
  revalidatePath("/admin");
  revalidatePath("/exhibitions");
  revalidatePath("/exhibitions/past");
  revalidatePath("/");
  if (slug) {
    revalidatePath(`/admin/exhibitions/${slug}`);
    revalidatePath(`/exhibitions/${slug}`);
    revalidatePath(`/exhibitions/past/${slug}`);
  }
};

/** Creates the exhibition. The caller navigates to the slug that comes back. */
export const createExhibitionAction = async (
  values: unknown,
): Promise<ActionResult<{ slug: string; name: string; }>> => {
  const access = await requireExhibitionAccess();
  if (access.error) return access;

  const parsed = await validate(exhibitionPayload(), values);
  if (parsed.error) return parsed;

  try {
    const created = await createExhibition(toInput(parsed.data));
    revalidateExhibition(created.slug);
    return ok({ slug: created.slug, name: created.name });
  } catch (error) {
    return failWith("Could not save this exhibition. Try again.", error);
  }
};

/** Same trip for an edit — the slug can change, so the new one comes back. */
export const updateExhibitionAction = async (
  slug: string,
  values: unknown,
): Promise<ActionResult<{ slug: string; name: string; }>> => {
  const access = await requireExhibitionAccess();
  if (access.error) return access;

  const parsed = await validate(exhibitionPayload(), values);
  if (parsed.error) return parsed;

  try {
    const updated = await updateExhibition(slug, toInput(parsed.data));
    if (!updated) return fail("That exhibition no longer exists.");

    revalidateExhibition(updated.slug);
    if (updated.slug !== slug) revalidateExhibition(slug);

    return ok({ slug: updated.slug, name: updated.name });
  } catch (error) {
    return failWith("Could not save this exhibition. Try again.", error);
  }
};

/**
 * The trash button beside a single-image card on the detail screen. Clearing a
 * slot is a one-field edit, so it goes through the store directly rather than
 * round-tripping the whole form.
 */
export const clearExhibitionImageAction = async (
  slug: string,
  slot: "thumbnail" | "artistProfile",
): Promise<ActionResult<string>> => {
  const access = await requireExhibitionAccess();
  if (access.error) return access;

  try {
    const exhibition = await getExhibition(slug);
    if (!exhibition) return fail("That exhibition no longer exists.");

    await updateExhibition(slug, { ...exhibition, [slot]: null });
    revalidateExhibition(slug);
    return ok("Image removed");
  } catch (error) {
    return failWith("Could not remove this image. Try again.", error);
  }
};

export const deleteExhibitionAction = async (
  slug: string,
): Promise<ActionResult<string>> => {
  const access = await requireExhibitionAccess();
  if (access.error) return access;

  try {
    const deleted = await deleteExhibition(slug);
    if (!deleted) return fail("That exhibition no longer exists.");

    revalidateExhibition(slug);
    return ok("Exhibition deleted");
  } catch (error) {
    return failWith("Could not delete this exhibition. Try again.", error);
  }
};
