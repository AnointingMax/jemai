"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export type CuratorPick = {
  /** Artwork title — the h3 in the copy panel. */
  title: string;
  copy: string;
  href: string;
  image: { src: string; alt: string };
  /** Caption under the framed work. */
  medium: string;
  dimensions: string;
};

type CuratorCarouselProps = {
  picks: CuratorPick[];
};

/**
 * Curator's Pick — the copy panel and the framed work advance together, driven
 * by the arrow pair the frame puts under the panel. Wraps at both ends so the
 * arrows are never dead.
 */
export const CuratorCarousel = ({ picks }: CuratorCarouselProps) => {
  const [index, setIndex] = useState(0);
  const count = picks.length;
  const pick = picks[index];

  const go = (delta: number) => setIndex((i) => (i + delta + count) % count);

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label="Curator's Pick"
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") { event.preventDefault(); go(-1); }
        if (event.key === "ArrowRight") { event.preventDefault(); go(1); }
      }}
      className="relative flex w-full flex-col items-center justify-center gap-6 py-10 lg:flex-row lg:items-end lg:py-[60px]"
    >
      <div className="flex w-full flex-col items-end gap-2.5 lg:w-[828px]">
        <div
          key={index}
          className="animate-in fade-in flex w-full flex-col gap-stack-heading bg-[rgba(22,5,7,0.73)] p-6 duration-500 sm:p-stack-loose"
          aria-live="polite"
          aria-atomic
        >
          <p className="text-eyebrow-lg max-w-[650px] uppercase text-white">
            Curator&rsquo;s Pick
          </p>
          <div className="text-text-inverse flex w-full flex-col gap-stack-compact">
            <h3 className="font-heading text-2xl leading-snug sm:text-h3">
              {pick.title}
            </h3>
            <p className="text-body">{pick.copy}</p>
          </div>
          <Button
            asChild
            size="cta"
            variant="outline"
            className="border-border-inverse text-text-inverse min-w-[148px] self-start bg-transparent hover:bg-white/10 hover:text-white"
          >
            <Link href={pick.href}>View Artwork</Link>
          </Button>
        </div>

        <div className="flex items-center gap-3.5 px-stack-default py-stack-copy">
          {([
            { label: "Previous", delta: -1, icon: "/figma/icons/arrow-left.svg" },
            { label: "Next", delta: 1, icon: "/figma/icons/arrow-right.svg" },
          ] as const).map(({ label, delta, icon }) => (
            <Button
              key={label}
              type="button"
              variant="quiet"
              onClick={() => go(delta)}
              aria-label={`${label} artwork`}
              className="size-10 rounded-full border border-white bg-transparent text-white hover:bg-white/10 hover:text-white focus-visible:border-white focus-visible:ring-white/50"
            >
              <Image src={icon} alt="" width={14} height={14} unoptimized />
            </Button>
          ))}
          <span className="sr-only" aria-live="polite">
            Artwork {index + 1} of {count}
          </span>
        </div>
      </div>

      <Link
        key={pick.image.src}
        href={pick.href}
        className="animate-in fade-in flex w-full max-w-[372px] flex-col gap-stack-compact bg-[#f6f6f6] px-3 pt-4 pb-8 duration-500"
      >
        <div className="relative h-[300px] w-full lg:h-[370px]">
          <Image
            src={pick.image.src}
            alt={pick.image.alt}
            fill
            sizes="372px"
            className="object-cover"
          />
        </div>
        <div className="flex w-full flex-col items-center gap-0.5 text-center">
          <p className="text-body-lg text-[#202020]">{pick.medium}</p>
          <p className="text-body text-action-secondary-content">
            {pick.dimensions}
          </p>
        </div>
      </Link>
    </div>
  );
};
