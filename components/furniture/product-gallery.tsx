"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type ProductGalleryProps = {
  name: string;
  images: string[];
};

/**
 * Main shot over a thumbnail rail. The frame draws the main image at 578 × 580
 * inside a 40px padded panel, and four 80px thumbnails 8px apart beneath it.
 */
export const ProductGallery = ({ name, images }: ProductGalleryProps) => {
  const [active, setActive] = useState(0);

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="relative aspect-[578/580] w-full overflow-hidden bg-[#efede9]">
        <Image
          key={images[active]}
          src={images[active]}
          alt={name}
          fill
          priority
          sizes="(min-width: 1024px) 578px, 100vw"
          className="object-cover"
        />
      </div>

      {/* The rail scrolls on narrow screens rather than wrapping 3-and-1. */}
      {images.length > 1 && (
        <ul className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {images.map((src, index) => (
            <li key={src} className="shrink-0">
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-label={`View ${index + 1} of ${images.length}`}
                aria-current={index === active ? "true" : undefined}
                className={cn(
                  "relative block size-20 overflow-hidden border bg-white transition-colors",
                  index === active
                    ? "border-border-strong"
                    : "border-border-default hover:border-border-strong/60",
                )}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
