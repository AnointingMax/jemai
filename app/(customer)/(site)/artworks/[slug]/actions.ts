"use server";

import { revalidatePath } from "next/cache";
import * as Yup from "yup";

import { failWith, fail, ok, validate, type ActionResult } from "@/lib/action-result";
import { getArtwork } from "@/lib/admin/artworks";
import { createEnquiry } from "@/lib/admin/enquiries";

const enquiryPayload = () =>
  Yup.object({
    name: Yup.string().trim().required("Enter your full name."),
    email: Yup
      .string()
      .trim()
      .email("Enter a valid email address.")
      .required("Enter your email address."),
    phone: Yup.string().trim().required("Enter a phone number we can reach you on."),
    message: Yup.string().trim().required("Tell us what you would like to know."),
  });

export const sendArtworkEnquiryAction = async (
  slug: string,
  values: unknown,
): Promise<ActionResult<string>> => {
  const parsed = await validate(enquiryPayload(), values);
  if (parsed.error) return parsed;

  try {
    const artwork = await getArtwork(slug);
    if (!artwork) return fail("That artwork is no longer available.");

    await createEnquiry({
      artworkId: artwork.id,
      artworkTitle: artwork.title,
      artist: artwork.artist,
      ...parsed.data,
    });

    revalidatePath("/admin/artwork-enquiries");
    revalidatePath("/admin");

    return ok("Thank you — your enquiry is with the JEMAI art team. We will be in touch shortly.");
  } catch (error) {
    return failWith("Could not send your enquiry just now. Try again.", error);
  }
};
