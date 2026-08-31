"use server";

import { revalidatePath } from "next/cache";
import * as Yup from "yup";

import { failWith, ok, validate, type ActionResult } from "@/lib/action-result";
import { subscribe, subscriberSources, type SubscriberSource } from "@/lib/admin/newsletter";
import { sendSubscriptionWelcome } from "@/lib/mail/messages";

const subscribePayload = () =>
  Yup.object({
    email: Yup
      .string()
      .trim()
      .email("Enter a valid email address.")
      .required("Enter your email address."),
    name: Yup.string().trim().default(""),
    source: Yup
      .string()
      .trim()
      .default("Footer form")
      .oneOf(subscriberSources, "Unknown sign-up source."),
  });

export const subscribeToNewsletterAction = async (
  values: unknown,
): Promise<ActionResult<string>> => {
  const parsed = await validate(subscribePayload(), values);
  if (parsed.error) return parsed;

  try {
    const { subscriber, isNew } = await subscribe({
      email: parsed.data.email,
      name: parsed.data.name,
      source: parsed.data.source as SubscriberSource,
    });

    if (isNew) await sendSubscriptionWelcome(subscriber);

    revalidatePath("/admin/newsletter");
    return ok("You're on the list. Look out for the next dispatch.");
  } catch (error) {
    return failWith("Could not sign you up just now. Try again.", error);
  }
};
