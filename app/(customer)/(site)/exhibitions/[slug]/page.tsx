import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArtistNote } from "@/components/exhibitions/artist-note";
import { ExhibitionIntro } from "@/components/exhibitions/exhibition-intro";
import { RegisterButton } from "@/components/exhibitions/register-button";
import { upcomingExhibitions, getExhibition } from "@/lib/exhibitions";

export const generateStaticParams = () =>
  upcomingExhibitions.map((entry) => ({ slug: entry.slug }));

export const generateMetadata = async ({
  params,
}: PageProps<"/exhibitions/[slug]">): Promise<Metadata> => {
  const { slug } = await params;
  const exhibition = getExhibition(slug, "upcoming");
  if (!exhibition) return { title: "Not found | JEMAI" };

  return { title: `${exhibition.title} | JEMAI`, description: exhibition.lead };
};

const UpcomingExhibitionPage = async ({
  params,
}: PageProps<"/exhibitions/[slug]">) => {
  const { slug } = await params;
  const exhibition = getExhibition(slug, "upcoming");
  if (!exhibition) notFound();

  return (
    <div className="flex w-full flex-col">
      <ExhibitionIntro
        exhibition={exhibition}
        action={
          <RegisterButton
            exhibition={{
              title: exhibition.title,
              artist: exhibition.artist,
              when: "15 Aug 2026",
              image: exhibition.hero,
              ticket: exhibition.ticket,
            }}
          />
        }
      />

      {/* Unlike every section rule on the site, this one is 2px of
          `border-default` rather than the 3px `border-strong`. */}
      <div className="mt-[62px] w-full px-4 sm:px-6 lg:px-page-gutter">
        <hr className="border-border-default mx-auto w-full max-w-432 border-t-2" />
      </div>

      <div className="mt-[40px]">
        <ArtistNote />
      </div>
    </div>
  );
};

export default UpcomingExhibitionPage;
