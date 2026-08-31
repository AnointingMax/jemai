"use server";

import * as Yup from "yup";

import { failWith, ok, validate, type ActionResult } from "@/lib/action-result";
import { inquiryTypes } from "@/lib/contact";
import { deliverContactMessage, sendContactReceived } from "@/lib/mail/messages";

const contactPayload = () =>
  Yup.object({
    firstName: Yup.string().trim().required("Enter your first name."),
    lastName: Yup.string().trim().required("Enter your last name."),
    email: Yup
      .string()
      .trim()
      .email("Enter a valid email address.")
      .required("Enter your email address."),
    phone: Yup.string().trim().default(""),
    company: Yup.string().trim().default(""),
    inquiryType: Yup
      .string()
      .trim()
      .oneOf(inquiryTypes, "Pick an inquiry type from the list.")
      .required("Pick an inquiry type from the list."),
    message: Yup.string().trim().required("Write your message."),
  });

export const sendContactMessageAction = async (
  values: unknown,
): Promise<ActionResult<string>> => {
  const parsed = await validate(contactPayload(), values);
  if (parsed.error) return parsed;

  const { firstName, lastName, ...rest } = parsed.data;
  const enquiry = { ...rest, name: `${firstName} ${lastName}`.trim() };

  try {
    await deliverContactMessage(enquiry);
  } catch (error) {
    return failWith("Could not send your message just now. Try again.", error);
  }

  await sendContactReceived(enquiry);

  return ok("Thank you — your message is on its way. We reply within two working days.");
};
