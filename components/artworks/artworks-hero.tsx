"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Slide = { src: string; alt: string };

type ArtworksHeroProps = {
  eyebrow: string;
  heading: string[];
  copy: string;
  slides: Slide[];
};

/**
 * The opening band: the same 1080px centred header the consultation page uses —
 * eyebrow and a 50px Classico Bold heading on a 56px line at x=180, copy at
 * x=753 — over a full-bleed gallery carousel.
 *
 * **The frame clips the carousel.** `Frame 385` is 702px tall and the
 * photograph runs to its bottom edge, so the band's real height is not
 * knowable from this export; it is held at the 1440 × 500 the export does show.
 * Worth re-exporting the unclipped node.
 */
export const ArtworksHero = ({
  eyebrow,
  heading,
  copy,
  slides,
}: ArtworksHeroProps) => {
  const [index, setIndex] = useState(0);
  const go = (step: number) =>
    setIndex((i) => (i + step + slides.length) % slides.length);

  return (
    <section className="w-full">
      <div className="w-full px-4">
        <div className="mx-auto grid max-w-270 pt-8.5 pb-1.5 lg:grid-cols-[573fr_507fr]">
          <div>
            <p className="text-eyebrow-lg text-text-secondary uppercase">
              {eyebrow}
            </p>
            <h1 className="font-heading text-text-primary mt-1.75 text-4xl font-bold sm:text-5xl lg:text-[50px] lg:leading-14">
              {heading.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>
          </div>
          <p className="text-body text-text-secondary mt-6 max-w-125 lg:mt-0 lg:pt-22.5">
            {copy}
          </p>
        </div>
      </div>

      {/* `min-h` is a derived-responsive call: 1440/500 leaves the band only
          135px tall at 390, and the frame has no mobile layout to follow. */}
      <div className="relative aspect-[1440/500] w-full min-h-70 overflow-hidden">
        {slides.map((slide, i) => (
          <Image
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            fill
            priority={i === 0}
            sizes="100vw"
            className={`object-cover transition-opacity duration-500 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous work"
          className="absolute top-1/2 left-22.5 hidden size-10 -translate-y-1/2 items-center justify-center bg-black/25 text-white backdrop-blur-[2px] transition-colors hover:bg-black/40 lg:flex"
        >
          <ChevronLeft aria-hidden className="size-5" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next work"
          className="absolute top-1/2 right-22 hidden size-10 -translate-y-1/2 items-center justify-center bg-black/25 text-white backdrop-blur-[2px] transition-colors hover:bg-black/40 lg:flex"
        >
          <ChevronRight aria-hidden className="size-5" />
        </button>

        {/* Three dashes, centred near the foot of the band. */}
        <div className="absolute bottom-10.25 left-1/2 flex -translate-x-1/2 gap-2">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show work ${i + 1}`}
              aria-current={i === index}
              className={`h-0.5 w-10 transition-colors ${
                i === index ? "bg-white" : "bg-white/35"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
