"use server";

import { revalidatePath } from "next/cache";
import * as Yup from "yup";

import { failWith, fail, ok, validate, type ActionResult } from "@/lib/action-result";
import { readAdminSession } from "@/lib/admin/auth/session";
import { hasPermission } from "@/lib/admin/auth/permissions";
import { setEnquiryStatus } from "@/lib/admin/enquiries";
import { enquiryStatuses, type EnquiryStatus } from "@/lib/admin/enquiry-record";

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
