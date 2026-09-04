"use server";

import { revalidatePath } from "next/cache";
import * as Yup from "yup";

import { failWith, ok, validate, fail, type ActionResult } from "@/lib/action-result";
import { hasPermission } from "@/lib/admin/auth/permissions";
import { readActiveAdmin } from "@/lib/admin/auth/session";
import {
  createTerm,
  deleteTerm,
  isTaxonomyRefusal,
  moveTerm,
  renameTerm,
  taxonomyMeta,
  type TaxonomyRefusal,
} from "@/lib/admin/taxonomy";
import type { TaxonomyKind } from "@/lib/taxonomy";

/**
 * The console's own layout already turns an unprivileged visitor away, but a
 * server action is its own entry point — a signed-out caller can post to one
 * directly, so each write checks for itself. The two vocabularies are gated
 * separately: whoever may edit the furniture catalogue may name its categories,
 * and the gallery's mediums go with the artworks section.
 */
const requireTaxonomyAccess = async (kind: TaxonomyKind): Promise<ActionResult<string>> => {
  const session = await readActiveAdmin();
  if (!session) return fail("Your session has expired. Sign in again.");

  const { permission } = taxonomyMeta[kind];
  if (!hasPermission(session.permissions, permission))
    return fail(
      permission === "furniture"
        ? "You do not have access to the furniture catalogue."
        : "You do not have access to the gallery catalogue.",
    );

  return ok(session.id);
};

/** The store's refusals, in the words the person at the keyboard needs. */
const explain = (kind: TaxonomyKind, refusal: TaxonomyRefusal) => {
  const { noun, filed } = taxonomyMeta[kind];
  if (refusal === "duplicate") return `That ${noun} already exists.`;
  if (refusal === "missing") return `That ${noun} no longer exists.`;
  return `Move its ${filed}s to another ${noun} before deleting it.`;
};

/**
 * A vocabulary change is felt everywhere at once: the catalogue index and its
 * filter, both storefront grids, and the header menus that every page of the
 * site draws. That last one is why this revalidates the whole tree rather than
 * naming paths — the menus hang off the storefront layout, not off a page.
 */
const revalidateTaxonomy = () => revalidatePath("/", "layout");

export const createTermAction = async (
  kind: TaxonomyKind,
  values: unknown,
): Promise<ActionResult<string>> => {
  const access = await requireTaxonomyAccess(kind);
  if (access.error) return access;

  const parsed = await validate(
    Yup.object({
      name: Yup
        .string()
        .trim()
        .required(`A ${taxonomyMeta[kind].noun} name is required.`)
        .max(60, "Keep it under 60 characters — it has to fit the storefront menu."),
    }),
    values,
  );
  if (parsed.error) return parsed;

  try {
    const created = await createTerm(kind, parsed.data.name);
    if (isTaxonomyRefusal(created)) return fail(explain(kind, created));

    revalidateTaxonomy();
    return ok(`${created.name} added`);
  } catch (error) {
    return failWith(`Could not add this ${taxonomyMeta[kind].noun}. Try again.`, error);
  }
};

/** Renames the term and every catalogue record filed under it. */
export const renameTermAction = async (
  kind: TaxonomyKind,
  values: unknown,
): Promise<ActionResult<string>> => {
  const access = await requireTaxonomyAccess(kind);
  if (access.error) return access;

  const parsed = await validate(
    Yup.object({
      id: Yup.string().trim().required("Pick a term to rename."),
      name: Yup
        .string()
        .trim()
        .required(`A ${taxonomyMeta[kind].noun} name is required.`)
        .max(60, "Keep it under 60 characters — it has to fit the storefront menu."),
    }),
    values,
  );
  if (parsed.error) return parsed;

  try {
    const renamed = await renameTerm(kind, parsed.data.id, parsed.data.name);
    if (isTaxonomyRefusal(renamed)) return fail(explain(kind, renamed));

    revalidateTaxonomy();
    return ok(`Renamed to ${renamed.name}`);
  } catch (error) {
    return failWith(`Could not rename this ${taxonomyMeta[kind].noun}. Try again.`, error);
  }
};

export const deleteTermAction = async (
  kind: TaxonomyKind,
  values: unknown,
): Promise<ActionResult<string>> => {
  const access = await requireTaxonomyAccess(kind);
  if (access.error) return access;

  const parsed = await validate(
    Yup.object({ id: Yup.string().trim().required("Pick a term to delete.") }),
    values,
  );
  if (parsed.error) return parsed;

  try {
    const deleted = await deleteTerm(kind, parsed.data.id);
    if (isTaxonomyRefusal(deleted)) return fail(explain(kind, deleted));

    revalidateTaxonomy();
    return ok(`${deleted.name} deleted`);
  } catch (error) {
    return failWith(`Could not delete this ${taxonomyMeta[kind].noun}. Try again.`, error);
  }
};

/** Reorders the list — which is the order the storefront menu draws it in. */
export const moveTermAction = async (
  kind: TaxonomyKind,
  values: unknown,
): Promise<ActionResult<string>> => {
  const access = await requireTaxonomyAccess(kind);
  if (access.error) return access;

  const parsed = await validate(
    Yup.object({
      id: Yup.string().trim().required("Pick a term to move."),
      direction: Yup
        .string()
        .oneOf(["up", "down"] as const)
        .required("Say which way to move it."),
    }),
    values,
  );
  if (parsed.error) return parsed;

  try {
    const moved = await moveTerm(kind, parsed.data.id, parsed.data.direction);
    if (isTaxonomyRefusal(moved)) return fail(explain(kind, moved));

    revalidateTaxonomy();
    return ok(`${moved.name} moved ${parsed.data.direction}`);
  } catch (error) {
    return failWith("Could not reorder the list. Try again.", error);
  }
};
