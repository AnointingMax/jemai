import Image from "next/image";
import Link from "next/link";
import type { Exhibition } from "@/lib/exhibitions";

/**
 * The 411 × 434 card both listing frames use: a 411 × 341 `surface-subtle` mat
 * holding the work at its own aspect with 8px of clearance, then the title and
 * a second line inset 17px, closing on a `border-default` box.
 *
 * **The export only shows the box's right and bottom hairlines.** Left and top
 * fall exactly on the mat's edge and never register in the pixels, so the full
 * border is inferred from the artworks catalogue card, which is drawn the same
 * way. Worth a second look if a cleaner export ever lands.
 */
export const ExhibitionCard = ({
  exhibition,
  href,
}: {
  exhibition: Exhibition;
  href: string;
}) => (
  <Link
    href={href}
    className="border-border-default hover:border-border-strong/60 group flex flex-col border transition-colors"
  >
    {/* `fill` rather than an intrinsic image on purpose: an intrinsic one taller
        than the aspect box wins over `aspect-ratio` and stretches the card, so
        cards in the same row came out different heights. */}
    <div className="bg-surface-subtle relative aspect-411/341 w-full">
      <Image
        src={exhibition.card.src}
        alt={exhibition.card.alt}
        fill
        sizes="(min-width: 1024px) 411px, (min-width: 640px) 50vw, 100vw"
        className="object-contain p-2 transition-transform duration-500 group-hover:scale-[1.02]"
      />
    </div>
    <div className="px-4.25 pt-4 pb-5.5">
      <p className="text-h4 text-text-primary">
        {exhibition.title}
      </p>
      {/* 14px uppercase on the eyebrow tracking — a size no `--text-*` token
            carries, so it is `text-body-sm` plus the eyebrow letter-spacing. */}
      <p className="text-body-sm text-text-secondary mt-1.5 uppercase tracking-[0.08em]">
        {exhibition.cardMeta}
      </p>
    </div>
  </Link>
);
