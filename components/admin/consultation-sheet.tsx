"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { FieldLabel } from "@/components/admin/form-section";
import { ContactLink, DetailRow, SheetPanel } from "@/components/admin/record-panels";
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
  consultationStatuses,
  consultationWindow,
  requestedOn,
  type AdminConsultation,
  type ConsultationStatus,
} from "@/lib/admin/consultation-record";

type ConsultationSheetProps = {
  /** Null keeps the sheet closed; setting a request opens it on that record. */
  request: AdminConsultation | null;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (status: ConsultationStatus) => void;
};

/**
 * The consultation detail sheet — the same shape as the order and enquiry
 * sheets, with the brief's shorter fields collected into a details list so the
 * summary is the one thing that reads as prose. The status select is a draft
 * until "Update status" commits it.
 */
export const ConsultationSheet = ({
  request,
  onOpenChange,
  onStatusChange,
}: ConsultationSheetProps) => (
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
        <ConsultationSheetBody
          key={request.id}
          request={request}
          onStatusChange={onStatusChange}
        />
      ) : null}
    </SheetContent>
  </Sheet>
);

const ConsultationSheetBody = ({
  request,
  onStatusChange,
}: {
  request: AdminConsultation;
  onStatusChange: (status: ConsultationStatus) => void;
}) => {
  const [status, setStatus] = useState<ConsultationStatus>(request.status);

  /* The reply opens in the reader's own mail client with the brief already in
     the subject — the console sends nothing itself. */
  const reply = `mailto:${request.email}?subject=${encodeURIComponent(
    `Your ${request.projectType.toLowerCase()} consultation request`
  )}`;

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-6">
        <div className="border-border-default flex flex-col gap-3 rounded-lg border p-4">
          <div className="flex items-center gap-3">
            {/* Same accent the order and enquiry sheets use for a record number;
                the style guide publishes no accent orange, so it stays hex. */}
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
            {request.projectType}
          </SheetTitle>
          <SheetDescription className="text-text-secondary text-sm">
            {request.name} · {requestedOn(request)}
          </SheetDescription>
        </div>

        <hr className="border-border-default border-t border-dotted" />

        <SheetPanel label="Client">
          <p className="text-text-primary text-base">{request.name}</p>
          <div className="flex flex-col gap-1">
            <ContactLink href={`mailto:${request.email}`}>{request.email}</ContactLink>
            <ContactLink href={`tel:${request.phone.replace(/\s/g, "")}`}>
              {request.phone}
            </ContactLink>
          </div>
        </SheetPanel>

        <SheetPanel label="Brief">
          {/* Dates and budget are optional on the storefront form, so each row
              has to be able to say nothing was given. */}
          <dl className="flex flex-col">
            <DetailRow label="Project type" value={request.projectType} />
            <DetailRow label="Timeline" value={consultationWindow(request)} />
            <DetailRow label="Budget" value={request.budget || "Not given"} />
          </dl>
        </SheetPanel>

        <SheetPanel label="Project summary">
          <p className="text-text-primary text-sm whitespace-pre-line">{request.summary}</p>
        </SheetPanel>

        <div className="flex flex-col gap-1.5">
          <FieldLabel htmlFor="consultation-status">Request status</FieldLabel>
          <Select value={status} onValueChange={(value) => setStatus(value as ConsultationStatus)}>
            <SelectTrigger
              id="consultation-status"
              className="bg-admin-field border-border-default text-text-primary h-11 w-full rounded-lg text-sm"
            >
              <SelectValue />
            </SelectTrigger>
            {/* Portalled to `body` like the sheet, so it needs the console
                surface too or it comes back square-cornered. */}
            <SelectContent className="admin-surface bg-popover">
              {consultationStatuses.map((value) => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <SheetFooter className="border-border-default flex-row justify-end gap-3 border-t p-4">
        <Button variant="outline" className="h-11 px-5" asChild>
          <a href={reply}>Reply by email</a>
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
