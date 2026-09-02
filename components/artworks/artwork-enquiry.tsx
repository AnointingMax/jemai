"use client";

import { useState, type ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EnquireModal } from "@/components/artworks/enquire-modal";

type ArtworkEnquiryProps = {
  artwork: { slug: string; title: string; artist: string; image: string; };
  label?: string;
  variant?: ComponentProps<typeof Button>["variant"];
  className?: string;
};

/**
 * The frame's "Enquire" button — 148 × 48 of `action-primary` — and the modal
 * it opens. The button is the page's only client boundary. The curator's pick
 * borrows it too, which is why the label and chrome are overridable.
 */
export const ArtworkEnquiry = ({
  artwork,
  label = "Enquire",
  variant = "jemai",
  className,
}: ArtworkEnquiryProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size="cta"
        onClick={() => setOpen(true)}
        className={cn("w-37 border-0", className)}
      >
        {label}
      </Button>
      <EnquireModal open={open} onOpenChange={setOpen} artwork={artwork} />
    </>
  );
};
