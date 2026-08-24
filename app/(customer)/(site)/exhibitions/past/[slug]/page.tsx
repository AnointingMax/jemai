import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArtistNote } from "@/components/exhibitions/artist-note";
import { ExhibitionIntro } from "@/components/exhibitions/exhibition-intro";
import { InstallRail } from "@/components/exhibitions/install-rail";
import { WorksRail } from "@/components/exhibitions/works-rail";
import {
  exhibitionWorks,
  featuredWork,
  getExhibition,
  installShots,
  pastExhibitions,
  pastNarrative,
} from "@/lib/exhibitions";

export const generateStaticParams = () =>
  pastExhibitions.map((entry) => ({ slug: entry.slug }));

export const generateMetadata = async ({
  params,
}: PageProps<"/exhibitions/past/[slug]">): Promise<Metadata> => {
  const { slug } = await params;
  const exhibition = getExhibition(slug, "past");
  if (!exhibition) return { title: "Not found | JEMAI" };

  return { title: `${exhibition.title} | JEMAI`, description: exhibition.lead };
};

/** The narrative block, on the same 800px measure the intro copy uses. */
const Narrative = ({ paragraphs }: { paragraphs: string[]; }) => (
  <div className="w-full px-4 sm:px-6 lg:px-page-gutter">
    <div className="mx-auto w-full max-w-200">
      {paragraphs.map((paragraph) => (
        <p key={paragraph} className="text-body-lg text-text-primary">
          {paragraph}
        </p>
      ))}
    </div>
  </div>
);

const PastExhibitionPage = async ({
  params,
}: PageProps<"/exhibitions/past/[slug]">) => {
  const { slug } = await params;
  const exhibition = getExhibition(slug, "past");
  if (!exhibition) notFound();

  return (
    <div className="flex w-full flex-col">
      <ExhibitionIntro exhibition={exhibition} />

      <div className="mt-12">
        <InstallRail shots={installShots} />
      </div>

      <div className="mt-12.25">
        <Narrative paragraphs={pastNarrative.bodyBefore} />
      </div>

      {/* The featured work sits on its own 900px centred panel — the same
          treatment the artwork detail page gives its hero. */}
      <div className="mt-5.75 w-full px-4 sm:px-6 lg:px-page-gutter">
        <Image
          src={featuredWork.src}
          alt={featuredWork.alt}
          width={featuredWork.width}
          height={featuredWork.height}
          sizes="(min-width: 1024px) 900px, 100vw"
          className="mx-auto h-auto w-full max-w-225"
        />
      </div>

      {/* **The frame draws the block above verbatim a second time here.** Kept
          as drawn so the page matches its frame; `bodyAfter` is the field to
          replace with real copy. */}
      <div className="mt-6.25">
        <Narrative paragraphs={pastNarrative.bodyAfter} />
      </div>

      <div className="mt-12">
        <WorksRail works={exhibitionWorks} />
      </div>

      <div className="mt-20.75 w-full px-4 sm:px-6 lg:px-page-gutter">
        <hr className="border-border-default mx-auto w-full max-w-432 border-t-2" />
      </div>

      <div className="mt-10">
        <ArtistNote />
      </div>
    </div>
  );
};

export default PastExhibitionPage;
