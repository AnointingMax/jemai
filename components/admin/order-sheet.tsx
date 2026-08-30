"use client";

import { useState } from "react";
import { Check, LocateFixed, X } from "lucide-react";

import { FieldLabel } from "@/components/admin/form-section";
import { ContactLink, SheetPanel } from "@/components/admin/record-panels";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  describeItem,
  fulfillmentStatuses,
  naira,
  orderTimeline,
  type AdminOrder,
  type FulfillmentStatus,
} from "@/lib/admin/order-record";
import { cn } from "@/lib/utils";

/**
 * The fulfillment timeline. Every stage is drawn whether or not the order has
 * reached it — the pending ones as a grey node on a dotted rail, so the reader
 * can see what is still ahead as well as what has happened.
 */
const Timeline = ({ order }: { order: AdminOrder; }) => {
  const entries = orderTimeline(order);

  return (
    <ol className="flex flex-col">
      {entries.map((entry, index) => (
        <li key={entry.label} className="relative flex min-h-12 items-center gap-3 pb-6 last:pb-0">
          {index < entries.length - 1 ? (
            <span
              aria-hidden
              className={cn(
                "absolute top-6 bottom-0 left-3 -translate-x-1/2 border-l-2",
                entries[index + 1].done
                  ? "border-solid border-[#16a34a]"
                  : "border-dotted border-[#828f9d]"
              )}
            />
          ) : null}

          <span
            aria-hidden
            className={cn(
              "relative z-1 grid size-6 shrink-0 place-items-center rounded-full",
              entry.done ? "bg-[#16a34a]" : ""
            )}
          >
            {entry.done ? (
              <Check className="size-3.5 text-white" strokeWidth={3} />
            ) : (
              <span className="size-2.5 rounded-full bg-[#828f9d]" />
            )}
          </span>

          <span className="text-text-primary text-sm whitespace-nowrap">{entry.label}</span>
          {entry.stamp ? (
            <>
              <span aria-hidden className="border-border-default min-w-4 flex-1 border-b border-dotted" />
              <span className="text-text-secondary shrink-0 text-xs">{entry.stamp}</span>
            </>
          ) : null}
        </li>
      ))}
    </ol>
  );
};

type OrderSheetProps = {
  /** Null keeps the sheet closed; setting an order opens it on that record. */
  order: AdminOrder | null;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (status: FulfillmentStatus) => void;
};

/**
 * The order detail sheet. It is the only place fulfillment moves, so the select
 * is a draft until "Update status" commits it — closing the sheet without
 * pressing it leaves the order where it was.
 */
export const OrderSheet = ({ order, onOpenChange, onStatusChange }: OrderSheetProps) => (
  <Sheet open={Boolean(order)} onOpenChange={onOpenChange}>
    <SheetContent
      side="right"
      showCloseButton={false}
      // The sheet portals to `body`, outside the console's wrapper, so it has to
      // carry `admin-surface` itself or it lands on the storefront tokens.
      className="admin-surface bg-background gap-0 p-0 data-[side=right]:w-full sm:max-w-[380px]"
    >
      {/* Keyed on the order so the status draft resets between records. */}
      {order ? <OrderSheetBody key={order.id} order={order} onStatusChange={onStatusChange} /> : null}
    </SheetContent>
  </Sheet>
);

const OrderSheetBody = ({
  order,
  onStatusChange,
}: {
  order: AdminOrder;
  onStatusChange: (status: FulfillmentStatus) => void;
}) => {
  const [status, setStatus] = useState<FulfillmentStatus>(order.status);

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-6">
        <div className="border-border-default flex flex-col gap-3 rounded-lg border p-4">
          <div className="flex items-center gap-3">
            {/* Sampled off the frame; the style guide publishes no accent
                orange, so it stays literal hex here. */}
            <span className="text-eyebrow-lg text-[#c2410c] whitespace-nowrap uppercase">
              Order {order.number}
            </span>
            <StatusBadge status={order.status} />
            <SheetClose asChild>
              <Button variant="ghost" size="icon-sm" className="ml-auto">
                <X aria-hidden />
                <span className="sr-only">Close</span>
              </Button>
            </SheetClose>
          </div>
          <SheetTitle className="text-text-primary font-sans text-xl font-semibold">
            {order.items[0]?.name ?? "Order"}
            {order.items.length > 1 ? ` + ${order.items.length - 1} more` : ""}
          </SheetTitle>
          <SheetDescription className="sr-only">
            Customer, items, delivery address and fulfillment history for order {order.number}.
          </SheetDescription>
        </div>

        <hr className="border-border-default border-t border-dotted" />

        <SheetPanel label="Customer">
          <p className="text-text-primary text-base">{order.customer}</p>
          <div className="flex flex-col gap-1">
            <ContactLink href={`mailto:${order.email}`}>{order.email}</ContactLink>
            <ContactLink href={`tel:${order.phone.replace(/\s/g, "")}`}>{order.phone}</ContactLink>
          </div>
        </SheetPanel>

        <SheetPanel label="Order items">
          {order.items.map((line) => (
            <div key={`${line.name}-${line.colour}-${line.size}`} className="flex flex-col gap-1">
              <p className="text-text-primary text-base">
                {line.name} × {line.quantity}
              </p>
              <p className="text-text-secondary text-sm">{describeItem(line)}</p>
            </div>
          ))}
        </SheetPanel>

        {/* Payment is a separate axis from fulfillment and is never edited here:
            it moves on what Paystack says about the reference below it. */}
        <SheetPanel label="Payment">
          <div className="flex items-center gap-3">
            <StatusBadge status={order.payment} />
            <span className="text-text-primary text-base">{naira(order.total)}</span>
          </div>
          <dl className="text-text-secondary flex flex-col gap-1 text-sm">
            <div className="flex justify-between gap-4">
              <dt>Subtotal</dt>
              <dd className="text-text-primary">{naira(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Shipping</dt>
              <dd className="text-text-primary">{naira(order.shipping)}</dd>
            </div>
            {order.amountPaid === null ? null : (
              <div className="flex justify-between gap-4">
                <dt>Settled</dt>
                <dd className="text-text-primary">{naira(order.amountPaid)}</dd>
              </div>
            )}
          </dl>
          {/* The reference is what a buyer quotes when they write in about a
              payment, and what Paystack is searched by at the other end. */}
          <p className="text-text-secondary text-xs break-all">Reference {order.reference}</p>
        </SheetPanel>

        <SheetPanel label="Delivery">
          <p className="text-text-primary flex items-start gap-2 text-base">
            <LocateFixed aria-hidden className="mt-0.5 size-5 shrink-0 text-[#16a34a]" />
            {order.address}
          </p>
          {order.notes ? (
            <p className="text-text-secondary text-sm">{order.notes}</p>
          ) : null}
        </SheetPanel>

        <div className="flex flex-col gap-1.5">
          <FieldLabel htmlFor="fulfillment-status">Fulfillment status</FieldLabel>
          <Select value={status} onValueChange={(value) => setStatus(value as FulfillmentStatus)}>
            <SelectTrigger
              id="fulfillment-status"
              className="bg-admin-field border-border-default text-text-primary h-11 w-full rounded-lg text-sm"
            >
              <SelectValue />
            </SelectTrigger>
            {/* Portalled to `body` like the sheet, so it needs the console
                surface too or it comes back square-cornered. */}
            <SelectContent className="admin-surface bg-popover">
              {fulfillmentStatuses.map((value) => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <SheetPanel label="Status history">
          <Timeline order={order} />
        </SheetPanel>
      </div>

      <SheetFooter className="border-border-default flex-row justify-end gap-3 border-t p-4">
        <Button variant="outline" className="h-11 px-5" onClick={() => window.print()}>
          Print order
        </Button>
        <SheetClose asChild>
          <Button
            className="h-11 px-5"
            onClick={() => onStatusChange(status)}
          >
            Update status
          </Button>
        </SheetClose>
      </SheetFooter>
    </>
  );
};
