import { AnnouncementBar } from "@/components/site/announcement-bar";
import { SiteHeader } from "@/components/site/site-header";
import { IntroSection } from "@/components/home/intro-section";
import { FurnitureSection } from "@/components/home/furniture-section";
import { ArtworksSection } from "@/components/home/artworks-section";
import { ExhibitionsSection } from "@/components/home/exhibitions-section";
import { ArchitectureSection } from "@/components/home/architecture-section";
import { Newsletter } from "@/components/site/newsletter";
import { SiteFooter } from "@/components/site/site-footer";

const HomePage = () => (
  <>
    <AnnouncementBar />
    <SiteHeader />
    <main className="flex flex-col gap-section-gap-editorial">
      <IntroSection />
      <FurnitureSection />
      <ArtworksSection />
      <ExhibitionsSection />
      <ArchitectureSection />
      <Newsletter />
    </main>
    <SiteFooter />
  </>
);

export default HomePage;
