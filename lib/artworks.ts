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
