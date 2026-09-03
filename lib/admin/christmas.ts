import type { AdminChristmasRequest } from "@/lib/admin/christmas-record";
import { searchAcross } from "@/lib/admin/table-query";
import { seasonCapacity, type ChristmasStatus, type RequestedArea } from "@/lib/christmas";
import { prisma } from "@/lib/prisma";
import type { ChristmasRequest } from "@/lib/generated/prisma/client";

/**
 * The row as the console's one Christmas request shape.
 *
 * `areas` and `status` come back typed rather than as `JsonValue` and `string`
 * — `prisma-json-types-generator` substitutes the declarations in
 * `types/prisma-json.d.ts`. That is a compile-time substitution over columns
 * that could in principle hold anything, so what actually backs it is the yup
 * schema on the write: nothing reaches them unvalidated.
 */
const toRequest = (record: ChristmasRequest): AdminChristmasRequest => ({
  id: record.id,
  reference: `#CH-${String(record.reference).padStart(3, "0")}`,
  year: record.year,
  name: record.name,
  email: record.email,
  phone: record.phone,
  propertyType: record.propertyType,
  areas: record.areas,
  status: record.status,
  receivedAt: record.receivedAt.toISOString(),
});

export type ChristmasQuery = {
  search?: string;
  year?: number;
  status?: ChristmasStatus;
};

/** Every narrowing the index offers runs here, in the database. */
export const listChristmasRequests = async ({
  search,
  year,
  status,
}: ChristmasQuery = {}) => {
  const records = await prisma.christmasRequest.findMany({
    where: {
      ...(year ? { year } : {}),
      ...(status ? { status } : {}),
      ...searchAcross(["name", "email", "propertyType"], search),
    },
    orderBy: { receivedAt: "desc" },
  });
  return records.map(toRequest);
};

/**
 * The batches that have ever taken a request, newest first — what the year
 * filter offers. The current campaign year is always included even before its
 * first request lands, so the filter is never empty on a fresh season.
 */
export const christmasYears = async (): Promise<number[]> => {
  const groups = await prisma.christmasRequest.groupBy({
    by: ["year"],
    orderBy: { year: "desc" },
  });
  const years = new Set(groups.map((group) => group.year));
  years.add(currentChristmasYear());
  return [...years].sort((a, b) => b - a);
};

/**
 * Which batch a request filed today belongs to.
 *
 * The campaign is named for the Christmas it decorates and the page runs all
 * year, so a request in January is for *this* December — the batch is simply
 * the calendar year, and nothing rolls over until it does.
 */
export const currentChristmasYear = () => new Date().getUTCFullYear();

/**
 * Slots left in a batch.
 *
 * **Only paid requests spend one.** Submitting the form is an enquiry: the
 * studio contacts the customer, agrees a price and takes payment outside the
 * system, and the slot is held when an administrator marks the request `Paid`.
 * Counting submissions instead would let a page of unanswered enquiries close
 * the season on everyone.
 */
export const christmasSlotsLeft = async (year: number) => {
  const taken = await prisma.christmasRequest.count({
    where: { year, status: "Paid" },
  });
  return Math.max(0, seasonCapacity - taken);
};

/** Whether this email has already asked for this year's campaign. */
export const hasChristmasRequest = async (year: number, email: string) =>
  (await prisma.christmasRequest.count({ where: { year, email } })) > 0;

export type ChristmasRequestInput = {
  year: number;
  name: string;
  email: string;
  phone: string;
  propertyType: string;
  areas: RequestedArea[];
};

/** Records a request off the storefront form. It always arrives `New`. */
export const createChristmasRequest = async (input: ChristmasRequestInput) => {
  const record = await prisma.christmasRequest.create({ data: input });
  return toRequest(record);
};

/** The sheet's one write. False if the request has since been deleted. */
export const setChristmasStatus = async (id: string, status: ChristmasStatus) => {
  const { count } = await prisma.christmasRequest.updateMany({
    where: { id },
    data: { status },
  });
  return count > 0;
};
