import Image from "next/image";
import { SectionIntro } from "@/components/site/section-intro";
import { ConsultationCta } from "@/components/site/consultation-cta";

/**
 * The rail is four photographs, not four links. Each card pointed at its own
 * `/about#…` anchor — `#lanier-house` and its three siblings — and none of them
 * exists: the About page defines only `art`, `design`, `exhibitions` and
 * `furniture`. There is no project model and no project page behind them
 * either, so the cards show the work rather than promising a page about it.
 */
const spaces = [
  {
    name: "Lanier House",
    meta: "Residential · Lagos",
    image: "/figma/home/sp-lanier.jpg",
  },
  {
    name: "Soho Ballroom",
    meta: "Hospitality · Lagos",
    image: "/figma/home/sp-soho.jpg",
  },
  {
    name: "Bathhouse Studios",
    meta: "Retail · Lagos",
    image: "/figma/home/sp-bathhouse.jpg",
  },
  {
    name: "House in the Woods",
    meta: "Workplace · Abuja",
    image: "/figma/home/sp-woods.jpg",
  },
];

export const ArchitectureSection = () => (
  <section className="flex w-full flex-col items-center gap-stack-loose pt-8 lg:pt-16">
    <div className="flex w-full max-w-432 flex-col gap-stack-loose px-4 sm:px-6 lg:px-page-gutter">
      <hr className="border-border-strong w-full border-t-3" />
      <div className="flex w-full flex-col items-center py-8">
        <SectionIntro
          className="max-w-270 gap-2.5"
          eyebrow="05 / JEMAI Designs"
          heading="Spaces Shaped by Purpose, Personality and Space"
          copy="From private homes to public spaces, discover considered environments shaped around the people, purpose and possibilities within them."
        />
      </div>
    </div>

    {/* Featured spaces — a rail that runs off the right edge of the page */}
    <div className="flex w-full flex-col gap-14 pb-3 pl-4 sm:pl-6 lg:pl-page-gutter">
      <ul className="flex gap-7 overflow-x-auto pr-4 sm:pr-6 lg:pr-page-gutter scrollbar-none [&::-webkit-scrollbar]:hidden">
        {spaces.map((space) => (
          <li key={space.name} className="flex w-70 shrink-0 flex-col gap-2.5 sm:w-82.5">
            <div className="relative aspect-square w-full overflow-hidden bg-[#e9e6de]">
              <Image
                src={space.image}
                alt={space.name}
                fill
                sizes="(min-width: 640px) 330px, 280px"
                className="object-cover"
              />
            </div>
            <p className="text-eyebrow-lg text-text-secondary pt-2.5 uppercase">
              {space.meta}
            </p>
          </li>
        ))}
      </ul>
      <div className="mr-4 h-px bg-black/10 sm:mr-6 lg:mr-page-gutter">
        <div className="h-px w-[69.23%] bg-black/55" />
      </div>
    </div>

    <ConsultationCta />
  </section>
);
