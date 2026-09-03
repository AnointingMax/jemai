import { formatDateTimeLong, formatDateTimeShort } from "@/lib/admin/content";
import type { ChristmasStatus, RequestedArea } from "@/lib/christmas";

export type AdminChristmasRequest = {
  id: string;
  /** "#CH-012" — the reference the console and the customer both quote. */
  reference: string;
  /** The campaign batch. Every screen is scoped to one of these. */
  year: number;
  name: string;
  email: string;
  phone: string;
  propertyType: string;
  areas: RequestedArea[];
  status: ChristmasStatus;
  receivedAt: string;
};

/** The year filter's "everything" option — a Select item cannot carry an empty value. */
export const ALL_CHRISTMAS_YEARS = "All years";

/** Likewise for the status filter. */
export const ALL_CHRISTMAS_STATUSES = "All statuses";

/**
 * "Living + Dining · Bedrooms (3)" — the index's Decoration areas column.
 *
 * A count is only drawn once there is more than one room of that kind: the
 * frame prints a bare "Exterior & Compound" and a "Bedrooms (3)" side by side,
 * so the number reads as information rather than as noise on every row.
 */
export const areaSummary = (request: Pick<AdminChristmasRequest, "areas">) =>
  request.areas
    .map(({ area, quantity }) => (quantity > 1 ? `${area} (${quantity})` : area))
    .join(" · ");

/** "2 Sep · 09:42" — the index's Submitted column. */
export const submittedAt = (request: Pick<AdminChristmasRequest, "receivedAt">) =>
  formatDateTimeShort(request.receivedAt);

/** "2 September 2026 · 09:42" — the long stamp the sheet prints. */
export const submittedOn = (request: Pick<AdminChristmasRequest, "receivedAt">) =>
  formatDateTimeLong(request.receivedAt);
