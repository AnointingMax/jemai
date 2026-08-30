import Image from "next/image";
import type { ArtistNote as Note } from "@/lib/exhibitions";

/**
 * The block both detail frames close on: a 576 × 864 portrait beside a 563px
 * copy column, with an 81px gutter. The block starts on the page gutter and
 * stops 93px short of it on the right, as drawn.
 *
 * The copy runs an unbroken 28px pitch with only ~3px between paragraphs.
 */
export const ArtistNote = ({ note }: { note: Note; }) => (
  <section className="w-full px-4 sm:px-6 lg:px-page-gutter">
    <div className="mx-auto w-full max-w-432">
      {/* 576 + 81 + 563 = 1220, so the block sits on the gutter and stops 92px
          short of it on the right — as drawn. */}
      <div className="w-full max-w-305">
        <div className="grid gap-8 lg:grid-cols-[576fr_563fr] lg:gap-x-20.25">
          {/* 576 × 864 in the frame; an uploaded portrait fills that box. */}
          <div className="relative aspect-576/864 w-full">
            <Image
              src={note.portrait.src}
              alt={note.portrait.alt}
              fill
              sizes="(min-width: 1024px) 576px, 100vw"
              className="object-cover"
            />
          </div>

          <div className="lg:pt-33">
            <h2 className="font-heading text-text-primary text-2xl sm:text-h3">
              {note.heading}
            </h2>
            <div className="mt-5.75 space-y-0.75">
              {note.paragraphs.map((paragraph) => (
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
