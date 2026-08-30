"use server";

import { revalidatePath } from "next/cache";
import * as Yup from "yup";

import { failWith, fail, ok, validate, type ActionResult } from "@/lib/action-result";
import { hasPermission } from "@/lib/admin/auth/permissions";
import { readAdminSession } from "@/lib/admin/auth/session";
import {
  consultationStatuses,
  consultationWindow,
  requestedOn,
  type ConsultationStatus,
} from "@/lib/admin/consultation-record";
import { listConsultations, setConsultationStatus } from "@/lib/admin/consultations";
import { csvExport, type CsvExport } from "@/lib/admin/csv";

const statusPayload = () =>
  Yup.object({
    id: Yup.string().trim().required("Pick a consultation request."),
    status: Yup
      .string()
      .trim()
      .oneOf(consultationStatuses, "Pick a status from the list.")
      .required("Pick a status from the list."),
  });

/** The brief queue's one write: moving a request through triage. */
export const updateConsultationStatusAction = async (
  values: unknown,
): Promise<ActionResult<string>> => {
  const session = await readAdminSession();
  if (!session) return fail("Your session has expired. Sign in again.");
  if (!hasPermission(session.permissions, "consultation-requests"))
    return fail("You do not have access to consultation requests.");

  const parsed = await validate(statusPayload(), values);
  if (parsed.error) return parsed;

  try {
    const updated = await setConsultationStatus(
      parsed.data.id,
      parsed.data.status as ConsultationStatus,
    );
    if (!updated) return fail("That consultation request no longer exists.");

    revalidatePath("/admin/consultation-requests");
    revalidatePath("/admin");

    return ok(`Request moved to ${parsed.data.status}`);
  } catch (error) {
    return failWith("Could not update this request. Try again.", error);
  }
};

const exportPayload = () =>
  Yup.object({
    search: Yup.string().trim().default(""),
    status: Yup.string().trim().oneOf(["", ...consultationStatuses]).default(""),
  });

/**
 * The brief queue as a spreadsheet, under whatever the screen is filtered to.
 *
 * The rows are read here rather than sent up from the page: the export is the
 * database's answer to the same query the index ran, so it carries every
 * matching brief and not just the ones a page had already loaded.
 */
export const exportConsultationsAction = async (
  values: unknown,
): Promise<ActionResult<CsvExport>> => {
  const session = await readAdminSession();
  if (!session) return fail("Your session has expired. Sign in again.");
  if (!hasPermission(session.permissions, "consultation-requests"))
    return fail("You do not have access to consultation requests.");

  const parsed = await validate(exportPayload(), values);
  if (parsed.error) return parsed;

  try {
    const requests = await listConsultations({
      search: parsed.data.search,
      status: (parsed.data.status || undefined) as ConsultationStatus | undefined,
    });

    return ok(
      csvExport(
        "jemai-consultation-requests",
        [
          "Request",
          "Name",
          "Email",
          "Phone",
          "Project type",
          "Timeline",
          "Budget",
          "Received",
          "Status",
          "Summary",
        ],
        requests.map((request) => [
          request.reference,
          request.name,
          request.email,
          request.phone,
          request.projectType,
          consultationWindow(request),
          request.budget,
          requestedOn(request),
          request.status,
          request.summary,
        ]),
      ),
    );
  } catch (error) {
    return failWith("Could not build that export. Try again.", error);
  }
};
