import Image from "next/image";
import { SectionIntro } from "@/components/site/section-intro";
import { MediaBand } from "@/components/site/media-band";
import {
  CuratorCarousel,
  type CuratorPick,
} from "@/components/site/curator-carousel";

/* Three picks so the arrows have somewhere to go. The gallery photograph
   behind the panel stays put; only the panel and the framed work advance. */
const curatorPicks: CuratorPick[] = [
  {
    title: "Currents Of Stillness",
    copy:
      "Dynamic compositions that embody movement and grace, bringing bold energy and artistic expression into any space.",
    href: "/artworks/currents-of-stillness",
    image: {
      src: "/figma/home/art-featured.jpg",
      alt: "Mixed media on canvas in a gilt frame",
    },
    medium: "Mixed Media On Canvas",
    dimensions: "2 ft \u00d7 3 ft",
  },
  {
    title: "A Collection Of Quiet Hours",
    copy:
      "Studies in repetition and restraint, selected for the way they slow a room and reward a longer second look.",
    href: "/artworks/quiet-hours",
    image: {
      src: "/figma/home/art-collection.jpg",
      alt: "Framed works hung together in a gallery",
    },
    medium: "Oil On Linen",
    dimensions: "3 ft \u00d7 4 ft",
  },
  {
    title: "The Maker\u2019s Hand",
    copy:
      "Work that keeps the gesture visible \u2014 colour laid down with intent, and a surface that carries the making.",
    href: "/artworks/makers-hand",
    image: {
      src: "/figma/home/art-artist.jpg",
      alt: "Portrait of a featured JEMAI artist at work",
    },
    medium: "Acrylic On Canvas",
    dimensions: "2.5 ft \u00d7 3.5 ft",
  },
];

export const ArtworksSection = () => (
  <section className="flex w-full flex-col items-center">
    <div className="flex w-full max-w-432 flex-col gap-stack-loose px-4 sm:px-6 lg:px-page-gutter">
      <hr className="border-border-strong w-full border-t-3" />
      <div className="flex w-full flex-col items-center py-8">
        <SectionIntro
          className="max-w-270"
          eyebrow="03 / JEMAI Art"
          heading="Art That Changes the Feeling of a Space"
          copy="Explore contemporary works selected for their material, emotion and ability to bring a distinct point of view into the spaces around them."
          cta={{ label: "Explore Artworks", href: "/artworks" }}
        />
      </div>
    </div>

    {/* Curator's pick — copy panel over a gallery photograph, with the framed work alongside */}
    <div className="relative w-full bg-white">
      <div className="relative flex min-h-130 w-full flex-col justify-center px-4 sm:px-6 lg:h-155.25 lg:px-page-gutter">
        <Image
          src="/figma/home/art-gallery.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-b from-[rgba(121,121,121,0.1)] to-[rgba(19,19,19,0.5)]"
        />

        <CuratorCarousel picks={curatorPicks} />
      </div>
    </div>

    <MediaBand
      eyebrow="The Collection"
      heading="A Collection Shaped By Texture, Movement And Memory."
      copy="From quiet studies in repetition to expressive works led by colour and gesture, JEMAI selects pieces that reward a slower, more considered way of seeing."
      cta={{ label: "Explore The Collection", href: "/artworks" }}
      image={{
        src: "/figma/home/art-collection.jpg",
        alt: "Visitors viewing framed works in a gallery",
      }}
      mediaSide="right"
      scrim
    />

    <MediaBand
      eyebrow="Artist Spotlight"
      heading="Meet The Voice Behind The Work."
      copy="Discover the ideas, influences and processes that shape a distinctive creative practice."
      cta={{ label: "Meet The Artist", href: "/about#artists" }}
      image={{
        src: "/figma/home/art-artist.jpg",
        alt: "Portrait of a featured JEMAI artist",
      }}
      mediaSide="left"
    />
  </section>
);
