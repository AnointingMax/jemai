import Image from "next/image";
import { RegisterButton } from "@/components/exhibitions/register-button";
import type { UpNext } from "@/lib/exhibitions";

export const ExhibitionCta = ({ exhibition }: { exhibition: UpNext; }) => (
  <section className="relative flex w-full items-center overflow-hidden px-5 lg:h-125 lg:px-20">
    <Image
      src={exhibition.image.src}
      alt={exhibition.image.alt}
      fill
      sizes="100vw"
      className="object-cover"
    />
    <div className="bg-surface-inverse/85 relative w-fit px-8 py-16 sm:px-6">
      <div className="max-w-125">
        <p className="text-eyebrow-lg text-text-inverse uppercase">
          Upcoming · {exhibition.dates}
        </p>
        <h2 className="font-heading text-text-inverse mt-7.25 text-3xl font-bold sm:text-h2">
          {exhibition.title} — {exhibition.venue}
        </h2>
        <p className="text-body text-text-inverse/85 mt-3.75">{exhibition.copy}</p>
        <RegisterButton
          className="mt-7.5 h-12 w-37"
          label="Register"
          exhibition={{
            slug: exhibition.slug,
            title: exhibition.title,
            artist: exhibition.artist,
            when: exhibition.opensOn,
            image: exhibition.image.src,
            ticket: exhibition.ticket,
          }}
        />
      </div>
    </div>
  </section>
);
