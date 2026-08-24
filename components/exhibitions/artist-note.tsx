import Image from "next/image";
import { artistNote } from "@/lib/exhibitions";

/**
 * The block both detail frames close on: a 576 × 864 portrait beside a 563px
 * copy column, with an 81px gutter. The block starts on the page gutter and
 * stops 93px short of it on the right, as drawn.
 *
 * The copy runs an unbroken 28px pitch with only ~3px between paragraphs.
 */
export const ArtistNote = () => (
  <section className="w-full px-4 sm:px-6 lg:px-page-gutter">
    <div className="mx-auto w-full max-w-432">
      {/* 576 + 81 + 563 = 1220, so the block sits on the gutter and stops 92px
          short of it on the right — as drawn. */}
      <div className="w-full max-w-[1220px]">
        <div className="grid gap-8 lg:grid-cols-[576fr_563fr] lg:gap-x-[81px]">
          <Image
            src={artistNote.portrait.src}
            alt={artistNote.portrait.alt}
            width={artistNote.portrait.width}
            height={artistNote.portrait.height}
            sizes="(min-width: 1024px) 576px, 100vw"
            className="h-auto w-full"
          />

          <div className="lg:pt-[132px]">
            <h2 className="font-heading text-text-primary text-2xl sm:text-h3">
              {artistNote.heading}
            </h2>
            <div className="mt-[23px] space-y-[3px]">
              {artistNote.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-body-lg text-text-primary">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
