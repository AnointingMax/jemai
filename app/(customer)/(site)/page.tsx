import { IntroSection } from "@/components/home/intro-section";
import { FurnitureSection } from "@/components/home/furniture-section";
import { ArtworksSection } from "@/components/home/artworks-section";
import { ExhibitionsSection } from "@/components/home/exhibitions-section";
import { ArchitectureSection } from "@/components/home/architecture-section";
import { featuredFurniture } from "@/lib/furniture";
import { getUpNext, highlightShots } from "@/lib/exhibitions";

/**
 * The featured show is derived from its run, so this page goes out of date with
 * nothing having been written — the same reason the exhibitions index
 * revalidates hourly.
 */
export const revalidate = 3600;

const HomePage = async () => {
  const [products, highlights, upNext] = await Promise.all([
    featuredFurniture(),
    highlightShots(),
    getUpNext(),
  ]);

  return (
    <>
      <IntroSection />
      <FurnitureSection products={products} />
      <ArtworksSection />
      <ExhibitionsSection highlights={highlights} upNext={upNext} />
      <ArchitectureSection />
    </>
  );
};

export default HomePage;
