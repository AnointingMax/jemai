import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionIntro } from "@/components/site/section-intro";

const spaces = [
  {
    name: "Lanier House",
    meta: "Residential · Lagos",
    image: "/figma/home/sp-lanier.jpg",
    href: "/about#lanier-house",
  },
  {
    name: "Soho Ballroom",
    meta: "Hospitality · Lagos",
    image: "/figma/home/sp-soho.jpg",
    href: "/about#soho-ballroom",
  },
  {
    name: "Bathhouse Studios",
    meta: "Retail · Lagos",
    image: "/figma/home/sp-bathhouse.jpg",
    href: "/about#bathhouse-studios",
  },
  {
    name: "House in the Woods",
    meta: "Workplace · Abuja",
    image: "/figma/home/sp-woods.jpg",
    href: "/about#house-in-the-woods",
  },
];

export const ArchitectureSection = () => (
  <section className="flex w-full flex-col items-center gap-stack-loose pt-8 lg:pt-16">
    <div className="flex w-full max-w-[1728px] flex-col gap-stack-loose px-4 sm:px-6 lg:px-page-gutter">
      <hr className="border-border-strong w-full border-t-[3px]" />
      <div className="flex w-full flex-col items-center py-8">
        <SectionIntro
          className="max-w-[1080px] gap-2.5"
          eyebrow="05 / Architecture &amp; Interiors"
          heading="Spaces Shaped by Purpose, Personality and Space"
          copy="From private homes to public spaces, discover considered environments shaped around the people, purpose and possibilities within them."
          cta={{ label: "Explore past projects", href: "/about#projects" }}
        />
      </div>
    </div>

    {/* Featured spaces — a rail that runs off the right edge of the page */}
    <div className="flex w-full flex-col gap-14 pb-3 pl-4 sm:pl-6 lg:pl-page-gutter">
      <ul className="flex gap-7 overflow-x-auto pr-4 sm:pr-6 lg:pr-page-gutter [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {spaces.map((space) => (
          <li key={space.name} className="w-[280px] shrink-0 sm:w-[330px]">
            <Link href={space.href} className="group flex flex-col gap-2.5">
              <div className="relative aspect-square w-full overflow-hidden bg-[#e9e6de]">
                <Image
                  src={space.image}
                  alt={space.name}
                  fill
                  sizes="(min-width: 640px) 330px, 280px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <p className="text-eyebrow-lg text-text-secondary pt-2.5 uppercase">
                {space.meta}
              </p>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mr-4 h-px bg-black/10 sm:mr-6 lg:mr-page-gutter">
        <div className="h-px w-[69.23%] bg-black/55" />
      </div>
    </div>

    {/* Begin a project */}
    <div className="flex w-full flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-page-gutter lg:py-0">
      <div className="flex w-full flex-col justify-center lg:flex-row lg:items-stretch">
        <div className="bg-surface-subtle flex flex-col items-start justify-between gap-stack-loose overflow-hidden p-6 sm:p-stack-loose lg:w-[560px] lg:shrink-0">
          <p className="text-eyebrow-lg max-w-[500px] uppercase text-[#ad3a00]">
            Begin A Project
          </p>
          <div className="flex flex-col items-start gap-stack-default">
            <div className="flex flex-col items-start gap-stack-compact">
              <h3 className="font-heading text-text-primary max-w-[445px] text-3xl leading-tight sm:text-[40px] sm:leading-[46px]">
                Let&rsquo;s Shape A Space That Feels Entirely Your Own.
              </h3>
              <p className="text-body-lg max-w-[375px] text-[#6d6d6d]">
                From an individual room to a complete property, JEMAI brings
                architecture, interiors, furniture and art together in one
                considered process.
              </p>
            </div>
            <Button asChild size="cta" className="px-6">
              <Link href="/consultation">Request a consultation</Link>
            </Button>
          </div>
        </div>

        <div className="relative h-[280px] w-full overflow-hidden sm:h-[360px] lg:h-[445px] lg:flex-1">
          <Image
            src="/figma/home/consultation.jpg"
            alt="A contemporary interior with a framed artwork and staircase"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
          <div aria-hidden className="absolute inset-0 bg-[rgba(19,19,19,0.1)]" />
        </div>
      </div>
    </div>
  </section>
);
