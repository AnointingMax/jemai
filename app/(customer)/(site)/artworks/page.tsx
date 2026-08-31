import type { Metadata } from "next";
import { ArtworksHero } from "@/components/artworks/artworks-hero";
import { ArtworkGrid } from "@/components/artworks/artwork-grid";
import { CuratorPick } from "@/components/artworks/curator-pick";
import { ExhibitionCta } from "@/components/artworks/exhibition-cta";
import { curatedArtworks, listArtworks } from "@/lib/artworks";
import { getUpNext } from "@/lib/exhibitions";

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

/** The closing band features the next show, whose run turns the day over. */
export const revalidate = 3600;

const ArtworksPage = async () => {
  const [artworks, [pick], upNext] = await Promise.all([
    listArtworks(),
    curatedArtworks(1),
    getUpNext(),
  ]);

  return (
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

      {/* The seam inside the catalogue block is 80, not the 64 every other seam
          on this page runs: the frame puts its rule at y=600 and the first card
          at 681. */}
      <div className="flex w-full flex-col gap-20">
        {/* The curator's pick is whichever work the console has flagged, so an
            empty catalogue draws the grid alone rather than an empty panel. */}
        {pick ? (
          <CuratorPick
            eyebrow="Curator’s Pick"
            heading={[pick.title]}
            copy={pick.summary}
            cta={{ label: "Enquire", href: "/contact" }}
            secondaryCta={{ label: "View Artwork", href: `/artworks/${pick.slug}` }}
            image={{ src: pick.src, alt: pick.title }}
          />
        ) : null}

        <ArtworkGrid artworks={artworks} />
      </div>

      {/* Nothing upcoming draws no band: the page closes on the grid rather
          than on an invitation to a show that does not exist. */}
      {upNext ? <ExhibitionCta exhibition={upNext} /> : null}
    </div>
  );
};

export default ArtworksPage;
