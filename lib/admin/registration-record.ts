/**
 * The registration's shape and vocabulary, with nothing server-side behind it —
 * the attendee table is a client component and takes its statuses from here, so
 * importing them cannot drag Prisma or the Paystack client into the browser
 * bundle. `lib/admin/registrations` is the query side and imports these.
 *
 * Same split as `lib/admin/enquiry-record` beside it, for the same reason.
 */

/**
 * A registration's status is the whole story of its payment. A free show is
 * "Confirmed" on arrival; a paid one opens "Pending payment" and only ever
 * leaves that state on what Paystack says about its reference.
 */
export const registrationStatuses = ["Confirmed", "Pending payment", "Failed"] as const;

export type RegistrationStatus = (typeof registrationStatuses)[number];

export const isRegistrationStatus = (value: string): value is RegistrationStatus =>
  (registrationStatuses as readonly string[]).includes(value);

export type Registration = {
  id: string;
  reference: string;
  exhibitionTitle: string;
  name: string;
  email: string;
  phone: string;
  /** Whole naira, as quoted. Zero for a free show. */
  amount: number;
  amountPaid: number | null;
  status: RegistrationStatus;
  /** ISO strings; the console sorts on `registeredAt`. */
  paidAt: string | null;
  registeredAt: string;
};
