import {
  fulfillmentStatuses,
  isFulfillmentStatus,
  isPaymentStatus,
  orderNumber,
  type AdminOrder,
  type FulfillmentStatus,
  type HistoryStep,
} from "@/lib/admin/order-record";
import { searchClauses } from "@/lib/admin/table-query";
import {
  notifyDeskOfOrder,
  sendOrderConfirmation,
  sendOrderDispatched,
  sendOrderPaymentFailed,
} from "@/lib/mail/messages";
import { Prisma } from "@/lib/generated/prisma/client";
import { verifyPayment } from "@/lib/paystack";
import { prisma } from "@/lib/prisma";

/**
 * Furniture orders: the checkout writes them, the payment pipeline settles
 * them, and the console reads and fulfills them. The record's own shape, its
 * two status vocabularies and its formatters live in `lib/admin/order-record`,
 * which the table and the sheet import without pulling this file's Prisma and
 * Paystack behind them.
 */
export * from "@/lib/admin/order-record";

const withItems = {
  items: { orderBy: { position: "asc" } },
} satisfies Prisma.OrderInclude;

type OrderRecord = Prisma.OrderGetPayload<{ include: typeof withItems; }>;

/** The delivery address as one line, which is the only way the console draws it. */
const addressLine = (record: OrderRecord) =>
  [record.address, record.city, record.state, record.postalCode, record.country]
    .filter(Boolean)
    .join(", ");

/**
 * The four stamp columns as the map the sheet's timeline reads. A stage the
 * order has not reached is absent rather than null, which is what makes it draw
 * as still ahead.
 */
const timeline = (record: OrderRecord) => {
  const stamps: [HistoryStep, Date | null][] = [
    ["Order placed", record.placedAt],
    ["Processing", record.processingAt],
    ["Ready for dispatch", record.dispatchedAt],
    ["Delivered", record.deliveredAt],
  ];

  return Object.fromEntries(
    stamps
      .filter(([, at]) => at)
      .map(([step, at]) => [step, at!.toISOString()]),
  ) as Partial<Record<HistoryStep, string>>;
};

const toOrder = (record: OrderRecord): AdminOrder => ({
  id: record.id,
  number: orderNumber(record.number),
  reference: record.reference,
  customer: record.name,
  email: record.email,
  phone: record.phone,
  subtotal: record.subtotal,
  shipping: record.shipping,
  total: record.total,
  amountPaid: record.amountPaid,
  payment: isPaymentStatus(record.payment) ? record.payment : "Pending payment",
  status: isFulfillmentStatus(record.status) ? record.status : "New",
  placedAt: record.placedAt.toISOString(),
  items: record.items.map((item) => ({
    name: item.name,
    slug: item.slug,
    image: item.image,
    quantity: item.quantity,
    colour: item.colour,
    size: item.size,
    unitPrice: item.unitPrice,
  })),
  address: addressLine(record),
  notes: record.notes,
  timeline: timeline(record),
});

export type OrderQuery = {
  /** Matched against the customer, their email and the order's own number. */
  search?: string;
  status?: FulfillmentStatus;
};

/**
 * Newest first — the order the index and the overview both want them in.
 *
 * Search and the status filter run in the database rather than over rows already
 * sent, which is also what makes the export honest: it carries this query's
 * orders, not the subset a page happened to have fetched.
 *
 * Settled orders only. A checkout that never paid is an attempt rather than an
 * order, and the console has nothing to do with one: it cannot be searched,
 * exported or fulfilled here, and `settleOrder` is what brings it into view.
 */
export const listOrders = async ({ search, status }: OrderQuery = {}) => {
  const needle = search?.trim();
  // The number is what a buyer quotes, and they quote it as "#JM-2048" or as
  // "2048" — so the "#JM-" the display carries is stripped before it is matched
  // against the column that does not.
  const digits = needle?.replace(/\D/g, "");

  const records = await prisma.order.findMany({
    where: {
      payment: "Paid",
      ...(status ? { status } : {}),
      ...(needle
        ? {
          OR: [
            ...searchClauses(["name", "email", "phone", "reference"], needle),
            ...(digits ? [{ number: Number(digits) }] : []),
          ],
        }
        : {}),
    },
    include: withItems,
    orderBy: { placedAt: "desc" },
  });

  return records.map(toOrder);
};

/** The overview's recent-order table: the newest paid handful, in frame order. */
export const recentOrders = async (limit = 7) => {
  const records = await prisma.order.findMany({
    where: { payment: "Paid" },
    include: withItems,
    orderBy: { placedAt: "desc" },
    take: limit,
  });
  return records.map(toOrder);
};

/** The overview's "Awaiting fulfillment" count — paid for and not yet moved. */
export const countNewOrders = () =>
  prisma.order.count({ where: { payment: "Paid", status: "New" } });

export type OrderItemInput = {
  furnitureId: string | null;
  variantId: string | null;
  name: string;
  slug: string;
  image: string;
  colour: string;
  size: string;
  unitPrice: number;
  quantity: number;
};

export type OrderInput = {
  reference: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  notes: string;
  subtotal: number;
  shipping: number;
  total: number;
  items: OrderItemInput[];
};

/**
 * Records an order off the checkout. It always opens "Pending payment": nothing
 * is an order until Paystack says the money arrived, and this row is what the
 * reference will be settled against when it does.
 */
export const createOrder = async ({ items, ...order }: OrderInput) => {
  const record = await prisma.order.create({
    data: {
      ...order,
      items: {
        create: items.map((item, position) => ({ ...item, position })),
      },
    },
    include: withItems,
  });
  return toOrder(record);
};

/**
 * Takes a paid order's pieces out of stock.
 *
 * Every line carries the id of the colour × size row it bought, so the
 * draw-down is that row and no searching is involved: the variant the buyer
 * picked is the variant that is spent. A line whose piece runs no variants at
 * all carries its count on the product itself, and one whose variant has since
 * been deleted has nothing left to charge — its colour and size survive on the
 * order so the console can still say what was sold.
 *
 * A count is never pushed below zero. Overselling is a thing that happened, and
 * a negative number would only hide it from whoever has to sort it out.
 */
const drawDownStock = async (
  tx: Prisma.TransactionClient,
  items: OrderRecord["items"],
) => {
  for (const item of items) {
    if (item.variantId) {
      const variant = await tx.furnitureVariant.findUnique({
        where: { id: item.variantId },
        select: { quantity: true },
      });
      if (!variant) continue;

      await tx.furnitureVariant.update({
        where: { id: item.variantId },
        data: { quantity: Math.max(0, variant.quantity - item.quantity) },
      });
      continue;
    }

    if (!item.furnitureId) continue;

    const piece = await tx.furniture.findUnique({
      where: { id: item.furnitureId },
      select: { stock: true },
    });
    if (!piece) continue;

    await tx.furniture.update({
      where: { id: item.furnitureId },
      data: { stock: Math.max(0, piece.stock - item.quantity) },
    });
  }
};

/**
 * Settles an order against Paystack, and is the only place `payment` moves.
 *
 * Both the webhook and the buyer coming back from the payment page land here,
 * so it has to be safe to run twice: an order already paid is answered from the
 * row rather than re-verified, which is also what keeps stock from being drawn
 * down a second time.
 *
 * The stock draw-down shares the transaction that marks the order paid. Either
 * the catalogue and the order agree, or neither moved.
 */
export const settleOrder = async (reference: string) => {
  const existing = await prisma.order.findUnique({ where: { reference }, include: withItems });
  if (!existing) return null;
  if (existing.payment === "Paid") return toOrder(existing);

  const payment = await verifyPayment(reference);
  // A short payment is not a settled order. Paystack quotes in kobo and we
  // compare in naira, so this is an equality in practice — but a part-payment
  // has to fail rather than round its way into fulfillment.
  const settled = payment.paid && payment.amount >= existing.total;

  const target = settled ? "Paid" : "Failed";

  const record = await prisma.$transaction(async (tx) => {
    const { count } = await tx.order.updateMany({
      where: { id: existing.id, payment: { notIn: ["Paid", target] } },
      data: {
        payment: target,
        amountPaid: payment.paid ? payment.amount : null,
        paidAt: settled ? (payment.paidAt ?? new Date()) : null,
      },
    });

    const updated = await tx.order.findUniqueOrThrow({
      where: { id: existing.id },
      include: withItems,
    });

    if (settled && count === 1) await drawDownStock(tx, updated.items);

    return { updated, moved: count === 1 };
  });

  const order = toOrder(record.updated);

  if (record.moved) {
    if (settled) {
      await sendOrderConfirmation(order);
      await notifyDeskOfOrder(order);
    } else {
      await sendOrderPaymentFailed(order);
    }
  }

  return order;
};

/** Which stamp column each stage of the lifecycle writes. "New" writes none — that is `placedAt`. */
const stampColumn: Record<FulfillmentStatus, "processingAt" | "dispatchedAt" | "deliveredAt" | null> = {
  New: null,
  Processing: "processingAt",
  "Ready for dispatch": "dispatchedAt",
  Delivered: "deliveredAt",
};

/**
 * Moves an order through fulfillment, stamping the timeline to match.
 *
 * Only a paid order moves. The console cannot reach an unsettled one — nothing
 * but `payment: "Paid"` is read into it — but this write is addressed by id, so
 * it answers "unpaid" rather than trusting the screen the id came off.
 *
 * Reaching a stage means having passed through the ones before it, so any
 * earlier stage still unstamped is stamped with the same moment — otherwise an
 * order sent straight to Delivered would draw a timeline with a hole in it.
 * Moving back the other way clears what is now ahead of the order, so the rail
 * never claims something that has been undone.
 */
export const setFulfillmentStatus = async (id: string, status: FulfillmentStatus) => {
  const existing = await prisma.order.findUnique({ where: { id } });
  if (!existing) return null;
  if (existing.payment !== "Paid") return "unpaid" as const;

  const reached = fulfillmentStatuses.indexOf(status);
  const now = new Date();

  const data: Prisma.OrderUpdateInput = { status };
  for (const stage of fulfillmentStatuses) {
    const column = stampColumn[stage];
    if (!column) continue;

    if (fulfillmentStatuses.indexOf(stage) <= reached) data[column] = existing[column] ?? now;
    else data[column] = null;
  }

  const record = await prisma.order.update({ where: { id }, data, include: withItems });
  const order = toOrder(record);

  // Only the move into dispatch writes to the buyer, and only when it is a move:
  // re-picking the status an order already holds is a no-op, not a second note.
  if (status === "Ready for dispatch" && existing.status !== status)
    await sendOrderDispatched(order);

  return order;
};
