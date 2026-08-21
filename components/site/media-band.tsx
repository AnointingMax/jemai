import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type MediaBandProps = {
  eyebrow: string;
  heading: string;
  copy: string;
  cta: { label: string; href: string };
  image: { src: string; alt: string };
  /** Which half the image occupies on desktop. Mobile always stacks image-first. */
  mediaSide?: "left" | "right";
  /** Some bands sit a soft scrim over the photograph. */
  scrim?: boolean;
};

export const MediaBand = ({
  eyebrow,
  heading,
  copy,
  cta,
  image,
  mediaSide = "right",
  scrim = false,
}: MediaBandProps) => (
  <div className="flex w-full flex-col lg:flex-row">
    <div
      className={cn(
        "relative w-full lg:w-1/2",
        mediaSide === "left" ? "lg:order-1" : "lg:order-2",
      )}
    >
      <div className="relative aspect-[670/500] w-full">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
        {scrim && <div aria-hidden className="absolute inset-0 bg-black/10" />}
      </div>
    </div>

    <div
      className={cn(
        "flex w-full items-center justify-center px-4 py-12 sm:px-6 sm:py-16 lg:w-1/2 lg:px-[50px] lg:py-[130.5px]",
        mediaSide === "left" ? "lg:order-2" : "lg:order-1",
      )}
    >
      <div className="flex w-full flex-col gap-stack-compact">
        <div className="flex w-full flex-col gap-2">
          <p className="text-eyebrow-lg text-text-secondary uppercase">
            {eyebrow}
          </p>
          <h3 className="font-heading text-text-primary text-2xl leading-snug sm:text-h3">
            {heading}
          </h3>
        </div>
        <p className="text-body text-text-secondary">{copy}</p>
        <div className="pt-[15px]">
          <Button asChild size="cta" className="min-w-[148px]">
            <Link href={cta.href}>{cta.label}</Link>
          </Button>
        </div>
      </div>
    </div>
  </div>
);
