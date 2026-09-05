import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/site/eyebrow";
import { HeroCarousel, type HeroSlide } from "@/components/home/hero-carousel";

const heroSlides: HeroSlide[] = [
  {
    eyebrow: "The JEMAI World",
    title: "Spaces That Reflect the People In Them",
    cta: { label: "Discover Our Stories", href: "/about" },
    image: {
      src: "/figma/home/hero.jpg",
      alt: "A linen sofa beside a brass dome lamp and a potted plant",
    },
  },
  {
    eyebrow: "Furniture",
    title: "Pieces Made to Be Lived With",
    cta: { label: "Shop Furniture", href: "/furniture" },
    image: {
      src: "/figma/home/cat-furniture.jpg",
      alt: "A sculptural armchair in a sunlit room",
    },
  },
  {
    eyebrow: "Artworks",
    title: "Contemporary Work, Carefully Chosen",
    cta: { label: "View Artworks", href: "/artworks" },
    image: {
      src: "/figma/home/art-gallery.jpg",
      alt: "Framed works hung along a gallery wall",
    },
  },
  {
    eyebrow: "Exhibitions",
    title: "Where Art, Artists and Audiences Meet",
    cta: { label: "Explore Exhibitions", href: "/exhibitions" },
    image: {
      src: "/figma/home/ex-slide-1.jpg",
      alt: "Visitors moving through an exhibition space",
    },
  },
];

const categories = [
  {
    label: "Design",
    href: "/about",
    src: "/figma/home/cat-architecture.jpg",
  },
  {
    label: "Furniture",
    href: "/furniture",
    src: "/figma/home/cat-furniture.jpg",
  },
  {
    label: "Art",
    href: "/artworks",
    src: "/figma/home/cat-artworks.jpg",
  },
  {
    label: "Exhibitions",
    href: "/exhibitions",
    src: "/figma/home/cat-exhibitions.jpg",
  },
];

export const IntroSection = () => (
  <section className="flex w-full flex-col items-center gap-stack-loose">
    <HeroCarousel slides={heroSlides} />

    <div className="flex w-full flex-col items-center px-4 pt-8 sm:px-6 lg:px-page-gutter">
      <div className="flex w-full max-w-270 flex-col gap-stack-default">
        <div className="flex flex-col gap-2.5">
          <Eyebrow>01 / The JEMAI World</Eyebrow>

          <div className="flex flex-col gap-stack-heading lg:flex-row lg:gap-section-gap-default">
            <div className="flex flex-1 flex-col justify-center">
              <h2 className="font-heading text-text-primary max-w-120 text-4xl leading-tight tracking-[0.02em] sm:text-5xl sm:leading-[1.06] lg:text-display">
                Signature Style for Every Square Inch
              </h2>
            </div>

            <div className="flex flex-1 flex-col gap-5">
              <p className="text-body text-text-secondary">
                Explore furniture, contemporary artwork, exhibitions
                and design services—brought together by a shared belief that
                every space should reflect the people who live and work within
                it.
              </p>
              <div className="flex flex-wrap items-center gap-stack-default">
                <Button asChild size="cta">
                  <Link href="/about">Discover Our Stories</Link>
                </Button>
                <Link
                  href="/furniture"
                  className="text-label text-action-link whitespace-nowrap"
                >
                  View new arrivals
                </Link>
              </div>
            </div>
          </div>
        </div>

        <ul className="grid grid-cols-2 gap-[14.896px] sm:grid-cols-4">
          {categories.map(({ label, href, src }) => (
            <li key={label}>
              <Link href={href} className="group flex flex-col items-end gap-[14.896px]">
                <span className="text-body text-text-primary text-right">
                  {label}
                </span>
                <span className="relative block aspect-square w-full overflow-hidden">
                  <Image
                    src={src}
                    alt={label}
                    fill
                    sizes="(min-width: 1024px) 257px, (min-width: 640px) 25vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);
