export type Artwork = {
  slug: string;
  title: string;
  /** "Mixed media on canvas · 2 ft × 3 ft" — medium and size, drawn as one run. */
  medium: string;
  src: string;
};

export type ArtworkDetail = Artwork & {
  artist: string;
  /** The summary, set larger on the frame's 28px pitch. */
  lead: string;
  /** The authored story below it — sanitised HTML, written on save. */
  story: string;
  /** The framed hero photograph, matted on `surface-tint`. */
  hero: string;
  /** The documentation grid below the rule. */
  gallery: { src: string; alt: string; }[];
};

/** One work as the curated panels draw it — the catalogue's pick and the home rail. */
export type CuratedArtwork = {
  slug: string;
  title: string;
  artist: string;
  summary: string;
  medium: string;
  dimensions: string;
  src: string;
};

/** How many cards the catalogue frame draws before the first "Load more". */
export const ARTWORK_PAGE_SIZE = 15;
