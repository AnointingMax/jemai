import Image from "next/image";

export type Project = {
  src: string;
  alt: string;
  /** "RESIDENTIAL · LAGOS" — discipline and city, drawn as one run. */
  caption: string;
};

type ProjectsRailProps = {
  eyebrow: string;
  heading: string[];
  copy: string;
  projects: Project[];
};

/**
 * The opening band: a headline block on a 1080px measure, then a four-up rail
 * of square project photographs that breaks out to within 16px of the viewport.
 *
 * Two measures on purpose — the frame insets the header 180px from each edge
 * (1080 centred) while the rail runs 16 → 1424. Both fall out of a 16px page
 * padding plus `mx-auto max-w-[1080px]` on the header alone.
 *
 * The heading is **50px Classico Bold on a 56px line**, which is not a token:
 * its two lines measure 365.4 / 465.6 against the frame's 365 / 469, where
 * Regular at 48 gives 379 and is 14px too wide on the first line.
 */
export const ProjectsRail = ({
  eyebrow,
  heading,
  copy,
  projects,
}: ProjectsRailProps) => (
  <section className="w-full px-4 pb-[14px]">
    <div className="mx-auto grid max-w-[1080px] pt-[34px] lg:grid-cols-[573fr_507fr]">
      <div>
        <p className="text-eyebrow-lg text-text-secondary uppercase">
          {eyebrow}
        </p>
        <h1 className="font-heading text-text-primary mt-[7px] text-4xl font-bold sm:text-5xl lg:text-[50px] lg:leading-14">
          {heading.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
      </div>

      <p className="text-body text-text-secondary mt-6 max-w-[492px] lg:mt-0 lg:pt-[90px]">
        {copy}
      </p>
    </div>

    <div className="mt-[46px] grid grid-cols-1 gap-[30px] sm:grid-cols-2 lg:grid-cols-4">
      {projects.map((project) => (
        <figure key={project.src}>
          <div className="relative aspect-square w-full">
            <Image
              src={project.src}
              alt={project.alt}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <figcaption className="text-eyebrow-lg text-text-secondary mt-[22px] uppercase">
            {project.caption}
          </figcaption>
        </figure>
      ))}
    </div>
  </section>
);
