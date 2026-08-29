"use server";

import { revalidatePath } from "next/cache";
import * as Yup from "yup";

import { failWith, ok, validate, type ActionResult } from "@/lib/action-result";
import { subscribe, subscriberSources, type SubscriberSource } from "@/lib/admin/newsletter";

const subscribePayload = () =>
  Yup.object({
    email: Yup
      .string()
      .trim()
      .email("Enter a valid email address.")
      .required("Enter your email address."),
    // A footer sign-up only asks for an address, so the name stays optional.
    name: Yup.string().trim().default(""),
    source: Yup
      .string()
      .trim()
      .default("Footer form")
      .oneOf(subscriberSources, "Unknown sign-up source."),
  });

/**
 * The storefront's one sign-up. Open to anyone — it is a public form — so it
 * hands back the same line whether the address was new or already on the list:
 * a visitor should not be able to probe who has subscribed.
 */
export const subscribeToNewsletterAction = async (
  values: unknown,
): Promise<ActionResult<string>> => {
  const parsed = await validate(subscribePayload(), values);
  if (parsed.error) return parsed;

  try {
    await subscribe({
      email: parsed.data.email,
      name: parsed.data.name,
      source: parsed.data.source as SubscriberSource,
    });

    revalidatePath("/admin/newsletter");
    return ok("You're on the list. Look out for the next dispatch.");
  } catch (error) {
    return failWith("Could not sign you up just now. Try again.", error);
  }
};
