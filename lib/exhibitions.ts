/**
 * Exhibition data, transcribed from the four exhibition frames.
 *
 * The design draws one artist (Amina Bako) across every frame and repeats a
 * handful of titles, so most of this is placeholder content in the file itself
 * — see `build-plan.md` for the specific contradictions. Replace with the real
 * programme; the shapes here are what the components read.
 */

export type ExhibitionStatus = "upcoming" | "past";

/** A photograph with its intrinsic size, so `next/image` can reserve the box. */
export type Shot = { src: string; width: number; height: number; alt: string; };

/** One work in the past-detail rail, each at its own natural aspect. */
export type ExhibitionWork = Shot & { title: string; year: string; href: string; };

export type Exhibition = {
  slug: string;
  title: string;
  artist: string;
  status: ExhibitionStatus;
  /** "Aug 15 – Sep 14, 2026" — the detail page's date line. */
  dates: string;
  /** The card's second line: the artist for upcoming, the run for past. */
  cardMeta: string;
  /** The card's matted photograph. */
  card: Shot;
  /** The detail page's full-bleed hero. */
  hero: string;
  /** Lead paragraph, set in `text-h4` on the 800px measure. */
  lead: string;
  /** Supporting paragraphs below the lead. */
  body: string[];
  /**
   * Paid exhibitions carry a ticket; free ones omit it and the register modal
   * drops its ticket summary. The frame draws both states.
   */
  ticket?: { label: string; price: string; };
};

const bako = {
  artist: "Amina Bako",
  lead: "JEMAI presents The Land Knows Our Names, a solo exhibition by Nigerian painter Amina Bako. Across this new body of work, Bako considers the tree not as scenery, but as witness—a keeper of gathering, movement, shelter and return.",
  body: [
    "Drawing from the Guinea savannah and memories of family compounds in Kaduna, Bako constructs landscapes that move between lived place and inherited memory. Umbrella canopies stretch across layered skies, while textured grounds recall woven cloth, weathered walls and the red earth after rain.",
    "The exhibition asks how land remembers the people who pass through it—and how the places that shape us continue to live within us, even after we have moved on.",
  ],
};

/**
 * The artist note both detail frames close on. The *past* frame draws a bio for
 * a different artist entirely (a David Lynch biography, pasted in from another
 * file); the design's own Bako copy is used on both pages instead — a
 * deliberate departure, since the frame's own text names the wrong person.
 */
export const artistNote = {
  heading: "About the Artist",
  portrait: {
    src: "/figma/exhibitions/artist-portrait.jpg",
    width: 576,
    height: 864,
    alt: "Amina Bako photographed in her studio",
  },
  paragraphs: [
    "Amina Bako is a Nigerian painter whose practice explores the relationship between land, memory and belonging. Drawing from the Guinea savannah and her memories of family compounds in Kaduna, she approaches landscape not simply as scenery, but as a living record of the people, rituals and histories held within it.",
    "Working through layered colour, textured surfaces and recurring images of trees, pathways and gathering places, Bako creates paintings that move between observation and remembrance. Woven cloth, weathered walls, red earth and shifting light reappear throughout her work, allowing familiar environments to carry both personal and collective meaning.",
    "Her paintings often begin with remembered fragments—a canopy seen from a childhood courtyard, the changing colour of the ground after rain, or the quiet movement of people beneath the trees. These details are gradually reworked into landscapes that feel at once recognisable and imagined.",
    "Through her practice, Bako considers how place continues to shape identity long after we have left it. Her work asks what the land remembers, what we inherit from the spaces that raised us, and how painting can preserve the emotional geography of home.",
  ],
};

/** The featured "UP NEXT" block on the upcoming index. */
export const upNext = {
  slug: "the-land-knows-our-names",
  eyebrow: "Up next",
  title: "The Land Knows Our Names",
  copy: "The exhibition asks how land remembers the people who pass through it—and how the places that shape us continue to live within us, even after we have moved on.",
  rows: [
    { label: "Date", value: "12 September–4 October 2026" },
    { label: "Venue", value: "JEMAI Gallery, Lagos" },
    { label: "Opening", value: "Saturday, 12 September · 5:00 PM" },
  ],
  image: {
    src: "/figma/exhibitions/up-next.jpg",
    width: 688,
    height: 516,
    alt: "The Land Knows Our Names — a layered landscape in oil",
  },
};

/** Three slides run behind both index heroes; the frames draw only the first. */
export const upcomingHero: Shot[] = [
  {
    src: "/figma/exhibitions/hero-upcoming.jpg",
    width: 1440,
    height: 501,
    alt: "A JEMAI gallery room hung with framed landscapes",
  },
  {
    src: "/figma/artworks/hero.jpg",
    width: 1440,
    height: 500,
    alt: "Visitors viewing framed works in the JEMAI gallery",
  },
  {
    src: "/figma/home/ex-sculpture.jpg",
    width: 1440,
    height: 500,
    alt: "A sculpture on a plinth in the gallery",
  },
];

export const pastHero: Shot[] = [
  {
    src: "/figma/exhibitions/hero-past.jpg",
    width: 1440,
    height: 501,
    alt: "Three framed paintings on a deep red gallery wall",
  },
  {
    src: "/figma/artworks/hero.jpg",
    width: 1440,
    height: 500,
    alt: "Visitors viewing framed works in the JEMAI gallery",
  },
  {
    src: "/figma/home/ex-slide-1.jpg",
    width: 1440,
    height: 500,
    alt: "Visitors before a framed work in the gallery",
  },
];

const shot = (name: string, width: number, height: number, alt: string): Shot => ({
  src: `/figma/exhibitions/${name}.jpg`,
  width,
  height,
  alt,
});

/**
 * The two "Coming soon" cards. The frame fills only two of the grid's three
 * tracks, so the third is left empty as drawn.
 */
export const upcomingExhibitions: Exhibition[] = [
  {
    slug: "material-memory",
    title: "Material Memory",
    status: "upcoming",
    dates: "Oct 18 – Nov 15, 2026",
    cardMeta: "Amina Bako",
    card: shot("soon-1", 292, 324, "Material Memory — gold and green impasto in a deep red frame"),
    hero: "/figma/exhibitions/detail-hero.jpg",
    ...bako,
  },
  {
    slug: "between-earth-and-light",
    title: "Between Earth And Light",
    status: "upcoming",
    dates: "Nov 22 – Dec 20, 2026",
    cardMeta: "Amina Bako",
    card: shot("soon-2", 395, 290, "Between Earth And Light — a woven relief in natural fibre"),
    hero: "/figma/exhibitions/detail-hero.jpg",
    ...bako,
  },
  /**
   * The piece the "UP NEXT" block and both detail frames draw. It is a paid
   * event, which is the state the paid register modal covers.
   */
  {
    slug: upNext.slug,
    title: upNext.title,
    status: "upcoming",
    dates: "Aug 15 – Sep 14, 2026",
    cardMeta: "Amina Bako",
    card: shot("up-next", 688, 516, upNext.title),
    hero: "/figma/exhibitions/detail-hero.jpg",
    ticket: { label: "General admission", price: "₦15,000" },
    ...bako,
  },
];

/**
 * The nine past cards, transcribed as drawn. **The frame repeats "Queit
 * Witnesses" in cards 6 and 9 with the same run of dates, and spells "Quiet"
 * as "Queit" in both** — kept as drawn rather than corrected.
 */
type PastRow = [slug: string, title: string, run: string, file: string, w: number, h: number];

const pastRows: PastRow[] = [
  ["a-delicate-balance", "A Delicate Balance", "18 July–8 August 2026", "past-1", 243, 324],
  ["war-in-heaven", "War in Heaven", "20 June–11 July 2026", "past-2", 251, 324],
  ["woven-geometries", "Woven Geometries", "23 May–13 June 2026", "past-3", 320, 324],
  ["the-centre-holds", "The Centre Holds", "18 April–9 May 2026", "past-4", 336, 324],
  ["lines-between-us", "Lines Between Us", "14 March–4 April 2026", "past-5", 319, 324],
  ["queit-witnesses", "Queit Witnesses", "7–28 February 2026", "past-6", 236, 324],
  ["tidal-memory", "Tidal Memory", "10–31 January 2026", "past-7", 394, 305],
  ["between-earth-and-light-2025", "Between Earth And Light", "6–21 December 2025", "past-8", 283, 324],
  ["queit-witnesses-2", "Queit Witnesses", "7–28 February 2026", "past-9", 298, 324],
];

export const pastExhibitions: Exhibition[] = pastRows.map(
  ([slug, title, run, file, w, h]) => ({
    slug,
    title,
    status: "past" as const,
    dates: "May 15 – Aug 14, 2026",
    cardMeta: run,
    card: shot(file, w, h, title),
    hero: "/figma/exhibitions/detail-hero.jpg",
    ...bako,
  }),
);

export const getExhibition = (slug: string, status: ExhibitionStatus) =>
  (status === "upcoming" ? upcomingExhibitions : pastExhibitions).find(
    (entry) => entry.slug === slug,
  );

/**
 * The past-detail frame's installation rail. It draws two slides and a "1/12"
 * counter, so the set is twelve; the export only carries the first, and the
 * second is clipped by the frame edge.
 */
export const installShots: Shot[] = [
  {
    src: "/figma/exhibitions/install-1.jpg",
    width: 1088,
    height: 762,
    alt: "Installation view — a visitor crossing the main gallery",
  },
  {
    src: "/figma/artworks/hero.jpg",
    width: 1440,
    height: 500,
    alt: "Installation view — the north wall",
  },
  {
    src: "/figma/exhibitions/hero-past.jpg",
    width: 1440,
    height: 501,
    alt: "Installation view — three framed paintings on the red wall",
  },
];

/** The single work the past-detail frame features between its copy blocks. */
export const featuredWork = {
  src: "/figma/exhibitions/featured-work.jpg",
  width: 900,
  height: 720,
  alt: "After The First Rain, 2026 — a layered canopy in oil",
};

/**
 * The four works the past-detail frame rails below its copy. Each is 300px wide
 * at its own natural height, so the row is top-aligned and every caption sits
 * directly under its own image.
 */
export const exhibitionWorks: ExhibitionWork[] = [
  {
    src: "/figma/exhibitions/work-1.jpg",
    width: 300,
    height: 538,
    title: "Keeper Of The Crossing",
    year: "2026",
    href: "/artworks/work-01",
    alt: "Keeper Of The Crossing, 2026",
  },
  {
    src: "/figma/exhibitions/work-2.jpg",
    width: 300,
    height: 192,
    title: "After The First Rain",
    year: "2026",
    href: "/artworks/work-02",
    alt: "After The First Rain, 2026",
  },
  {
    src: "/figma/exhibitions/work-3.jpg",
    width: 300,
    height: 386,
    title: "A Place To Return To",
    year: "2026",
    href: "/artworks/work-03",
    alt: "A Place To Return To, 2026",
  },
  {
    src: "/figma/exhibitions/work-4.jpg",
    width: 300,
    height: 537,
    title: "The Long Shade",
    year: "2026",
    href: "/artworks/work-04",
    alt: "The Long Shade, 2026",
  },
];

/**
 * The nine-line block the past-detail frame draws **twice**, once above the
 * featured work and once below it, verbatim. Reproduced as drawn so the page
 * matches its frame; `bodyAfter` is the duplicate and is the field to replace
 * with real copy.
 */
export const pastNarrative = {
  bodyBefore: [
    "In Bako's paintings, the landscape is never empty. It bears the imprint of those who cultivate it, cross it, gather beneath it and carry its memory elsewhere. Trees appear as quiet custodians—rooted in place while witnessing generations of movement and change. Her surfaces are built through thick pigment, broken colour and repeated gestures. Greens arrive with the force of the rainy season; pale blues recall the clarity of morning after harmattan; ochres and deep browns carry the warmth of laterite earth. The paintings resist photographic description, allowing memory, weather and imagination to alter what is seen.",
    "Across the series, branches reach towards one another like bodies gathering under a shared canopy. What begins as a study of landscape becomes a meditation on belonging: the homes we inherit, the places we leave and the ground that continues to recognise us.",
  ],
  bodyAfter: [
    "In Bako's paintings, the landscape is never empty. It bears the imprint of those who cultivate it, cross it, gather beneath it and carry its memory elsewhere. Trees appear as quiet custodians—rooted in place while witnessing generations of movement and change. Her surfaces are built through thick pigment, broken colour and repeated gestures. Greens arrive with the force of the rainy season; pale blues recall the clarity of morning after harmattan; ochres and deep browns carry the warmth of laterite earth. The paintings resist photographic description, allowing memory, weather and imagination to alter what is seen.",
    "Across the series, branches reach towards one another like bodies gathering under a shared canopy. What begins as a study of landscape becomes a meditation on belonging: the homes we inherit, the places we leave and the ground that continues to recognise us.",
  ],
};
