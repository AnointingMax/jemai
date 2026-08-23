"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LoadMorePager } from "@/components/shared/load-more-pager";
import { artworks, ARTWORK_PAGE_SIZE } from "@/lib/artworks";

/**
 * The catalogue grid: three columns of 383px cards on a 17px gutter, each a
 * 383 × 339 photograph over a caption inset 17px, closing on a 1px
 * `border-default` box. Rows repeat on a 449px pitch.
 *
 * The grid sits on its own 1183px measure (x 128 → 1310), narrower than the
 * page gutter the rule above it uses — as drawn.
 */
export const ArtworkGrid = () => {
  const [visible, setVisible] = useState(ARTWORK_PAGE_SIZE);
  const shown = Math.min(visible, artworks.length);

  return (
    <div className="w-full px-4 pb-16 sm:px-6">
      <div className="mx-auto w-full max-w-[1183px]">
        <div className="grid grid-cols-1 gap-[17px] sm:grid-cols-2 lg:grid-cols-3">
          {artworks.slice(0, shown).map((work) => (
            <Link
              key={work.slug}
              href={`/artworks/${work.slug}`}
              className="border-border-default hover:border-border-strong/60 group border transition-colors"
            >
              <div className="relative aspect-[383/339] w-full overflow-hidden">
                <Image
                  src={work.src}
                  alt={work.title}
                  fill
                  sizes="(min-width: 1024px) 383px, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
              <div className="px-[17px] pt-[19px] pb-[23px]">
                <p className="text-body text-text-primary font-semibold">
                  {work.title}
                </p>
                <p className="text-body-sm text-text-secondary mt-2">
                  {work.medium}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-[19px]">
          <LoadMorePager
            shown={shown}
            total={artworks.length}
            noun="pieces"
            onLoadMore={() => setVisible((n) => n + ARTWORK_PAGE_SIZE)}
          />
        </div>
      </div>
    </div>
  );
};
