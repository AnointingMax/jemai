"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EnquireModal } from "@/components/artworks/enquire-modal";

/**
 * The frame's "Enquire" button — 148 × 48 of `action-primary` — and the modal
 * it opens. The button is the page's only client boundary.
 */
export const ArtworkEnquiry = ({
  artwork,
}: {
  artwork: { title: string; artist: string; image: string; };
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="jemai"
        size="cta"
        onClick={() => setOpen(true)}
        className="w-37 border-0"
      >
        Enquire
      </Button>
      <EnquireModal open={open} onOpenChange={setOpen} artwork={artwork} />
    </>
  );
};
