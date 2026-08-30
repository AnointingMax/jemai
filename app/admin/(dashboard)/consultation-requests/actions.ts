"use server";

import * as Yup from "yup";

import { failWith, fail, ok, validate, type ActionResult } from "@/lib/action-result";
import { hasPermission } from "@/lib/admin/auth/permissions";
import { readAdminSession } from "@/lib/admin/auth/session";
import {
  consultationStatuses,
  consultationWindow,
  listConsultations,
  requestedOn,
  type ConsultationStatus,
} from "@/lib/admin/consultations";
import { csvExport, type CsvExport } from "@/lib/admin/csv";

const exportPayload = () =>
  Yup.object({
    search: Yup.string().trim().default(""),
    status: Yup.string().trim().oneOf(["", ...consultationStatuses]).default(""),
  });

/**
 * The brief queue as a spreadsheet, under whatever the screen is filtered to.
 *
 * The records are read here rather than sent up from the page — this store is
 * still fixtures rather than rows, but the export asks it the same question the
 * index asked, so the two cannot disagree when it becomes a table.
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
    const requests = listConsultations({
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
          request.id,
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
