"use server";

import { revalidatePath } from "next/cache";
import * as Yup from "yup";

import { failWith, fail, ok, validate, type ActionResult } from "@/lib/action-result";
import {
  christmasSlotsLeft,
  createChristmasRequest,
  currentChristmasYear,
  hasChristmasRequest,
} from "@/lib/admin/christmas";
import { decorationAreas, propertyTypes } from "@/lib/christmas";
import {
  notifyDeskOfChristmasRequest,
  sendChristmasRequestReceived,
} from "@/lib/mail/messages";

/** Which panel the storefront should open on. */
export type ChristmasOutcome = "received" | "duplicate";

const areaNames = decorationAreas.map((area) => area.name);
const countedAreas = decorationAreas.filter((area) => area.counted).map((area) => area.name);

const requestPayload = () =>
  Yup.object({
    name: Yup.string().trim().required("Enter your full name."),
    email: Yup
      .string()
      .trim()
      .lowercase()
      .email("Enter a valid email address.")
      .required("Enter your email address."),
    phone: Yup.string().trim().required("Enter a phone number we can reach you on."),
    propertyType: Yup
      .string()
      .trim()
      .oneOf(propertyTypes, "Pick a property type from the list.")
      .required("Pick a property type from the list."),
    areas: Yup
      .array()
      .of(
        Yup.object({
          area: Yup
            .string()
            .trim()
            .oneOf(areaNames, "Pick your spaces from the list.")
            .required("Pick your spaces from the list."),
          // A compound is not counted, so its quantity is pinned to one below.
          quantity: Yup
            .number()
            .integer()
            .min(1, "A room count cannot be less than one.")
            .max(20, "Please contact us directly for more than twenty rooms.")
            .required(),
        }).required(),
      )
      .min(1, "Choose at least one space to decorate.")
      .required("Choose at least one space to decorate."),
  });

/**
 * Files a Christmas consultation request off the storefront form.
 *
 * Three things can stop it, and only one of them is an error the reader should
 * see as a failure:
 *
 * - **The season is full.** Slots are spent by *paid* requests, so this is not
 *   about how many people have asked — it is about how many have been booked.
 * - **This address already asked.** One request per person per campaign, which
 *   is a panel rather than an error: they have done nothing wrong, and the
 *   answer is that we already have them.
 * - The unique index catching the same thing under a race, which lands in the
 *   same panel.
 *
 * Nothing is charged here. The request arrives `New` and an administrator marks
 * it `Paid` once payment has been arranged outside the system — that is what
 * takes the slot.
 */
export const requestChristmasConsultationAction = async (
  values: unknown,
): Promise<ActionResult<ChristmasOutcome>> => {
  const parsed = await validate(requestPayload(), values);
  if (parsed.error) return parsed;

  const year = currentChristmasYear();
  const { name, email, phone, propertyType, areas } = parsed.data;

  // An area that is not room-based has no count to give, whatever was posted.
  const requested = areas.map(({ area, quantity }) => ({
    area,
    quantity: countedAreas.includes(area) ? quantity : 1,
  }));

  try {
    if ((await christmasSlotsLeft(year)) === 0)
      return fail(`The Christmas ${year} consultation list is now full.`);

    if (await hasChristmasRequest(year, email)) return ok("duplicate");

    const request = await createChristmasRequest({
      year,
      name,
      email,
      phone,
      propertyType,
      areas: requested,
    });

    // The request is filed either way; these are the copy that goes back to
    // whoever wrote it, and the notice to the desk that prices it.
    await sendChristmasRequestReceived(request);
    await notifyDeskOfChristmasRequest(request);

    revalidatePath("/admin/christmas-requests");
    revalidatePath("/admin");

    return ok("received");
  } catch (error) {
    // The unique index is the real guard against two submissions racing; the
    // check above is what makes the common case a panel rather than a 500.
    if (isDuplicateEmail(error)) return ok("duplicate");
    return failWith("Could not send your request just now. Try again.", error);
  }
};

/** Prisma's unique-constraint failure, without importing its error class. */
const isDuplicateEmail = (error: unknown) =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  (error as { code?: string }).code === "P2002";
