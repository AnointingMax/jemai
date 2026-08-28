import { naira } from "@/lib/admin/content";

/**
 * The fulfillment lifecycle, in order. Both the table pill and the sheet's
 * timeline read this array, so a stage is named once and the two stay in step.
 */
export const fulfillmentStatuses = [
  "New",
  "Processing",
  "Ready for dispatch",
  "Delivered",
] as const;

export type FulfillmentStatus = (typeof fulfillmentStatuses)[number];

/**
 * The timeline the sheet draws. It is the lifecycle with "New" spelled the way
 * an event reads rather than the way a state does — the order was placed, and
 * from then on the label and the status are the same word.
 */
export const historySteps = [
  "Order placed",
  "Processing",
  "Ready for dispatch",
  "Delivered",
] as const;

export type HistoryStep = (typeof historySteps)[number];

/** One line on the order — a product, a quantity and the variant that was bought. */
export type OrderItem = {
  name: string;
  quantity: number;
  colour: string;
  size: string;
};

export type AdminOrder = {
  id: string;
  customer: string;
  email: string;
  phone: string;
  /** Whole naira. Formatting happens at the edge so sorting stays numeric. */
  total: number;
  /** ISO. The table prints `formatOrderDate`, sorting compares this. */
  placedAt: string;
  status: FulfillmentStatus;
  items: OrderItem[];
  address: string;
  /**
   * ISO stamps for the steps this order has actually reached, keyed by step.
   * Anything absent is still ahead of the order and draws as pending.
   */
  timeline: Partial<Record<HistoryStep, string>>;
};

const item = (name: string, colour: string, size: string, quantity = 1): OrderItem => ({
  name,
  colour,
  size,
  quantity,
});

/**
 * Fixtures until the Paystack feed lands. Names, totals and statuses are the
 * ones the frame prints; the dates are pulled into a single coherent week so
 * the table and the sheet's timeline agree with each other.
 */
const store: AdminOrder[] = [
  {
    id: "#JM-2048",
    customer: "Ada Okafor",
    email: "ada.okafor@example.com",
    phone: "+234 701 660 1430",
    total: 1600,
    placedAt: "2026-08-18T09:42:00+01:00",
    status: "Processing",
    items: [item("Alma Accent Chair", "Olive", "Standard")],
    address: "12 Bourdillon Road, Ikoyi, Lagos",
    timeline: {
      "Order placed": "2026-08-18T09:42:00+01:00",
      Processing: "2026-08-18T10:03:00+01:00",
    },
  },
  {
    id: "#JM-2047",
    customer: "Teni Alade",
    email: "teni.alade@example.com",
    phone: "+234 704 667 6343",
    total: 2600,
    placedAt: "2026-08-18T08:15:00+01:00",
    status: "New",
    items: [item("Mila Velvet Chair", "Green", "Standard", 2)],
    address: "4 Glover Road, Ikoyi, Lagos",
    timeline: { "Order placed": "2026-08-18T08:15:00+01:00" },
  },
  {
    id: "#JM-2046",
    customer: "Kelechi Nwosu",
    email: "kelechi.nwosu@example.com",
    phone: "+234 703 118 9022",
    total: 5600,
    placedAt: "2026-08-17T16:48:00+01:00",
    status: "New",
    items: [item("Nara Bouclé Chair", "Sand", "Large")],
    address: "27 Admiralty Way, Lekki Phase 1, Lagos",
    timeline: { "Order placed": "2026-08-17T16:48:00+01:00" },
  },
  {
    id: "#JM-2045",
    customer: "Mathilde Lewis",
    email: "mathilde.lewis@example.com",
    phone: "+234 806 442 7781",
    total: 6300,
    placedAt: "2026-08-17T14:02:00+01:00",
    status: "New",
    items: [item("Stone Armchair", "Charcoal", "Organic")],
    address: "9 Kingsway Road, Ikoyi, Lagos",
    timeline: { "Order placed": "2026-08-17T14:02:00+01:00" },
  },
  {
    id: "#JM-2044",
    customer: "Olly Schroeder",
    email: "olly.schroeder@example.com",
    phone: "+234 802 337 5510",
    total: 2100,
    placedAt: "2026-08-17T11:26:00+01:00",
    status: "New",
    items: [item("Ayo Side Table", "Walnut", "Standard")],
    address: "31 Ozumba Mbadiwe Avenue, Victoria Island, Lagos",
    timeline: { "Order placed": "2026-08-17T11:26:00+01:00" },
  },
  {
    id: "#JM-2043",
    customer: "Julius Vaughan",
    email: "julius.vaughan@example.com",
    phone: "+234 805 220 4419",
    total: 1070,
    placedAt: "2026-08-16T17:34:00+01:00",
    status: "Processing",
    items: [item("Alma Accent Chair", "Oak", "Standard")],
    address: "18 Milverton Road, Ikoyi, Lagos",
    timeline: {
      "Order placed": "2026-08-16T17:34:00+01:00",
      Processing: "2026-08-16T18:10:00+01:00",
    },
  },
  {
    id: "#JM-2042",
    customer: "Zaid Schwartz",
    email: "zaid.schwartz@example.com",
    phone: "+234 809 771 2264",
    total: 8100,
    placedAt: "2026-08-16T13:09:00+01:00",
    status: "Ready for dispatch",
    items: [item("Mila Velvet Chair", "Green", "Three-seater")],
    address: "6 Alexander Avenue, Ikoyi, Lagos",
    timeline: {
      "Order placed": "2026-08-16T13:09:00+01:00",
      Processing: "2026-08-16T14:41:00+01:00",
      "Ready for dispatch": "2026-08-17T09:20:00+01:00",
    },
  },
  {
    id: "#JM-2041",
    customer: "Ngozi Eze",
    email: "ngozi.eze@example.com",
    phone: "+234 703 909 6612",
    total: 3450,
    placedAt: "2026-08-15T10:55:00+01:00",
    status: "Delivered",
    items: [item("Ayo Side Table", "Ash", "Small", 2)],
    address: "22 Norman Williams Street, Ikoyi, Lagos",
    timeline: {
      "Order placed": "2026-08-15T10:55:00+01:00",
      Processing: "2026-08-15T12:12:00+01:00",
      "Ready for dispatch": "2026-08-16T08:40:00+01:00",
      Delivered: "2026-08-17T15:05:00+01:00",
    },
  },
  {
    id: "#JM-2040",
    customer: "Bisi Adeyemi",
    email: "bisi.adeyemi@example.com",
    phone: "+234 807 554 3390",
    total: 12400,
    placedAt: "2026-08-14T18:21:00+01:00",
    status: "Delivered",
    items: [
      item("Stone Armchair", "Charcoal", "Organic"),
      item("Ayo Side Table", "Walnut", "Standard"),
    ],
    address: "14 Karimu Kotun Street, Victoria Island, Lagos",
    timeline: {
      "Order placed": "2026-08-14T18:21:00+01:00",
      Processing: "2026-08-15T09:03:00+01:00",
      "Ready for dispatch": "2026-08-15T16:30:00+01:00",
      Delivered: "2026-08-16T11:48:00+01:00",
    },
  },
  {
    id: "#JM-2039",
    customer: "Femi Bankole",
    email: "femi.bankole@example.com",
    phone: "+234 810 226 8874",
    total: 4750,
    placedAt: "2026-08-14T09:38:00+01:00",
    status: "Ready for dispatch",
    items: [item("Nara Bouclé Chair", "Ivory", "Standard")],
    address: "3 Oyinkan Abayomi Drive, Ikoyi, Lagos",
    timeline: {
      "Order placed": "2026-08-14T09:38:00+01:00",
      Processing: "2026-08-14T11:15:00+01:00",
      "Ready for dispatch": "2026-08-15T10:02:00+01:00",
    },
  },
  {
    id: "#JM-2038",
    customer: "Amara Chukwu",
    email: "amara.chukwu@example.com",
    phone: "+234 806 118 4407",
    total: 2280,
    placedAt: "2026-08-13T15:44:00+01:00",
    status: "Delivered",
    items: [item("Mila Velvet Chair", "Blush", "Standard")],
    address: "45 Awolowo Road, Ikoyi, Lagos",
    timeline: {
      "Order placed": "2026-08-13T15:44:00+01:00",
      Processing: "2026-08-13T17:02:00+01:00",
      "Ready for dispatch": "2026-08-14T09:51:00+01:00",
      Delivered: "2026-08-15T13:27:00+01:00",
    },
  },
  {
    id: "#JM-2037",
    customer: "Tunde Bakare",
    email: "tunde.bakare@example.com",
    phone: "+234 802 663 1195",
    total: 9900,
    placedAt: "2026-08-12T12:07:00+01:00",
    status: "Delivered",
    items: [item("Alma Accent Chair", "Olive", "Standard", 3)],
    address: "8 Musa Yar'Adua Street, Victoria Island, Lagos",
    timeline: {
      "Order placed": "2026-08-12T12:07:00+01:00",
      Processing: "2026-08-12T14:33:00+01:00",
      "Ready for dispatch": "2026-08-13T08:19:00+01:00",
      Delivered: "2026-08-14T16:40:00+01:00",
    },
  },
];

/** Newest first, the way the index and the overview both want them. */
export const listOrders = () => [...store].sort((a, b) => b.placedAt.localeCompare(a.placedAt));

export const getOrder = (id: string) => store.find((order) => order.id === id);

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
