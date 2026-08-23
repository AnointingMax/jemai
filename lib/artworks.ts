export type Artwork = {
  slug: string;
  title: string;
  /** "Mixed media on canvas · 2 ft × 3 ft" — medium and size, drawn as one run. */
  medium: string;
  src: string;
};

/**
 * The fifteen works the catalogue frame draws, with their photographs recovered
 * straight out of the frame export (each sits unobstructed at 383 × 339).
 *
 * **The titles are placeholder data in the design itself** — every one of the
 * fifteen cards reads "Of Mind and Myth · Mixed media on canvas · 2 ft × 3 ft".
 * Reproduced as drawn so the grid matches its frame; replace with the real
 * catalogue when it exists, at which point the slugs become meaningful.
 */
const works: Artwork[] = Array.from({ length: 15 }, (_, i) => ({
  slug: `work-${String(i + 1).padStart(2, "0")}`,
  title: "Of Mind and Myth",
  medium: "Mixed media on canvas · 2 ft × 3 ft",
  src: `/figma/artworks/work-${String(i + 1).padStart(2, "0")}.jpg`,
}));

/**
 * The frame draws fifteen cards *and* a live "Load more", which needs a set
 * larger than one page. The fifteen run twice — the first page is then exactly
 * the grid the frame draws. Drop the repeat once the real catalogue lands; this
 * is the same stand-in `rotation` the furniture catalogue uses.
 */
export const artworks: Artwork[] = [
  ...works,
  ...works.map((work) => ({ ...work, slug: `${work.slug}-b` })),
];

/**
 * The frame's pager reads "1-12 of 16 pieces" while the grid draws fifteen
 * cards — the same kind of internal contradiction the furniture catalogue has
 * (16 cards, "44 ITEMS", "1-12 of 16"). The build keeps the dominant visual,
 * which is the grid as drawn, and derives the pager from the data.
 */
export const ARTWORK_PAGE_SIZE = 15;

export type ArtworkDetail = Artwork & {
  artist: string;
  /** The lead paragraph — larger, set on the frame's 28px pitch. */
  lead: string;
  /** The supporting paragraph below it. */
  body: string;
  /** The framed hero photograph, matted on `surface-tint`. */
  hero: string;
  /** The six-up documentation grid below the rule. */
  gallery: { src: string; alt: string; }[];
};

/**
 * The six photographs the detail frame draws below its rule, cropped straight
 * out of the export at their drawn 427 × 327. The frame repeats one shot in the
 * first and last cell — reproduced as drawn; swap in real documentation when it
 * exists.
 */
const drawnGallery = [
  { src: "/figma/artworks/detail/gallery-1.jpg", alt: "The artist beside the hanging work" },
  { src: "/figma/artworks/detail/gallery-2.jpg", alt: "The work seen straight on, full height" },
  { src: "/figma/artworks/detail/gallery-3.jpg", alt: "Visitors reading the work up close" },
  { src: "/figma/artworks/detail/gallery-4.jpg", alt: "The work beside its wall label" },
  { src: "/figma/artworks/detail/gallery-5.jpg", alt: "The gallery room during the hang" },
  { src: "/figma/artworks/detail/gallery-6.jpg", alt: "The artist beside the hanging work" },
];

/**
 * The one piece the detail frame draws, transcribed. Note the frame and its
 * enquiry modal disagree about the artist — the page reads "Marcellina
 * Akpojotor" and the modal's caption reads "Amina Bako". The page's name wins
 * here and the modal takes whatever piece it is opened on; worth raising with
 * the designer.
 */
const featured: Omit<ArtworkDetail, "slug"> = {
  title: "Threads of Becoming",
  medium: "Mixed media on canvas · 2 ft × 3 ft",
  src: "/figma/artworks/detail/hero.jpg",
  artist: "Marcellina Akpojotor",
  hero: "/figma/artworks/detail/hero.jpg",
  lead: "Threads Of Becoming unfolds through repetition, material and gradual changes in tone. Suspended forms move from pale grey to deep umber, creating a rhythmic field that appears both ordered and organic.",
  body: "Individual strands gather into a larger whole, turning fibre into a meditation on continuity, transformation and the memories carried through material. Subtle variations in colour and tension prevent the repeated elements from becoming uniform; each retains a character of its own.",
  gallery: drawnGallery,
};

/**
 * Only one detail frame exists, so `work-01` — the slug the curator's pick
 * already points at — carries the drawn piece exactly and every other catalogue
 * entry reuses its shape with its own catalogue title. Replace with the real
 * records when the catalogue lands.
 */
export const getArtworkDetail = (slug: string): ArtworkDetail | undefined => {
  const work = artworks.find((entry) => entry.slug === slug);
  if (!work) return undefined;
  if (slug === "work-01") return { ...featured, slug };

  return {
    ...featured,
    ...work,
    hero: work.src,
    gallery: drawnGallery,
  };
};
