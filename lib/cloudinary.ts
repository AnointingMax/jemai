import { v2 as cloudinary } from "cloudinary";
import * as Yup from "yup";

import { ALLOWED_IMAGE_FORMATS, CLOUDINARY_FOLDER } from "@/lib/constants";
import env from "@/lib/env";

const CONNECTION = /^cloudinary:\/\/([^:@/]+):([^:@/]+)@([^:@/]+)$/;

const connection = () => {
  const parts = env.CLOUDINARY_URL ? CONNECTION.exec(env.CLOUDINARY_URL) : null;
  if (!parts) return null;

  const [, apiKey, apiSecret, cloudName] = parts;
  return { apiKey, apiSecret, cloudName };
};

export const cloudinaryConfigured = () => connection() !== null;

/** The cloud uploads live on, or null when none is configured. */
export const cloudinaryCloudName = () => connection()?.cloudName ?? null;

const credentials = () => {
  const parsed = connection();
  if (!parsed)
    throw new Error("Cloudinary is not configured — set CLOUDINARY_URL");

  return parsed;
};

/** Points the SDK at this account. Idempotent, so every upload may call it. */
const configure = () => {
  const { cloudName, apiKey, apiSecret } = credentials();
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
};

export const uploadImage = async (file: File) => {
  configure();

  const bytes = Buffer.from(await file.arrayBuffer());

  return new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: CLOUDINARY_FOLDER,
        allowed_formats: ALLOWED_IMAGE_FORMATS.split(","),
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result?.secure_url)
          return reject(new Error("Cloudinary returned no URL for the upload"));
        resolve(result.secure_url);
      },
    );

    stream.end(bytes);
  });
};


export const isAllowedImageSource = (src: string) => {
  if (src.startsWith("/")) return !src.startsWith("//");

  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return false;
  }

  const cloudName = cloudinaryCloudName();

  return (
    url.protocol === "https:" &&
    url.hostname === "res.cloudinary.com" &&
    // …and on our own cloud, not merely somewhere on Cloudinary's. With no
    // cloud configured there is no upload this site trusts, so nothing passes.
    Boolean(cloudName) &&
    url.pathname.startsWith(`/${cloudName}/`)
  );
};

export const imageAssetSchema = Yup.object({
  src: Yup
    .string()
    .trim()
    .required("Every uploaded image needs a source.")
    .test(
      "allowed-source",
      "Images must be uploaded through this form.",
      (value) => !value || isAllowedImageSource(value),
    ),
});
