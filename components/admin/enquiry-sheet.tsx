"use client";

import { useState } from "react";
import Link from "next/link";
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
  describeArtwork,
  enquiredOn,
  enquiryStatuses,
  type AdminEnquiry,
  type EnquiryStatus,
} from "@/lib/admin/enquiries";

type EnquirySheetProps = {
  /** Null keeps the sheet closed; setting an enquiry opens it on that record. */
  enquiry: AdminEnquiry | null;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (status: EnquiryStatus) => void;
};

/**
 * The enquiry detail sheet, built on the order sheet's shape: the record's
 * panels, then the one control that changes anything. The status select is a
 * draft until "Update status" commits it, so closing the sheet leaves the
 * enquiry where it was.
 */
export const EnquirySheet = ({ enquiry, onOpenChange, onStatusChange }: EnquirySheetProps) => (
  <Sheet open={Boolean(enquiry)} onOpenChange={onOpenChange}>
    <SheetContent
      side="right"
      showCloseButton={false}
      // The sheet portals to `body`, outside the console's wrapper, so it has to
      // carry `admin-surface` itself or it lands on the storefront tokens.
      className="admin-surface bg-background gap-0 p-0 data-[side=right]:w-full sm:max-w-[380px]"
    >
      {/* Keyed on the enquiry so the status draft resets between records. */}
      {enquiry ? (
        <EnquirySheetBody key={enquiry.id} enquiry={enquiry} onStatusChange={onStatusChange} />
      ) : null}
    </SheetContent>
  </Sheet>
);

const EnquirySheetBody = ({
  enquiry,
  onStatusChange,
}: {
  enquiry: AdminEnquiry;
  onStatusChange: (status: EnquiryStatus) => void;
}) => {
  const [status, setStatus] = useState<EnquiryStatus>(enquiry.status);

  /* The reply opens in the reader's own mail client with the piece already in
     the subject — the console sends nothing itself. */
  const reply = `mailto:${enquiry.email}?subject=${encodeURIComponent(
    `Your enquiry about ${enquiry.artworkTitle}`
  )}`;

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-6">
        <div className="border-border-default flex flex-col gap-3 rounded-lg border p-4">
          <div className="flex items-center gap-3">
            {/* Same accent the order sheet uses for its record number; the style
                guide publishes no accent orange, so it stays literal hex. */}
            <span className="text-eyebrow-lg text-[#c2410c] whitespace-nowrap uppercase">
              Enquiry {enquiry.id}
            </span>
            <StatusBadge status={enquiry.status} />
            <SheetClose asChild>
              <Button variant="ghost" size="icon-sm" className="ml-auto">
                <X aria-hidden />
                <span className="sr-only">Close</span>
              </Button>
            </SheetClose>
          </div>
          <SheetTitle className="text-text-primary font-sans text-xl font-semibold">
            {enquiry.artworkTitle}
          </SheetTitle>
          <SheetDescription className="text-text-secondary text-sm">
            {enquiry.artist} · {enquiredOn(enquiry)}
          </SheetDescription>
        </div>

        <hr className="border-border-default border-t border-dotted" />

        <SheetPanel label="Enquirer">
          <p className="text-text-primary text-base">{enquiry.name}</p>
          <div className="flex flex-col gap-1">
            <ContactLink href={`mailto:${enquiry.email}`}>{enquiry.email}</ContactLink>
            <ContactLink href={`tel:${enquiry.phone.replace(/\s/g, "")}`}>
              {enquiry.phone}
            </ContactLink>
          </div>
        </SheetPanel>

        <SheetPanel label="Artwork">
          <p className="text-text-primary text-base">{describeArtwork(enquiry)}</p>
          {/* The enquiry is locked to a piece, so the record is one hop away. */}
          <Link
            href={`/admin/artworks/${enquiry.artworkSlug}`}
            className="text-action-link focus-visible:ring-ring/50 w-fit rounded-sm text-sm underline-offset-4 outline-none hover:underline focus-visible:ring-3"
          >
            Open artwork record
          </Link>
        </SheetPanel>

        <SheetPanel label="Message">
          <p className="text-text-primary text-sm whitespace-pre-line">{enquiry.message}</p>
        </SheetPanel>

        <div className="flex flex-col gap-1.5">
          <FieldLabel htmlFor="enquiry-status">Enquiry status</FieldLabel>
          <Select value={status} onValueChange={(value) => setStatus(value as EnquiryStatus)}>
            <SelectTrigger
              id="enquiry-status"
              className="bg-admin-field border-border-default text-text-primary h-11 w-full rounded-lg text-sm"
            >
              <SelectValue />
            </SelectTrigger>
            {/* Portalled to `body` like the sheet, so it needs the console
                surface too or it comes back square-cornered. */}
            <SelectContent className="admin-surface bg-popover">
              {enquiryStatuses.map((value) => (
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
