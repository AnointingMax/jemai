"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Shot } from "@/lib/exhibitions";

/**
 * The installation rail on the past-detail frame: 1088 × 762 slides on a 20px
 * gutter, starting 10px right of the page gutter and running off the right edge
 * of the page. The frame's counter reads "1/12"; it counts the exhibition's own
 * media instead, which is however many the console uploaded.
 *
 * The counter is right-aligned to the *first* slide's right edge, which is
 * where the frame puts it.
 */
export const InstallRail = ({ shots }: { shots: Shot[]; }) => {
  const railRef = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);

  /* The counter follows the rail rather than driving it — the frame draws no
     arrows here, so scrolling (or a swipe) is the only control. */
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const onScroll = () => {
      const first = rail.firstElementChild as HTMLElement | null;
      if (!first) return;
      const pitch = first.offsetWidth + 20;
      setIndex(Math.round(rail.scrollLeft / pitch));
    };
    rail.addEventListener("scroll", onScroll, { passive: true });
    return () => rail.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section aria-label="Installation views" className="w-full">
      <ul
        ref={railRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 sm:px-6 lg:pr-0 lg:pl-18.5"
      >
        {shots.map((shot) => (
          <li
            key={shot.src}
            className="w-[min(1088px,86vw)] shrink-0 snap-start"
          >
            <div className="relative aspect-1088/762 w-full">
              <Image
                src={shot.src}
                alt={shot.alt}
                fill
                sizes="(min-width: 1024px) 1088px, 86vw"
                className="object-cover"
              />
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-3.75 w-full px-4 sm:px-6 lg:pr-0 lg:pl-18.5">
        <p className="text-body-sm text-text-secondary w-[min(1088px,86vw)] text-right">
          {index + 1}/{shots.length}
        </p>
      </div>
    </section>
  );
};
