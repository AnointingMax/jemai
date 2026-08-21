"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type RailPhoto = {
  src: string;
  alt: string;
};

type PhotoRailProps = {
  photos: RailPhoto[];
  label: string;
};

/**
 * The Figma "Intro Slideshow" — a snap rail of photographs with the slide
 * picker beneath. The picker drives the scroll position and the scroll position
 * drives the picker back, so dragging the rail keeps the active dash honest.
 *
 * The dashes count *pages*, not photographs. A rail can only scroll to
 * `scrollWidth - clientWidth`, so the last screenful of slides can never be
 * brought to the left edge — one dash per slide would leave the trailing dashes
 * dead. Pages also fall out responsively: one photo per view on a phone gives a
 * dash each, four per view at desktop gives half as many.
 *
 * The rail deliberately does not centre its items: `justify-center` on an
 * overflowing flex row puts the leading items past the scroll origin, where
 * they cannot be reached.
 */
export const PhotoRail = ({ photos, label }: PhotoRailProps) => {
  const railRef = useRef<HTMLUListElement>(null);
  const [perView, setPerView] = useState(1);
  const [page, setPage] = useState(0);

  const pages = Math.max(1, Math.ceil(photos.length / perView));

  /** Distance from one slide's left edge to the next, gap included. */
  const slideStep = useCallback((rail: HTMLUListElement) => {
    const [first, second] = [rail.children[0], rail.children[1]];
    if (!first) return 0;
    if (second)
      return (
        second.getBoundingClientRect().left - first.getBoundingClientRect().left
      );
    return first.getBoundingClientRect().width;
  }, []);

  const readPage = useCallback(
    (rail: HTMLUListElement) => {
      const step = slideStep(rail);
      if (step <= 0) return 0;
      const visible = Math.max(1, Math.round(rail.clientWidth / step));
      const total = Math.max(1, Math.ceil(photos.length / visible));
      const maxScroll = rail.scrollWidth - rail.clientWidth;
      // the tail of the rail is short of a full page — pin it to the last dash
      if (maxScroll <= 1) return 0;
      if (rail.scrollLeft >= maxScroll - 1) return total - 1;
      return Math.min(total - 1, Math.round(rail.scrollLeft / (step * visible)));
    },
    [photos.length, slideStep],
  );

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const measure = () => {
      const step = slideStep(rail);
      if (step > 0) setPerView(Math.max(1, Math.round(rail.clientWidth / step)));
      setPage(readPage(rail));
    };

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setPage(readPage(rail)));
    };

    measure();
    const observer = new ResizeObserver(measure);
    // Watch a slide as well as the rail. The rail is `w-full`, so its box does
    // not change when the stylesheet lands or a breakpoint flips the slide
    // width — but the page count depends on the slide width, so measuring only
    // the rail can leave the picker stuck on its pre-layout guess.
    observer.observe(rail);
    if (rail.children[0]) observer.observe(rail.children[0]);
    rail.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      rail.removeEventListener("scroll", onScroll);
    };
  }, [readPage, slideStep]);

  const goToPage = (target: number) => {
    setPage(target);
    const rail = railRef.current;
    if (!rail) return;
    const item = rail.children[
      Math.min(target * perView, photos.length - 1)
    ] as HTMLElement | undefined;
    if (!item) return;
    // rect maths rather than offsetLeft: the rail is not the offset parent.
    // Overscroll is clamped by the browser, which is what pins the last page.
    const delta =
      item.getBoundingClientRect().left - rail.getBoundingClientRect().left;
    rail.scrollTo({ left: rail.scrollLeft + delta, behavior: "smooth" });
  };

  return (
    <div
      className="flex w-full flex-col items-center gap-grid-gutter-compact"
      role="group"
      aria-roledescription="carousel"
      aria-label={label}
    >
      <ul
        ref={railRef}
        tabIndex={0}
        aria-label={`${label} — scrollable`}
        className="flex w-full snap-x snap-mandatory items-center gap-grid-gutter-compact overflow-x-auto [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current [&::-webkit-scrollbar]:hidden"
      >
        {photos.map((photo, index) => (
          <li
            key={`${photo.src}-${index}`}
            aria-label={`Slide ${index + 1} of ${photos.length}`}
            className="relative h-[240px] w-[70%] shrink-0 snap-start overflow-hidden sm:w-[251px] lg:h-[320px]"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(min-width: 640px) 251px, 70vw"
              className="object-cover"
            />
          </li>
        ))}
      </ul>

      <div
        className="flex h-[30px] items-center justify-center"
        role="tablist"
        aria-label={label}
      >
        {Array.from({ length: pages }, (_, index) => (
          <Button
            key={index}
            type="button"
            role="tab"
            variant="quiet"
            aria-selected={index === page}
            aria-label={`Go to slide group ${index + 1} of ${pages}`}
            onClick={() => goToPage(index)}
            className="h-auto px-1.5 py-0"
          >
            <span
              className={cn(
                "block transition-all",
                index === page
                  ? "h-[4.5px] w-[45px] bg-[#666]"
                  : "h-[3px] w-[30px] bg-[rgba(51,51,51,0.25)]",
              )}
            />
          </Button>
        ))}
      </div>
    </div>
  );
};
