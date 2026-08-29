import Image from "next/image";
import { SectionIntro } from "@/components/site/section-intro";
import { MediaBand } from "@/components/site/media-band";
import {
  CuratorCarousel,
  type CuratorPick,
} from "@/components/site/curator-carousel";
import { curatedArtworks } from "@/lib/artworks";
import type { CuratedArtwork } from "@/lib/gallery";

/**
 * Three picks so the arrows have somewhere to go — whichever works the console
 * has flagged as Curator's Pick, topped up with the newest when fewer than
 * three are flagged. The gallery photograph behind the panel stays put; only
 * the panel and the framed work advance.
 */
const toPick = (artwork: CuratedArtwork): CuratorPick => ({
  title: artwork.title,
  copy: artwork.summary,
  href: `/artworks/${artwork.slug}`,
  image: { src: artwork.src, alt: artwork.title },
  medium: artwork.medium,
  dimensions: artwork.dimensions,
});

export const ArtworksSection = async () => {
  const picks = (await curatedArtworks(3)).map(toPick);

  return (
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

        {picks.length ? <CuratorCarousel picks={picks} /> : null}
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
};
