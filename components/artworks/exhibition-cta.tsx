import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type ExhibitionCtaProps = {
  eyebrow: string;
  heading: string[];
  copy: string;
  cta: { label: string; href: string; };
  image: { src: string; alt: string; };
};


export const ExhibitionCta = ({
  eyebrow,
  heading,
  copy,
  cta,
  image,
}: ExhibitionCtaProps) => (
  <section className="relative w-full overflow-hidden lg:h-125 flex items-center px-5 lg:px-20">
    <Image
      src={image.src}
      alt={image.alt}
      fill
      sizes="100vw"
      className="object-cover"
    />
    <div className="bg-surface-inverse/85 relative px-8 py-16 sm:px-6 w-fit">
      <div className="max-w-125">
        <p className="text-eyebrow-lg text-text-inverse uppercase">{eyebrow}</p>
        <h2 className="font-heading text-text-inverse mt-7.25 text-3xl font-bold sm:text-h2">
          {heading.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>
        <p className="text-body text-text-inverse/85 mt-3.75">{copy}</p>
        <Button asChild size="cta" className="mt-7.5 h-12 w-37 border-0">
          <Link href={cta.href}>{cta.label}</Link>
        </Button>
      </div>
    </div>
  </section>
);
