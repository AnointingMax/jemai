"use server";

import { revalidatePath } from "next/cache";
import * as Yup from "yup";

import { failWith, fail, ok, validate, type ActionResult } from "@/lib/action-result";
import { hasPermission } from "@/lib/admin/auth/permissions";
import { readAdminSession } from "@/lib/admin/auth/session";
import { csvExport, type CsvExport } from "@/lib/admin/csv";
import {
  describeItem,
  formatOrderDate,
  fulfillmentStatuses,
  paymentStatuses,
  type FulfillmentStatus,
  type PaymentStatus,
} from "@/lib/admin/order-record";
import { listOrders, setFulfillmentStatus } from "@/lib/admin/orders";

const guard = async () => {
  const session = await readAdminSession();
  if (!session) return fail("Your session has expired. Sign in again.");
  if (!hasPermission(session.permissions, "orders"))
    return fail("You do not have access to furniture orders.");
  return null;
};

const statusPayload = () =>
  Yup.object({
    id: Yup.string().trim().required("Pick an order."),
    status: Yup
      .string()
      .trim()
      .oneOf(fulfillmentStatuses, "Pick a status from the list.")
      .required("Pick a status from the list."),
  });

/**
 * Fulfillment's one write. Payment is deliberately not on this action: it moves
 * on what Paystack says about the order's reference and nowhere else, so the
 * console cannot mark something paid that never was.
 */
export const updateOrderStatusAction = async (
  values: unknown,
): Promise<ActionResult<string>> => {
  const denied = await guard();
  if (denied) return denied;

  const parsed = await validate(statusPayload(), values);
  if (parsed.error) return parsed;

  try {
    const order = await setFulfillmentStatus(
      parsed.data.id,
      parsed.data.status as FulfillmentStatus,
    );
    if (!order) return fail("That order no longer exists.");

    revalidatePath("/admin/orders");
    revalidatePath("/admin");

    return ok(`Order ${order.number} moved to ${order.status}`);
  } catch (error) {
    return failWith("Could not update this order. Try again.", error);
  }
};

const exportPayload = () =>
  Yup.object({
    search: Yup.string().trim().default(""),
    status: Yup.string().trim().oneOf(["", ...fulfillmentStatuses]).default(""),
    payment: Yup.string().trim().oneOf(["", ...paymentStatuses]).default(""),
  });

/**
 * The order book as a spreadsheet, under whatever the screen is filtered to.
 *
 * The rows are read here rather than sent up from the page: the export is the
 * database's answer to the same query the index ran, so it carries every
 * matching order and not just the ones a page had already loaded. One row per
 * order, with its pieces collected into a cell — a fulfillment list is read by
 * order, not by line.
 */
export const exportOrdersAction = async (
  values: unknown,
): Promise<ActionResult<CsvExport>> => {
  const denied = await guard();
  if (denied) return denied;

  const parsed = await validate(exportPayload(), values);
  if (parsed.error) return parsed;

  try {
    const orders = await listOrders({
      search: parsed.data.search,
      status: (parsed.data.status || undefined) as FulfillmentStatus | undefined,
      payment: (parsed.data.payment || undefined) as PaymentStatus | undefined,
    });

    return ok(
      csvExport(
        "jemai-furniture-orders",
        [
          "Order",
          "Reference",
          "Customer",
          "Email",
          "Phone",
          "Placed",
          "Items",
          "Subtotal",
          "Shipping",
          "Total",
          "Paid",
          "Payment",
          "Fulfillment",
          "Delivery address",
          "Notes",
        ],
        orders.map((order) => [
          order.number,
          order.reference,
          order.customer,
          order.email,
          order.phone,
          formatOrderDate(order.placedAt),
          order.items
            .map((item) => `${item.name} × ${item.quantity} (${describeItem(item)})`)
            .join("; "),
          String(order.subtotal),
          String(order.shipping),
          String(order.total),
          order.amountPaid === null ? "" : String(order.amountPaid),
          order.payment,
          order.status,
          order.address,
          order.notes,
        ]),
      ),
    );
  } catch (error) {
    return failWith("Could not build that export. Try again.", error);
  }
};
