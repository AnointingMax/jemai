import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionIntro } from "@/components/site/section-intro";
import { PhotoRail, type RailPhoto } from "@/components/site/photo-rail";

const highlights: RailPhoto[] = [
  { src: "/figma/home/ex-slide-1.jpg", alt: "Visitor viewing a painted figure study" },
  { src: "/figma/home/ex-slide-2.jpg", alt: "A guest studying a portrait in the gallery" },
  { src: "/figma/home/ex-slide-3.jpg", alt: "Bronze figures on a plinth" },
  { src: "/figma/home/ex-slide-4.jpg", alt: "Painted works hung salon style" },
];

/* Only four exhibition photographs are exported, and four fit on screen at
   desktop — which left the slide picker with nowhere to go. Running the set
   twice gives the rail something to scroll. Swap in real photography and drop
   the repeat. */
const slides: RailPhoto[] = [...highlights, ...highlights];

export const ExhibitionsSection = () => (
  <section className="flex w-full flex-col items-center pt-8 lg:pt-16">
    <div className="flex w-full max-w-432 flex-col gap-stack-loose px-4 sm:px-6 lg:px-page-gutter">
      <hr className="border-border-strong w-full border-t-3" />

      <div className="flex w-full flex-col items-center gap-stack-loose py-8">
        <SectionIntro
          className="max-w-270 gap-2"
          eyebrow="04 / Exhibitions"
          heading="Where Art, Artists and Audiences Meet"
          copy="Step inside JEMAI’s exhibitions, conversations and creative encounters—bringing new work, fresh perspectives and our wider creative community together."
          cta={{ label: "Explore Exhibitions", href: "/exhibitions" }}
        />

        <PhotoRail photos={slides} label="Exhibition highlights" />
      </div>
    </div>

    {/* Up next — half-bleed photograph beside the featured exhibition */}
    <div className="bg-surface-subtle flex w-full flex-col lg:h-225 lg:flex-row">
      <div className="relative h-105 w-full lg:h-full lg:w-1/2">
        <Image
          src="/figma/home/ex-sculpture.jpg"
          alt="Wire sculpture of a figure in a patterned room"
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>

      <div className="flex w-full flex-col items-center justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-20 lg:py-0">
        <div className="flex w-full flex-col items-center gap-stack-default">
          <div className="flex w-full flex-col items-start gap-stack-compact py-stack-default">
            <p className="text-eyebrow-lg text-text-secondary w-full text-center uppercase">
              Up Next
            </p>
            <div className="flex w-full flex-col items-center gap-2 text-center">
              <h3 className="font-heading text-text-primary text-3xl leading-tight sm:text-h2 sm:leading-11.5">
                Forms of Stillness
              </h3>
              <p className="text-body-lg text-text-secondary">
                A focused presentation of texture, repetition and the quiet
                balance between movement and rest.
              </p>
            </div>
          </div>

          <p className="text-h4 text-text-primary text-center">
            JEMAI Gallery, Lagos · 12–26 September
          </p>

          <div className="flex flex-col items-center justify-center gap-stack-default">
            <div className="relative size-70 sm:size-90 lg:size-100">
              <Image
                src="/figma/home/ex-bust.jpg"
                alt="Gilded bust sculpture on a plinth"
                fill
                sizes="(min-width: 1024px) 400px, 280px"
                className="object-cover"
              />
            </div>
            <Button asChild size="cta" className="min-w-37">
              <Link href="/exhibitions/forms-of-stillness">Register to Attend</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  </section>
);
