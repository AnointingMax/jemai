import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Exhibition } from "@/lib/exhibitions";

/** Both detail frames separate the crumbs with a slash. */
const Slash = () => (
  <span aria-hidden className="text-text-secondary text-body-xs">
    /
  </span>
);

const Breadcrumb = ({ exhibition }: { exhibition: Exhibition; }) => (
  <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2">
    <Link
      href="/"
      className="text-body-xs text-text-secondary underline-offset-4 hover:underline"
    >
      Home
    </Link>
    <Slash />
    <Link
      href={exhibition.status === "past" ? "/exhibitions/past" : "/exhibitions"}
      className="text-body-xs text-text-secondary underline-offset-4 hover:underline"
    >
      {exhibition.status === "past" ? "Past" : "Upcoming"} Exhibitions
    </Link>
    <Slash />
    <span className="text-body-xs text-text-primary" aria-current="page">
      {exhibition.title}
    </span>
  </nav>
);

/**
 * The opening both detail frames share, pixel for pixel: breadcrumb, a
 * full-bleed 1440 × 501 hero, a page-centred header (artist, a 50px Classico
 * title, the status word and the run), then the lead and body on the same 800px
 * measure the artwork detail page uses — `text-h4` over `text-body-lg`.
 *
 * `action` is the block that closes the copy column: the Register CTA on the
 * upcoming frame, nothing on the past one.
 */
export const ExhibitionIntro = ({
  exhibition,
  action,
}: {
  exhibition: Exhibition;
  action?: ReactNode;
}) => (
  <>
    <div className="w-full px-4 sm:px-6 lg:px-page-gutter">
      <hr className="border-border-strong mx-auto w-full max-w-432 border-t-3" />
    </div>

    <div className="mt-[80px] w-full px-4 sm:px-6 lg:px-page-gutter">
      <div className="mx-auto w-full max-w-432">
        <Breadcrumb exhibition={exhibition} />
      </div>
    </div>

    <div className="relative mt-[16px] aspect-[1440/501] w-full min-h-70">
      <Image
        src={exhibition.hero}
        alt={exhibition.title}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
    </div>

    <header className="mt-[62px] w-full px-4 text-center sm:px-6 lg:px-page-gutter">
      <p className="text-h4 text-text-primary uppercase">{exhibition.artist}</p>
      <h1 className="font-heading text-text-primary mt-[12px] text-3xl sm:text-4xl lg:text-[50px] lg:leading-[56px] lg:font-bold">
        {exhibition.title}
      </h1>
      <p className="text-body-lg text-text-secondary mt-[14px] capitalize">
        {exhibition.status}
      </p>
      <p className="text-body-lg text-text-primary mt-[12px]">
        {exhibition.dates}
      </p>
    </header>

    <div className="mt-[47px] w-full px-4 sm:px-6 lg:px-page-gutter">
      <div className="mx-auto w-full max-w-[799px]">
        <p className="text-h4 text-text-primary">{exhibition.lead}</p>
        {/* The frame runs both paragraphs on one unbroken 28px pitch, so the
            block carries no paragraph gap at all. */}
        <div className="mt-[25px]">
          {exhibition.body.map((paragraph) => (
            <p key={paragraph} className="text-body-lg text-text-primary">
              {paragraph}
            </p>
          ))}
        </div>
        {action && <div className="mt-[22px]">{action}</div>}
      </div>
    </div>
  </>
);
