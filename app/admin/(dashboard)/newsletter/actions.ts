"use server";

import * as Yup from "yup";

import { failWith, fail, ok, validate, type ActionResult } from "@/lib/action-result";
import { hasPermission } from "@/lib/admin/auth/permissions";
import { readAdminSession } from "@/lib/admin/auth/session";
import { csvExport, type CsvExport } from "@/lib/admin/csv";
import { listSubscribers } from "@/lib/admin/newsletter";

const exportPayload = () =>
  Yup.object({
    search: Yup.string().trim().default(""),
  });

/**
 * The subscriber list as a spreadsheet, under whatever the screen is searched
 * for — the whole list when it is not.
 *
 * The rows are fetched here rather than sent up from the page: the export is
 * the database's answer to the same query the index ran, which is what the
 * mailing tool on the other end is entitled to expect.
 */
export const exportSubscribersAction = async (
  values: unknown,
): Promise<ActionResult<CsvExport>> => {
  const session = await readAdminSession();
  if (!session) return fail("Your session has expired. Sign in again.");
  if (!hasPermission(session.permissions, "newsletter"))
    return fail("You do not have access to the subscriber list.");

  const parsed = await validate(exportPayload(), values);
  if (parsed.error) return parsed;

  try {
    const subscribers = await listSubscribers(parsed.data.search);

    return ok(
      csvExport(
        "jemai-newsletter-subscribers",
        ["Email address", "Name", "Source", "Subscribed"],
        subscribers.map((subscriber) => [
          subscriber.email,
          subscriber.name,
          subscriber.source,
          subscriber.subscribedAt,
        ]),
      ),
    );
  } catch (error) {
    return failWith("Could not build that export. Try again.", error);
  }
};
