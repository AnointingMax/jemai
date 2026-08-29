import { isEnquiryStatus, type AdminEnquiry, type EnquiryStatus } from "@/lib/admin/enquiry-record";
import { prisma } from "@/lib/prisma";
import type { Enquiry as EnquiryRecord } from "@/lib/generated/prisma/client";

/** Every read pulls the linked work's slug, which is the console's only use of it. */
const withArtwork = { artwork: { select: { slug: true } } } as const;

type EnquiryRow = EnquiryRecord & { artwork: { slug: string } | null };

/**
 * The follow-up queue's read and write side. Server-only — every client
 * component takes its shapes and formatters from `lib/admin/enquiry-record`
 * instead, so the Postgres driver never reaches the browser bundle.
 */

/** The row as the console's one enquiry shape. */
const toEnquiry = (record: EnquiryRow): AdminEnquiry => ({
  id: record.id,
  reference: `#EN-${record.reference}`,
  artworkSlug: record.artwork?.slug ?? null,
  artworkTitle: record.artworkTitle,
  artist: record.artist,
  name: record.name,
  email: record.email,
  phone: record.phone,
  message: record.message,
  receivedAt: record.receivedAt.toISOString(),
  // Free text in the database; anything the console never wrote still has to
  // land on one of the three states the pill and the select know about.
  status: isEnquiryStatus(record.status) ? record.status : "New",
});

/** Newest first, the way the index draws them before the reader sorts. */
export const listEnquiries = async () => {
  const records = await prisma.enquiry.findMany({
    orderBy: { receivedAt: "desc" },
    include: withArtwork,
  });
  return records.map(toEnquiry);
};

/** The overview's "Awaiting follow-up" count — untouched enquiries only. */
export const countNewEnquiries = () => prisma.enquiry.count({ where: { status: "New" } });

export type EnquiryInput = Omit<
  AdminEnquiry,
  "id" | "reference" | "receivedAt" | "status" | "artworkSlug"
> & {
  /** The work being enquired about. Resolved by the caller, never posted. */
  artworkId: string;
};

/** Records an enquiry off the storefront modal. It always arrives `New`. */
export const createEnquiry = async (input: EnquiryInput) => {
  const record = await prisma.enquiry.create({ data: input, include: withArtwork });
  return toEnquiry(record);
};

/** The sheet's one write. False if the enquiry has since been deleted. */
export const setEnquiryStatus = async (id: string, status: EnquiryStatus) => {
  const { count } = await prisma.enquiry.updateMany({ where: { id }, data: { status } });
  return count > 0;
};
