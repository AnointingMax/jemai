import * as Yup from "yup";

import {
  ALLOWED_IMAGE_TYPES,
  ALLOWED_IMAGE_LABEL,
  MAX_IMAGE_SIZE_BYTES,
  MAX_IMAGE_SIZE_MB,
  MAX_IMAGE_UPLOAD_TOTAL_BYTES,
  MAX_IMAGE_UPLOAD_TOTAL_MB,
} from "@/lib/constants";

const isFile = (value: unknown): value is File =>
  typeof File !== "undefined" && value instanceof File;

export const oversizedFiles = (files: File[]) =>
  files.filter((file) => file.size > MAX_IMAGE_SIZE_BYTES);

export const disallowedFiles = (files: File[]) =>
  files.filter(
    (file) => !(ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type),
  );

export const totalSize = (files: File[]) =>
  files.reduce((total, file) => total + file.size, 0);

const names = (files: File[]) => files.map((file) => file.name).join(", ");

export const imageFileValidation = Yup.mixed<File>()
  .nullable()
  .test("is-file", "Image must be a file", (value) => !value || isFile(value))
  .test(
    "file-type",
    `Images must be ${ALLOWED_IMAGE_LABEL}`,
    (value) => !isFile(value) || disallowedFiles([value]).length === 0,
  )
  .test(
    "file-size",
    `Image must be ${MAX_IMAGE_SIZE_MB}MB or smaller`,
    (value) => !isFile(value) || value.size <= MAX_IMAGE_SIZE_BYTES,
  );

export const imageArrayValidation = (maxFiles: number) =>
  Yup.array()
    .of(Yup.mixed<File>().required())
    .max(maxFiles, `You can only upload a maximum of ${maxFiles} images`)
    .test(
      "file-type",
      ({ value }) =>
        `Images must be ${ALLOWED_IMAGE_LABEL}. Not accepted: ${names(
          disallowedFiles((value as File[]) ?? []),
        )}`,
      (value) => disallowedFiles((value as File[]) ?? []).length === 0,
    )
    .test(
      "file-size",
      ({ value }) =>
        `Each image must be ${MAX_IMAGE_SIZE_MB}MB or smaller. Too large: ${names(
          oversizedFiles((value as File[]) ?? []),
        )}`,
      (value) => oversizedFiles((value as File[]) ?? []).length === 0,
    )
    .test(
      "total-size",
      `All images together must be under ${MAX_IMAGE_UPLOAD_TOTAL_MB}MB`,
      (value) => totalSize((value as File[]) ?? []) <= MAX_IMAGE_UPLOAD_TOTAL_BYTES,
    );

export const validateImageBatch = async (files: File[], maxFiles: number) => {
  try {
    await imageArrayValidation(maxFiles).validate(files, { abortEarly: true });
    return null;
  } catch (error) {
    if (error instanceof Yup.ValidationError) return error.errors[0] ?? error.message;
    throw error;
  }
};
