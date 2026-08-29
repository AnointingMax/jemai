import { formatDateTimeShort, formatUpdatedAt } from "@/lib/admin/content";

export const enquiryStatuses = ["New", "In conversation", "Closed"] as const;

export type EnquiryStatus = (typeof enquiryStatuses)[number];

export const isEnquiryStatus = (value: string): value is EnquiryStatus =>
  (enquiryStatuses as readonly string[]).includes(value);

export type AdminEnquiry = {
  id: string;
  reference: string;
  artworkSlug: string | null;
  artworkTitle: string;
  artist: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  receivedAt: string;
  status: EnquiryStatus;
};

/** "18 Aug · 10:24" — the index's Received column. */
export const enquiredAt = (enquiry: Pick<AdminEnquiry, "receivedAt">) =>
  formatDateTimeShort(enquiry.receivedAt);

/** "18 Aug 2026 10:24 am" — the long stamp the sheet prints. */
export const enquiredOn = (enquiry: Pick<AdminEnquiry, "receivedAt">) =>
  formatUpdatedAt(enquiry.receivedAt);

/** "Threads of Becoming · Amina Bako" — the caption the modal locks the enquiry to. */
export const describeArtwork = (enquiry: Pick<AdminEnquiry, "artworkTitle" | "artist">) =>
  `${enquiry.artworkTitle} · ${enquiry.artist}`;
