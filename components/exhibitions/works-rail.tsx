import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { ExhibitionWork } from "@/lib/exhibitions";

/**
 * The four works the past-detail frame rails below its copy — 300px columns on
 * a 24px gutter, each image at its own natural height, so the row is
 * top-aligned and every caption and button sits directly under its own image.
 *
 * The rail runs its own 1272px measure (x 84 → 1356), 20px inside the page
 * gutter on both sides.
 */
export const WorksRail = ({ works }: { works: ExhibitionWork[]; }) => (
  <section
    aria-label="Works in this exhibition"
    className="w-full px-4 sm:px-6 lg:px-page-gutter"
  >
    <ul className="mx-auto grid w-full max-w-[1272px] grid-cols-2 items-start gap-x-6 gap-y-10 lg:grid-cols-4">
      {works.map((work) => (
        <li key={work.src}>
          <Image
            src={work.src}
            alt={work.alt}
            width={work.width}
            height={work.height}
            sizes="(min-width: 1024px) 300px, 50vw"
            className="h-auto w-full"
          />
          <p className="text-body-sm text-text-primary mt-[11px]">
            {work.title}, {work.year}
          </p>
          <Button asChild size="cta" className="mt-3.5 h-[41px] rounded-none border border-border-strong bg-transparent px-4 text-action-primary hover:bg-transparent">
            <Link href={work.href}>View Artwork</Link>
          </Button>
        </li>
      ))}
    </ul>
  </section>
);
