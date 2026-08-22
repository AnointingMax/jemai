import { AnnouncementBar } from "@/components/site/announcement-bar";
import { SiteHeader } from "@/components/site/site-header";
import { Newsletter } from "@/components/site/newsletter";
import { SiteFooter } from "@/components/site/site-footer";

/**
 * The editorial shell every content page shares. Pages supply their sections as
 * siblings; the 80px editorial gap and the closing newsletter are the same on
 * every one of them.
 */
const SiteLayout = ({ children }: LayoutProps<"/">) => (
  <>
    <AnnouncementBar />
    <SiteHeader />
    <main className="flex flex-col gap-section-gap-editorial">
      {children}
      <Newsletter />
    </main>
    <SiteFooter />
  </>
);

export default SiteLayout;
