"use client";

import { useState } from "react";
import { X } from "lucide-react";

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
  submittedOn,
  type AdminChristmasRequest,
} from "@/lib/admin/christmas-record";
import { christmasStatuses, type ChristmasStatus } from "@/lib/christmas";

/**
 * The Christmas request sheet — the same stack of panels the order, enquiry and
 * consultation sheets use.
 *
 * The status select is the console's one write, and it is the only thing that
 * spends a slot: payment is arranged outside the system, so `Paid` is an
 * administrator's record that it happened. It stays a draft until "Update
 * status" commits it, the way the consultation sheet does.
 *
 * The areas list prints every count, including a one — a column of "— 1" and
 * "— 3" reads as a quantity, where the index's summary drops the ones so the
 * numbers that matter stand out in a dense row.
 */
export const ChristmasSheet = ({
  request,
  onOpenChange,
  onStatusChange,
}: {
  /** Null keeps the sheet closed; setting a request opens it on that record. */
  request: AdminChristmasRequest | null;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (status: ChristmasStatus) => void;
}) => (
  <Sheet open={Boolean(request)} onOpenChange={onOpenChange}>
    <SheetContent
      side="right"
      showCloseButton={false}
      // The sheet portals to `body`, outside the console's wrapper, so it has to
      // carry `admin-surface` itself or it lands on the storefront tokens.
      className="admin-surface bg-background gap-0 p-0 data-[side=right]:w-full sm:max-w-[380px]"
    >
      {/* Keyed on the request so the status draft resets between records. */}
      {request ? (
        <ChristmasSheetBody
          key={request.id}
          request={request}
          onStatusChange={onStatusChange}
        />
      ) : null}
    </SheetContent>
  </Sheet>
);

const ChristmasSheetBody = ({
  request,
  onStatusChange,
}: {
  request: AdminChristmasRequest;
  onStatusChange: (status: ChristmasStatus) => void;
}) => {
  const [status, setStatus] = useState<ChristmasStatus>(request.status);

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-6">
        <div className="border-border-default flex flex-col gap-3 rounded-lg border p-4">
          <div className="flex items-center gap-3">
            {/* Same accent the other record sheets use for a reference; the
                style guide publishes no accent orange, so it stays hex. */}
            <span className="text-eyebrow-lg text-[#c2410c] whitespace-nowrap uppercase">
              Request {request.reference}
            </span>
            <StatusBadge status={request.status} />
            <SheetClose asChild>
              <Button variant="ghost" size="icon-sm" className="ml-auto">
                <X aria-hidden />
                <span className="sr-only">Close</span>
              </Button>
            </SheetClose>
          </div>
          <SheetTitle className="text-text-primary font-sans text-xl font-semibold">
            Christmas decoration
          </SheetTitle>
          <SheetDescription className="text-text-secondary text-sm">
            {submittedOn(request)}
          </SheetDescription>
        </div>

        <hr className="border-border-default border-t border-dotted" />

        <SheetPanel label="Customer">
          <p className="text-text-primary text-base">{request.name}</p>
          <div className="flex flex-col gap-1">
            <ContactLink href={`mailto:${request.email}`}>{request.email}</ContactLink>
            <ContactLink href={`tel:${request.phone.replace(/\s/g, "")}`}>
              {request.phone}
            </ContactLink>
          </div>
        </SheetPanel>

        <SheetPanel label="Property type">
          <p className="text-text-primary text-base">{request.propertyType}</p>
        </SheetPanel>

        <SheetPanel label="Decoration areas">
          <ul className="flex flex-col gap-1">
            {request.areas.map(({ area, quantity }) => (
              <li key={area} className="text-text-primary text-base">
                {area} &mdash; {quantity}
              </li>
            ))}
          </ul>
        </SheetPanel>

        <SheetPanel label="Follow-up">
          <p className="text-text-primary text-sm">
            {request.status === "Paid"
              ? "Payment has been recorded and the slot is held. Confirm the schedule with the customer."
              : "No payment has been collected. JEMAI will contact the customer within 24 hours regarding scope, quotation and payment, and the slot is held once this request is marked Paid."}
          </p>
        </SheetPanel>

        <div className="flex flex-col gap-1.5">
          <FieldLabel htmlFor="christmas-status">Request status</FieldLabel>
          <Select value={status} onValueChange={(value) => setStatus(value as ChristmasStatus)}>
            <SelectTrigger
              id="christmas-status"
              className="bg-admin-field border-border-default text-text-primary h-11 w-full rounded-lg text-sm"
            >
              <SelectValue />
            </SelectTrigger>
            {/* Portalled to `body` like the sheet, so it needs the console
                surface too or it comes back square-cornered. */}
            <SelectContent className="admin-surface bg-popover">
              {christmasStatuses.map((value) => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <SheetFooter className="border-border-default flex-row justify-end gap-3 border-t p-4">
        {/* The reply opens in the reader's own mail client with the reference
            already in the subject — the console sends nothing itself. */}
        <Button variant="outline" className="h-11 px-5" asChild>
          <a
            href={`mailto:${request.email}?subject=${encodeURIComponent(
              `Your Christmas consultation request ${request.reference}`,
            )}`}
          >
            Reply by email
          </a>
        </Button>
        <SheetClose asChild>
          <Button className="h-11 px-5" onClick={() => onStatusChange(status)}>
            Update status
          </Button>
        </SheetClose>
      </SheetFooter>
    </>
  );
};
