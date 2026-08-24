import type { Metadata } from "next";
import { ExhibitionCard } from "@/components/exhibitions/exhibition-card";
import { ExhibitionHero } from "@/components/exhibitions/exhibition-hero";
import { ExhibitionTabs } from "@/components/exhibitions/exhibition-tabs";
import { UpNext } from "@/components/exhibitions/up-next";
import {
  upcomingExhibitions,
  upcomingHero,
  upNext,
} from "@/lib/exhibitions";

export const metadata: Metadata = {
  title: "Upcoming Exhibitions | JEMAI",
  description:
    "What is opening next at JEMAI — the gallery's upcoming presentations of contemporary painting, sculpture and fibre.",
};

const featured = upcomingExhibitions.find(
  (entry) => entry.slug === upNext.slug,
);

/** The two cards the frame draws under "Coming soon" — everything except the
 *  piece already featured above. */
const comingSoon = upcomingExhibitions.filter(
  (entry) => entry.slug !== upNext.slug,
);

const UpcomingExhibitionsPage = () => (
  <div className="flex w-full flex-col pb-3">
    {/* The Nav frame closes on the same 3px rule every section opens with. */}
    <div className="w-full px-4 sm:px-6 lg:px-page-gutter">
      <hr className="border-border-strong mx-auto w-full max-w-432 border-t-3" />
    </div>

    <div className="mt-2">
      <ExhibitionHero slides={upcomingHero} />
    </div>

    <div className="mt-16">
      <ExhibitionTabs active="upcoming" />
    </div>

    <div className="mt-[30px]">
      <UpNext
        exhibition={{
          title: upNext.title,
          artist: featured?.artist ?? "Amina Bako",
          when: "12 Sep 2026",
          image: upNext.image.src,
          ticket: featured?.ticket,
        }}
      />
    </div>

    {/* Eyebrow with a hairline running out to the gutter — the same kicker the
        catalogue sections use. */}
    <section className="mt-[58px] w-full px-4 sm:px-6 lg:px-page-gutter">
      <div className="mx-auto w-full max-w-432">
        <div className="flex items-center gap-6">
          <h2 className="text-eyebrow text-text-primary shrink-0 uppercase">
            Coming soon
          </h2>
          <span aria-hidden className="border-border-default w-full border-t" />
        </div>

        {/* Three tracks on a 40px gutter; the frame fills only two. */}
        <ul className="mt-[22px] grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {comingSoon.map((exhibition) => (
            <li key={exhibition.slug}>
              <ExhibitionCard
                exhibition={exhibition}
                href={`/exhibitions/${exhibition.slug}`}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  </div>
);

export default UpcomingExhibitionsPage;
