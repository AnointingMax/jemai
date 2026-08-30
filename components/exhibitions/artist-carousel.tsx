"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { ArtistPanel } from "@/components/exhibitions/artist-panel";
import { Button } from "@/components/ui/button";
import type { ArtistNote } from "@/lib/exhibitions";

/**
 * A group show's artists, one at a time — the same arrangement the home page's
 * Curator's Pick uses: an arrow pair under the biography it advances, wrapping
 * at both ends so neither arrow is ever dead, and the arrow keys driving it for
 * anyone on a keyboard.
 *
 * The arrows are lucide chevrons rather than the exported arrow SVGs those
 * buttons carry: the exports are `#F7F5F3`, drawn to sit on Curator's Pick's
 * dark scrim, and this block sits on the page's own white.
 */
export const ArtistCarousel = ({ notes }: { notes: ArtistNote[]; }) => {
  const [index, setIndex] = useState(0);
  const count = notes.length;
  const go = (delta: number) => setIndex((at) => (at + delta + count) % count);

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label="About the artists"
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          go(-1);
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          go(1);
        }
      }}
      aria-live="polite"
    >
      <ArtistPanel
        note={notes[index]}
        showName
        controls={
          <div className="flex items-center gap-3.5">
            {([
              { label: "Previous", delta: -1, Icon: ChevronLeft },
              { label: "Next", delta: 1, Icon: ChevronRight },
            ] as const).map(({ label, delta, Icon }) => (
              <Button
                key={label}
                type="button"
                variant="quiet"
                onClick={() => go(delta)}
                aria-label={`${label} artist`}
                className="border-border-strong text-action-primary size-10 rounded-full border bg-transparent hover:bg-black/5"
              >
                <Icon aria-hidden className="size-3.5" />
              </Button>
            ))}
            {/* The install rail counts its slides the same way, in the same place. */}
            <p className="text-body-sm text-text-secondary">
              {index + 1}/{count}
            </p>
          </div>
        }
      />
    </div>
  );
};
