"use server";

import { revalidatePath } from "next/cache";
import * as Yup from "yup";

import { failWith, fail, ok, validate, type ActionResult } from "@/lib/action-result";
import { readAdminSession } from "@/lib/admin/auth/session";
import { hasPermission } from "@/lib/admin/auth/permissions";
import { csvExport, type CsvExport } from "@/lib/admin/csv";
import { listEnquiries } from "@/lib/admin/enquiries";
import { setEnquiryStatus } from "@/lib/admin/enquiries";
import {
  describeArtwork,
  enquiredOn,
  enquiryStatuses,
  type EnquiryStatus,
} from "@/lib/admin/enquiry-record";

const statusPayload = () =>
  Yup.object({
    id: Yup.string().trim().required("Pick an enquiry."),
    status: Yup
      .string()
      .trim()
      .oneOf(enquiryStatuses, "Pick a status from the list.")
      .required("Pick a status from the list."),
  });

/** The follow-up queue's one write: moving an enquiry between its three states. */
export const updateEnquiryStatusAction = async (
  values: unknown,
): Promise<ActionResult<string>> => {
  const session = await readAdminSession();
  if (!session) return fail("Your session has expired. Sign in again.");
  if (!hasPermission(session.permissions, "artwork-enquiries"))
    return fail("You do not have access to artwork enquiries.");

  const parsed = await validate(statusPayload(), values);
  if (parsed.error) return parsed;

  try {
    const updated = await setEnquiryStatus(parsed.data.id, parsed.data.status as EnquiryStatus);
    if (!updated) return fail("That enquiry no longer exists.");

    revalidatePath("/admin/artwork-enquiries");
    revalidatePath("/admin");

    return ok(`Enquiry moved to ${parsed.data.status}`);
  } catch (error) {
    return failWith("Could not update this enquiry. Try again.", error);
  }
};

const exportPayload = () =>
  Yup.object({
    search: Yup.string().trim().default(""),
    status: Yup.string().trim().oneOf(["", ...enquiryStatuses]).default(""),
  });

/**
 * The queue as a spreadsheet, under whatever the screen is filtered to.
 *
 * The rows are fetched here rather than sent up from the page: the export is
 * the database's answer to the same query the index ran, so it carries every
 * matching enquiry and not just the ones a page had already loaded.
 */
export const exportEnquiriesAction = async (
  values: unknown,
): Promise<ActionResult<CsvExport>> => {
  const session = await readAdminSession();
  if (!session) return fail("Your session has expired. Sign in again.");
  if (!hasPermission(session.permissions, "artwork-enquiries"))
    return fail("You do not have access to artwork enquiries.");

  const parsed = await validate(exportPayload(), values);
  if (parsed.error) return parsed;

  try {
    const enquiries = await listEnquiries({
      search: parsed.data.search,
      status: (parsed.data.status || undefined) as EnquiryStatus | undefined,
    });

    return ok(
      csvExport(
        "jemai-artwork-enquiries",
        ["Enquiry", "Name", "Email", "Phone", "Artwork", "Received", "Status", "Message"],
        enquiries.map((enquiry) => [
          enquiry.reference,
          enquiry.name,
          enquiry.email,
          enquiry.phone,
          describeArtwork(enquiry),
          enquiredOn(enquiry),
          enquiry.status,
          enquiry.message,
        ]),
      ),
    );
  } catch (error) {
    return failWith("Could not build that export. Try again.", error);
  }
};
