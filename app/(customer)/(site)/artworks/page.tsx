import type { Metadata } from "next";
import { ArtworksHero } from "@/components/artworks/artworks-hero";
import { ArtworkGrid } from "@/components/artworks/artwork-grid";
import { CuratorPick } from "@/components/artworks/curator-pick";
import { ExhibitionCta } from "@/components/artworks/exhibition-cta";

export const metadata: Metadata = {
  title: "Artworks | JEMAI",
  description:
    "Explore a considered collection of contemporary works chosen for their material, emotion and ability to bring a distinct point of view into the spaces around them.",
};

/**
 * The frame draws one photograph in the hero band and a three-dash pager, so
 * the other two slides are the same still until real carousel photography
 * lands.
 */
const heroSlides = [
  {
    src: "/figma/artworks/hero.jpg",
    alt: "A visitor viewing framed works in the JEMAI gallery",
  },
  {
    src: "/figma/home/ex-slide-1.jpg",
    alt: "Visitors before a framed work in the gallery",
  },
  {
    src: "/figma/home/ex-sculpture.jpg",
    alt: "A sculpture on a plinth in the gallery",
  },
];

const ArtworksPage = () => (
  /* Every seam in this frame is 64px rather than the shell's 80px editorial
     gap, so the page returns one wrapper and spends the shell's gap once, on
     the seam into the Newsletter — same as About, Contact and Consultation. */
  <div className="flex w-full flex-col gap-16 pt-16">
    <ArtworksHero
      eyebrow="JEMAI Art"
      heading={["Works With A Presence", "Of Their Own."]}
      copy="Explore a considered collection of contemporary works chosen for their material, emotion and ability to bring a distinct point of view into the spaces around them."
      slides={heroSlides}
    />

    {/* The seam inside the catalogue block is 80, not the 64 every other seam on
        this page runs: the frame puts its rule at y=600 and the first card at
        681. */}
    <div className="flex w-full flex-col gap-20">
      <CuratorPick
        eyebrow="Curator’s Pick"
        heading={["Threads of", "Becoming"]}
        copy="A rhythmic study in fibre and repetition, moving from light into shadow as individual strands gather into a meditation on change, continuity and memory."
        cta={{ label: "Enquire", href: "/contact" }}
        secondaryCta={{ label: "View Artwork", href: "/artworks/work-01" }}
        image={{
          src: "/figma/artworks/curator-pick.jpg",
          alt: "Threads of Becoming — a hanging fibre work of beaded strands",
        }}
      />

      <ArtworkGrid />
    </div>

    <ExhibitionCta
      eyebrow="Upcoming · 12–26 September"
      heading={["Forms of Stillness - JEMAI", "Gallery • Lagos"]}
      copy="A focused presentation exploring texture, repetition and the quiet balance between movement and rest."
      cta={{ label: "Register", href: "/exhibitions" }}
      image={{
        src: "/figma/home/ex-slide-4.jpg",
        alt: "Visitors at a JEMAI gallery opening",
      }}
    />
  </div>
);

export default ArtworksPage;
