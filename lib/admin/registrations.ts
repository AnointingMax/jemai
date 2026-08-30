import type { Registration, RegistrationStatus } from "@/lib/admin/registration-record";
import { prisma } from "@/lib/prisma";
import { verifyPayment } from "@/lib/paystack";
import type { ExhibitionRegistration } from "@/lib/generated/prisma/client";

/**
 * Exhibition registrations: the storefront writes them, the payment pipeline
 * settles them, and the console reads them. The record's own shape and its
 * status vocabulary live in `lib/admin/registration-record`, which the attendee
 * table imports without pulling this file's Prisma and Paystack behind it.
 */
export * from "@/lib/admin/registration-record";

const toRegistration = (record: ExhibitionRegistration): Registration => ({
  id: record.id,
  reference: record.reference,
  exhibitionTitle: record.exhibitionTitle,
  name: record.name,
  email: record.email,
  phone: record.phone,
  amount: record.amount,
  amountPaid: record.amountPaid,
  status: record.status as RegistrationStatus,
  paidAt: record.paidAt?.toISOString() ?? null,
  registeredAt: record.registeredAt.toISOString(),
});

export type RegistrationInput = {
  reference: string;
  exhibitionId: string;
  exhibitionTitle: string;
  name: string;
  email: string;
  phone: string;
  amount: number;
  status: RegistrationStatus;
};

export const createRegistration = async (input: RegistrationInput) => {
  const record = await prisma.exhibitionRegistration.create({
    data: {
      ...input,
      // A free place is taken the moment it is asked for, so it is paid for in
      // the only sense that applies to it.
      paidAt: input.status === "Confirmed" ? new Date() : null,
    },
  });
  return toRegistration(record);
};

export const getRegistration = async (reference: string) => {
  const record = await prisma.exhibitionRegistration.findUnique({ where: { reference } });
  return record ? toRegistration(record) : null;
};

/** Newest first — the order an index would draw. */
export const listRegistrations = async () => {
  const records = await prisma.exhibitionRegistration.findMany({
    orderBy: { registeredAt: "desc" },
  });
  return records.map(toRegistration);
};

/**
 * One exhibition's attendees, newest first. Failed attempts are kept rather
 * than hidden: a payment that did not go through is what a name in the inbox
 * asking why they have no ticket turns out to be.
 */
/**
 * One exhibition's attendees, newest first, narrowed to a payment status when
 * the console asks for one. The filter runs here rather than over rows already
 * sent: a sold-out run is thousands of places, and the answer to "who still
 * owes" should not be the whole list plus a pass over it in the browser.
 *
 * Unfiltered, failed and pending attempts sit beside the confirmed ones — the
 * person who writes in saying they paid and got nothing is one of them.
 */
export type AttendeeFilter = {
  status?: RegistrationStatus;
  /** Matched against name, email and reference, case-insensitively. */
  search?: string;
};

/**
 * One exhibition's attendees, newest first, narrowed by whatever the console
 * asked for. Both narrowings run here rather than over rows already sent: a
 * sold-out run is thousands of places, and the answer to "who still owes" or
 * "where is Ada" should not be the whole list plus a pass over it in the
 * browser. It is also what makes the export honest — it carries this query's
 * rows, not a subset the reader can see but the file does not have.
 *
 * Unfiltered, failed and pending attempts sit beside the confirmed ones — the
 * person who writes in saying they paid and got nothing is one of them.
 */
export const listRegistrationsForExhibition = async (
  exhibitionId: string,
  { status, search }: AttendeeFilter = {},
) => {
  const needle = search?.trim();

  const records = await prisma.exhibitionRegistration.findMany({
    where: {
      exhibitionId,
      ...(status ? { status } : {}),
      // The reference is what a payer quotes when they write in about a
      // payment, so it is searched even though no column draws it.
      ...(needle
        ? {
            OR: [
              { name: { contains: needle, mode: "insensitive" as const } },
              { email: { contains: needle, mode: "insensitive" as const } },
              { reference: { contains: needle, mode: "insensitive" as const } },
            ],
          }
        : {}),
    },
    orderBy: { registeredAt: "desc" },
  });
  return records.map(toRegistration);
};

export type RegistrationSummary = {
  confirmed: number;
  pending: number;
  failed: number;
  /** Whole naira actually settled — confirmed places only. */
  collected: number;
};

/**
 * The counters above the attendee table: one grouped query rather than four
 * counts, and deliberately blind to the filter — they are what the filter is
 * chosen from, so they have to describe the whole exhibition.
 */
export const registrationSummary = async (
  exhibitionId: string,
): Promise<RegistrationSummary> => {
  const groups = await prisma.exhibitionRegistration.groupBy({
    by: ["status"],
    where: { exhibitionId },
    _count: { _all: true },
    _sum: { amountPaid: true },
  });

  const group = (status: RegistrationStatus) =>
    groups.find((row) => row.status === status);

  return {
    confirmed: group("Confirmed")?._count._all ?? 0,
    pending: group("Pending payment")?._count._all ?? 0,
    failed: group("Failed")?._count._all ?? 0,
    // Only settled money counts: an amount quoted on a failed attempt is not
    // revenue, and `amountPaid` stays null until Paystack says otherwise.
    collected: group("Confirmed")?._sum.amountPaid ?? 0,
  };
};

export const countConfirmedRegistrations = () =>
  prisma.exhibitionRegistration.count({ where: { status: "Confirmed" } });


export const settleRegistration = async (reference: string) => {
  const existing = await prisma.exhibitionRegistration.findUnique({ where: { reference } });
  if (!existing) return null;
  if (existing.status === "Confirmed") return toRegistration(existing);

  const payment = await verifyPayment(reference);
  const settled = payment.paid && payment.amount >= existing.amount;

  const record = await prisma.exhibitionRegistration.update({
    where: { id: existing.id },
    data: {
      status: settled ? "Confirmed" : "Failed",
      amountPaid: payment.paid ? payment.amount : null,
      paidAt: settled ? (payment.paidAt ?? new Date()) : null,
    },
  });

  return toRegistration(record);
};
