"use server";

import { revalidatePath } from "next/cache";
import * as Yup from "yup";

import { failWith, fail, ok, validate, type ActionResult } from "@/lib/action-result";
import { getExhibition, isArchived } from "@/lib/admin/exhibitions";
import { createRegistration, settleRegistration } from "@/lib/admin/registrations";
import env from "@/lib/env";
import { notifyDeskOfRegistration, sendRegistrationConfirmed } from "@/lib/mail/messages";
import { initializePayment, paymentReference } from "@/lib/paystack";

const registrationPayload = () =>
  Yup.object({
    fullName: Yup.string().trim().required("Enter your full name."),
    email: Yup
      .string()
      .trim()
      .email("Enter a valid email address.")
      .required("Enter your email address."),
    phone: Yup.string().trim().required("Enter a phone number we can reach you on."),
  });

export type RegistrationStarted = {
  reference: string;
  message: string;
  authorizationUrl?: string;
};

export const registerForExhibitionAction = async (
  slug: string,
  values: unknown,
): Promise<ActionResult<RegistrationStarted>> => {
  const parsed = await validate(registrationPayload(), values);
  if (parsed.error) return parsed;

  const { fullName, email, phone } = parsed.data;

  try {
    const exhibition = await getExhibition(slug);
    if (!exhibition) return fail("That exhibition is no longer open for registration.");
    // A show that is on right now still takes registrations; only one that has
    // ended does not.
    if (isArchived(exhibition.status))
      return fail("That exhibition has already run.");

    const paid = exhibition.admission.paid && exhibition.admission.price > 0;
    const reference = paymentReference("JEM-EXH");

    const registration = await createRegistration({
      reference,
      exhibitionId: exhibition.id,
      exhibitionTitle: exhibition.name,
      name: fullName,
      email,
      phone,
      amount: paid ? exhibition.admission.price : 0,
      status: paid ? "Pending payment" : "Confirmed",
    });

    revalidatePath("/admin");

    // A free place is confirmed on arrival, so its mail goes out here. A paid
    // one is only a place once Paystack says so, and `settleRegistration` sends
    // it on the move into Confirmed — whichever of the webhook or the attendee's
    // own return gets there first.
    if (!paid) {
      await sendRegistrationConfirmed(registration);
      await notifyDeskOfRegistration(registration);

      return ok({
        reference,
        message:
          "Thank you — your place is reserved. A confirmation is on its way to your inbox.",
      });
    }

    const { authorizationUrl } = await initializePayment({
      email,
      amount: exhibition.admission.price,
      reference,
      callbackUrl: `${env.APP_URL}/exhibitions/${exhibition.slug}`,
      metadata: { exhibition: exhibition.slug, name: fullName, phone },
    });

    return ok({
      reference,
      authorizationUrl,
      message: "Thank you — we are handing you to Paystack to complete the payment.",
    });
  } catch (error) {
    return failWith("Could not register you just now. Try again.", error);
  }
};

export const confirmRegistrationAction = async (
  reference: string,
): Promise<ActionResult<{ status: string; message: string; }>> => {
  if (!reference.trim()) return fail("That payment reference is missing.");

  try {
    const registration = await settleRegistration(reference);
    if (!registration) return fail("We have no registration under that reference.");

    revalidatePath("/admin");

    if (registration.status === "Confirmed")
      return ok({
        status: registration.status,
        message: `Payment received — your place at ${registration.exhibitionTitle} is confirmed.`,
      });

    if (registration.status === "Pending payment")
      return ok({
        status: registration.status,
        message: "Your payment is still processing. We will email you once it clears.",
      });

    return ok({
      status: registration.status,
      message: "That payment did not go through, so no place was reserved. You can try again.",
    });
  } catch (error) {
    return failWith("Could not confirm that payment just now. Try again.", error);
  }
};
