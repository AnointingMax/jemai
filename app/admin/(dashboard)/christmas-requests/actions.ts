"use server";

import { revalidatePath } from "next/cache";
import * as Yup from "yup";

import { failWith, fail, ok, validate, type ActionResult } from "@/lib/action-result";
import { hasPermission } from "@/lib/admin/auth/permissions";
import { readActiveAdmin } from "@/lib/admin/auth/session";
import { areaSummary, submittedOn } from "@/lib/admin/christmas-record";
import { listChristmasRequests, setChristmasStatus } from "@/lib/admin/christmas";
import { csvExport, type CsvExport } from "@/lib/admin/csv";
import { christmasStatuses, type ChristmasStatus } from "@/lib/christmas";

const statusPayload = () =>
  Yup.object({
    id: Yup.string().trim().required("Pick a Christmas request."),
    status: Yup
      .string()
      .trim()
      .oneOf(christmasStatuses, "Pick a status from the list.")
      .required("Pick a status from the list."),
  });

/**
 * The queue's one write — and the only thing that spends a slot.
 *
 * Payment is taken outside the system, so `Paid` is an administrator's record
 * that it happened rather than anything this application can observe. Moving a
 * request in or out of it changes what the storefront has left to sell, which
 * is why the campaign page is revalidated alongside the console.
 */
export const updateChristmasStatusAction = async (
  values: unknown,
): Promise<ActionResult<string>> => {
  const session = await readActiveAdmin();
  if (!session) return fail("Your session has expired. Sign in again.");
  if (!hasPermission(session.permissions, "christmas-requests"))
    return fail("You do not have access to Christmas requests.");

  const parsed = await validate(statusPayload(), values);
  if (parsed.error) return parsed;

  try {
    const updated = await setChristmasStatus(
      parsed.data.id,
      parsed.data.status as ChristmasStatus,
    );
    if (!updated) return fail("That Christmas request no longer exists.");

    revalidatePath("/admin/christmas-requests");
    revalidatePath("/admin");
    revalidatePath("/christmas-styling");

    return ok(`Request moved to ${parsed.data.status}`);
  } catch (error) {
    return failWith("Could not update this request. Try again.", error);
  }
};

const exportPayload = () =>
  Yup.object({
    search: Yup.string().trim().default(""),
    // A four-digit year as the filter puts it in the URL, or nothing at all.
    year: Yup
      .string()
      .trim()
      .matches(/^\d{4}$/, { excludeEmptyString: true, message: "Pick a year from the list." })
      .default(""),
    status: Yup.string().trim().oneOf(["", ...christmasStatuses]).default(""),
  });

/**
 * The Christmas queue as a spreadsheet, under whatever the screen is filtered
 * to.
 *
 * The rows are read here rather than sent up from the page: the export is the
 * database's answer to the same query the index ran, so it carries every
 * matching request and not only the ones a page had already loaded.
 */
export const exportChristmasRequestsAction = async (
  values: unknown,
): Promise<ActionResult<CsvExport>> => {
  const session = await readActiveAdmin();
  if (!session) return fail("Your session has expired. Sign in again.");
  if (!hasPermission(session.permissions, "christmas-requests"))
    return fail("You do not have access to Christmas requests.");

  const parsed = await validate(exportPayload(), values);
  if (parsed.error) return parsed;

  try {
    const { search, year, status } = parsed.data;
    const rows = await listChristmasRequests({
      search,
      year: year ? Number(year) : undefined,
      status: (status || undefined) as ChristmasStatus | undefined,
    });

    if (rows.length === 0) return fail("There is nothing to export under these filters.");

    return ok(
      csvExport(
        year ? `jemai-christmas-requests-${year}` : "jemai-christmas-requests",
        [
          "Request",
          "Year",
          "Customer",
          "Email",
          "Phone",
          "Property type",
          "Decoration areas",
          "Status",
          "Submitted",
        ],
        rows.map((request) => [
          request.reference,
          String(request.year),
          request.name,
          request.email,
          request.phone,
          request.propertyType,
          areaSummary(request),
          request.status,
          submittedOn(request),
        ]),
      ),
    );
  } catch (error) {
    return failWith("Could not build that export. Try again.", error);
  }
};
