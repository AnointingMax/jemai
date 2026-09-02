import Image from "next/image";
import Link from "next/link";
import type { ExhibitionSummary } from "@/lib/exhibitions";

export const ExhibitionCard = ({
  exhibition,
}: {
  exhibition: ExhibitionSummary;
}) => (
  <Link
    href={exhibition.href}
    className="border-border-default hover:border-border-strong/60 group flex flex-col border-r border-b transition-colors"
  >
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
      <p className="text-body-sm text-text-secondary mt-1.5 uppercase tracking-[0.08em]">
        {exhibition.cardMeta}
      </p>
    </div>
  </Link>
);
