import { formatDateRange, formatDateTimeShort, formatUpdatedAt } from "@/lib/admin/content";

export const consultationStatuses = ["New", "Reviewing", "Scheduled", "Closed"] as const;

export type ConsultationStatus = (typeof consultationStatuses)[number];

export const isConsultationStatus = (value: string): value is ConsultationStatus =>
  (consultationStatuses as readonly string[]).includes(value);

export const projectTypes = [
  "Interior Decor",
  "Architecture",
  "Full Renovation",
  "Furniture Selection",
  "Art Curation",
  "Other",
] as const;

export const budgets = [
  "Under ₦5,000,000",
  "₦5,000,000 – ₦15,000,000",
  "₦15,000,000 – ₦50,000,000",
  "₦50,000,000 – ₦150,000,000",
  "Above ₦150,000,000",
] as const;

export type AdminConsultation = {
  id: string;
  reference: string;
  name: string;
  email: string;
  phone: string;
  projectType: string;
  startDate: string;
  endDate: string;
  budget: string;
  summary: string;
  receivedAt: string;
  status: ConsultationStatus;
};

/** "18 Aug · 08:47" — the index's Received column. */
export const requestedAt = (request: Pick<AdminConsultation, "receivedAt">) =>
  formatDateTimeShort(request.receivedAt);

/** "18 Aug 2026 8:47 am" — the long stamp the sheet prints. */
export const requestedOn = (request: Pick<AdminConsultation, "receivedAt">) =>
  formatUpdatedAt(request.receivedAt);

export const consultationWindow = (request: Pick<AdminConsultation, "startDate" | "endDate">) =>
  formatDateRange(request.startDate, request.endDate);
