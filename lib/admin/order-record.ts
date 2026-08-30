import { naira } from "@/lib/admin/content";

export const fulfillmentStatuses = [
  "New",
  "Processing",
  "Ready for dispatch",
  "Delivered",
] as const;

export type FulfillmentStatus = (typeof fulfillmentStatuses)[number];

export const isFulfillmentStatus = (value: string): value is FulfillmentStatus =>
  (fulfillmentStatuses as readonly string[]).includes(value);

export const paymentStatuses = ["Pending payment", "Paid", "Failed"] as const;

export type PaymentStatus = (typeof paymentStatuses)[number];

export const isPaymentStatus = (value: string): value is PaymentStatus =>
  (paymentStatuses as readonly string[]).includes(value);

export const historySteps = [
  "Order placed",
  "Processing",
  "Ready for dispatch",
  "Delivered",
] as const;

export type HistoryStep = (typeof historySteps)[number];

export type OrderItem = {
  name: string;
  slug: string;
  image: string;
  quantity: number;
  colour: string;
  size: string;
  /** Whole naira, as it was priced on the day. */
  unitPrice: number;
};

export type AdminOrder = {
  /** The record's own id — what a write is addressed to. */
  id: string;
  /** `#JM-2048`, the number the console and the buyer both quote. */
  number: string;
  /** The payment reference, which is what Paystack knows this order by. */
  reference: string;
  customer: string;
  email: string;
  phone: string;
  subtotal: number;
  shipping: number;
  /** Whole naira. Formatting happens at the edge so sorting stays numeric. */
  total: number;
  amountPaid: number | null;
  payment: PaymentStatus;
  status: FulfillmentStatus;
  /** ISO. The table prints `formatOrderDate`, sorting compares this. */
  placedAt: string;
  items: OrderItem[];
  address: string;
  notes: string;
  /**
   * ISO stamps for the steps this order has actually reached, keyed by step.
   * Anything absent is still ahead of the order and draws as pending.
   */
  timeline: Partial<Record<HistoryStep, string>>;
};

/** "#JM-2048" — the number as everything outside the database spells it. */
export const orderNumber = (number: number) => `#JM-${number}`;

/** "Jan 16, 2025" — the table column. */
export const formatOrderDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

/** "18 Aug 2026 · 09:42" — the timeline stamps in the sheet. */
export const formatOrderStamp = (iso: string) => {
  const date = new Date(iso);
  const day = date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  const time = date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  return `${day} · ${time}`;
};

/** "Olive · Standard", dropping whichever half a variant does not carry. */
export const describeItem = (line: OrderItem) =>
  [line.colour, line.size].filter(Boolean).join(" · ");

export type TimelineEntry = {
  label: HistoryStep;
  /** Pre-formatted, or null while the step is still ahead of the order. */
  stamp: string | null;
  done: boolean;
};

/** Every step, in lifecycle order, with the ones this order has reached stamped. */
export const orderTimeline = (order: AdminOrder): TimelineEntry[] =>
  historySteps.map((label) => {
    const at = order.timeline[label];
    return { label, stamp: at ? formatOrderStamp(at) : null, done: Boolean(at) };
  });

export { naira };
