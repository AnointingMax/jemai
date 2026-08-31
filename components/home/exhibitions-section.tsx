import Image from "next/image";
import { RegisterButton } from "@/components/exhibitions/register-button";
import { SectionIntro } from "@/components/site/section-intro";
import { PhotoRail } from "@/components/site/photo-rail";
import type { Shot, UpNext } from "@/lib/exhibitions";

export const ExhibitionsSection = ({
  highlights,
  upNext,
}: {
  highlights: Shot[];
  upNext: UpNext | null;
}) => (
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

        <PhotoRail photos={highlights} label="Exhibition highlights" />
      </div>
    </div>

    {/* Up next — half-bleed photograph beside the featured exhibition */}
    {upNext ? (
      <div className="bg-surface-subtle flex w-full flex-col lg:h-225 lg:flex-row">
        {/* No show owns this half of the band — it is gallery photography from
            the frame, the same way the two index heroes are. */}
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
                {upNext.eyebrow}
              </p>
              <div className="flex w-full flex-col items-center gap-2 text-center">
                <h3 className="font-heading text-text-primary text-3xl leading-tight sm:text-h2 sm:leading-11.5">
                  {upNext.title}
                </h3>
                <p className="text-body-lg text-text-secondary">{upNext.copy}</p>
              </div>
            </div>

            <p className="text-h4 text-text-primary text-center">
              {upNext.venue} · {upNext.dates}
            </p>

            <div className="flex flex-col items-center justify-center gap-stack-default">
              <div className="relative size-70 sm:size-90 lg:size-100">
                <Image
                  src={upNext.image.src}
                  alt={upNext.image.alt}
                  fill
                  sizes="(min-width: 1024px) 400px, 280px"
                  className="object-cover"
                />
              </div>
              {/* The frame draws a link; the exhibitions index opens the
                  registration modal from the same show. One flow, so the home
                  page opens it too rather than routing to a second one. */}
              <RegisterButton
                className="min-w-37"
                exhibition={{
                  slug: upNext.slug,
                  title: upNext.title,
                  artist: upNext.artist,
                  when: upNext.opensOn,
                  image: upNext.image.src,
                  ticket: upNext.ticket,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    ) : null}
  </section>
);
