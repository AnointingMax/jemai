"use server";

import { revalidatePath } from "next/cache";
import * as Yup from "yup";

import { fail, failWith, ok, validate, type ActionResult } from "@/lib/action-result";
import { budgets, projectTypes } from "@/lib/admin/consultation-record";
import { createConsultation } from "@/lib/admin/consultations";

const consultationPayload = () =>
  Yup.object({
    name: Yup.string().trim().required("Enter your full name."),
    email: Yup
      .string()
      .trim()
      .email("Enter a valid email address.")
      .required("Enter your email address."),
    phone: Yup.string().trim().default(""),
    projectType: Yup
      .string()
      .trim()
      .oneOf(projectTypes, "Pick a project type from the list.")
      .required("Pick a project type from the list."),
    // `yyyy-mm-dd` as the native date field hands it back, or nothing at all.
    startDate: Yup
      .string()
      .trim()
      .matches(/^\d{4}-\d{2}-\d{2}$/, { excludeEmptyString: true, message: "Pick a start date from the calendar." })
      .default(""),
    endDate: Yup
      .string()
      .trim()
      .matches(/^\d{4}-\d{2}-\d{2}$/, { excludeEmptyString: true, message: "Pick an end date from the calendar." })
      .default(""),
    budget: Yup
      .string()
      .trim()
      .oneOf(["", ...budgets], "Pick a budget range from the list.")
      .default(""),
    summary: Yup.string().trim().required("Tell us about the project."),
  });

/** Files a brief off the storefront inquiry form. It reaches the console `New`. */
export const requestConsultationAction = async (
  values: unknown,
): Promise<ActionResult<string>> => {
  const parsed = await validate(consultationPayload(), values);
  if (parsed.error) return parsed;

  // Both ends are `yyyy-mm-dd`, so comparing them as strings compares the days.
  const { startDate, endDate } = parsed.data;
  if (startDate && endDate && endDate < startDate)
    return fail("The end date cannot come before the start date.");

  try {
    await createConsultation(parsed.data);

    revalidatePath("/admin/consultation-requests");
    revalidatePath("/admin");

    return ok(
      "Thank you — we’ll be in touch to arrange your first conversation.",
    );
  } catch (error) {
    return failWith("Could not send your request just now. Try again.", error);
  }
};
