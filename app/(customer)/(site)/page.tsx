import { IntroSection } from "@/components/home/intro-section";
import { FurnitureSection } from "@/components/home/furniture-section";
import { ArtworksSection } from "@/components/home/artworks-section";
import { ExhibitionsSection } from "@/components/home/exhibitions-section";
import { ArchitectureSection } from "@/components/home/architecture-section";
import { featuredFurniture } from "@/lib/furniture";

const HomePage = async () => (
  <>
    <IntroSection />
    <FurnitureSection products={await featuredFurniture()} />
    <ArtworksSection />
    <ExhibitionsSection />
    <ArchitectureSection />
  </>
);

export default HomePage;
