"use client";

import Image from "next/image";
import { Check } from "lucide-react";

import type { Artwork } from "@/lib/gallery";
import { cn } from "@/lib/utils";

/**
 * The Featured Artworks grid: every piece in the catalogue as a tile, the linked
 * ones ringed. The frame draws selection as a thick claret border with padding
 * inside it, so a selected tile insets rather than growing the cell.
 */
export const ArtworkPicker = ({
  artworks,
  selected,
  onChange,
}: {
  artworks: Artwork[];
  selected: string[];
  onChange: (slugs: string[]) => void;
}) => {
  const toggle = (slug: string) =>
    onChange(
      selected.includes(slug) ? selected.filter((held) => held !== slug) : [...selected, slug]
    );

  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {artworks.map((artwork) => {
        const on = selected.includes(artwork.slug);
        return (
          <li key={artwork.slug}>
            <button
              type="button"
              aria-pressed={on}
              onClick={() => toggle(artwork.slug)}
              className={cn(
                "focus-visible:ring-ring/50 relative block w-full cursor-pointer overflow-hidden rounded-md border-2 outline-none focus-visible:ring-3",
                on ? "border-action-primary p-1" : "border-transparent"
              )}
            >
              <span className="bg-surface-subtle relative block aspect-4/3 w-full overflow-hidden rounded-sm">
                <Image
                  src={artwork.src}
                  alt={artwork.title}
                  fill
                  sizes="(min-width: 640px) 220px, 45vw"
                  className="object-cover"
                />
              </span>
              {on ? (
                <span className="bg-action-primary text-action-primary-content absolute top-2 right-2 flex size-5 items-center justify-center rounded-full">
                  <Check aria-hidden className="size-3" />
                </span>
              ) : null}
              <span className="sr-only">{artwork.title}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
};
