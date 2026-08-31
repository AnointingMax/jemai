"use server";

import * as Yup from "yup";

import { failWith, fail, ok, validate, type ActionResult } from "@/lib/action-result";
import { hasPermission } from "@/lib/admin/auth/permissions";
import { readActiveAdmin } from "@/lib/admin/auth/session";
import { formatUpdatedAt, naira } from "@/lib/admin/content";
import { csvExport, type CsvExport } from "@/lib/admin/csv";
import { getExhibition } from "@/lib/admin/exhibitions";
import { registrationStatuses, type RegistrationStatus } from "@/lib/admin/registration-record";
import { listRegistrationsForExhibition } from "@/lib/admin/registrations";

const exportPayload = () =>
  Yup.object({
    slug: Yup.string().trim().required("Pick an exhibition."),
    search: Yup.string().trim().default(""),
    payment: Yup.string().trim().oneOf(["", ...registrationStatuses]).default(""),
  });

/**
 * The door list: one exhibition's attendees as a spreadsheet, under whatever
 * the screen is filtered to.
 *
 * The rows are fetched here rather than sent up from the page, so the file is
 * every registration the filters match — not the ten on the page in front of
 * the reader, and not a set that has drifted since the screen was loaded.
 */
export const exportAttendeesAction = async (
  values: unknown,
): Promise<ActionResult<CsvExport>> => {
  const session = await readActiveAdmin();
  if (!session) return fail("Your session has expired. Sign in again.");
  if (!hasPermission(session.permissions, "exhibitions"))
    return fail("You do not have access to the exhibition programme.");

  const parsed = await validate(exportPayload(), values);
  if (parsed.error) return parsed;

  const { slug, search, payment } = parsed.data;

  try {
    const exhibition = await getExhibition(slug);
    if (!exhibition) return fail("That exhibition no longer exists.");

    const registrations = await listRegistrationsForExhibition(exhibition.id, {
      search,
      status: (payment || undefined) as RegistrationStatus | undefined,
    });

    // A narrowed export says so in its name, so two of them do not collide in a
    // downloads folder.
    const name = payment
      ? `jemai-${exhibition.slug}-attendees-${payment.toLowerCase().replace(/\s+/g, "-")}`
      : `jemai-${exhibition.slug}-attendees`;

    return ok(
      csvExport(
        name,
        ["Reference", "Name", "Email", "Phone", "Paid", "Status", "Registered"],
        registrations.map((registration) => [
          registration.reference,
          registration.name,
          registration.email,
          registration.phone,
          // What was actually settled, not what was quoted.
          registration.amountPaid ? naira(registration.amountPaid) : "Free",
          registration.status,
          formatUpdatedAt(registration.registeredAt),
        ]),
      ),
    );
  } catch (error) {
    return failWith("Could not build that export. Try again.", error);
  }
};
