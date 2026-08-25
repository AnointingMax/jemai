import {
  identifyAssets,
  sanitizeRichText,
  slugify,
  uniqueSlug,
  type ContentAsset,
} from "@/lib/admin/content";

export type ArtworkAsset = ContentAsset;

/**
 * A gallery record. Deliberately without a price or any purchase field: the
 * storefront never sells artwork, it takes enquiries, and the index copy says
 * so out loud ("never display price or purchase actions"). Adding one here is
 * how that promise would quietly get broken.
 */
export type Artwork = {
  slug: string;
  title: string;
  artist: string;
  medium: string;
  /** Four-digit year, as a string — it comes off a select, never arithmetic. */
  year: string;
  /** Free text, e.g. "180 × 240 cm". */
  dimensions: string;
  summary: string;
  /** Authored HTML from the story editor, sanitised on the way in. */
  story: string;
  curatorsPick: boolean;
  thumbnail: ArtworkAsset | null;
  media: ArtworkAsset[];
  updatedAt: string;
};

/** The mediums the index filter and the form's field offer. */
export const artworkMediums = [
  "Textile installation",
  "Bronze sculpture",
  "Mixed media",
  "Oil Painting",
  "Textile",
  "Sculpture",
  "Photography",
];

/** Newest first, so a work made this year is the top of the year select. */
export const artworkYears = Array.from({ length: 30 }, (_, i) =>
  String(new Date().getUTCFullYear() - i)
);

const asset = (name: string, src: string): ArtworkAsset => ({
  id: `${name}-${src}`,
  name,
  size: 167301,
  src,
});

const galleryAssets = [1, 2, 3, 4, 5, 6].map((n) =>
  asset(`gallery-${n}.jpg`, `/figma/artworks/detail/gallery-${n}.jpg`)
);

const story = `<p>Threads Of Becoming unfolds through repetition, material and gradual changes in tone. Suspended forms move from pale grey to deep umber, creating a rhythmic field that appears both ordered and organic.</p><p>Individual strands gather into a larger whole, turning fibre into a meditation on continuity, transformation and the memories carried through material. Subtle variations in colour and tension prevent the repeated elements from becoming uniform; each retains a character of its own.</p>`;

type Seed = Omit<Artwork, "story" | "thumbnail" | "media"> & Partial<Artwork>;

const seed = (input: Seed): Artwork => ({
  story,
  thumbnail: asset("hero.jpg", "/figma/artworks/detail/hero.jpg"),
  media: galleryAssets,
  ...input,
});

/**
 * In module memory, like the furniture store: this console has no backend, so
 * creates and edits survive for the life of the server process and no longer.
 */
const store: Artwork[] = [
  seed({
    slug: "threads-of-becoming",
    title: "Threads of Becoming",
    artist: "Amina Bako",
    medium: "Textile installation",
    year: "2026",
    dimensions: "180 × 240 cm",
    summary:
      "A rhythmic study in fibre and repetition, moving from light into shadow as individual strands gather into a meditation on change, continuity and memory.",
    curatorsPick: true,
    updatedAt: "2020-05-15T21:00:00.000Z",
  }),
  seed({
    slug: "drops-of-effervescence",
    title: "Drops of effervescence",
    artist: "Mobi Aderemi",
    medium: "Bronze sculpture",
    year: "2025",
    dimensions: "60 × 40 × 40 cm",
    summary: "Cast bronze caught mid-motion, its surface broken into rising points of light.",
    curatorsPick: false,
    thumbnail: asset("work-02.jpg", "/figma/artworks/work-02.jpg"),
    updatedAt: "2020-05-15T20:00:00.000Z",
  }),
  seed({
    slug: "contour-of-class",
    title: "Contour of Class",
    artist: "Marcellina Akpojotor",
    medium: "Mixed media",
    year: "2024",
    dimensions: "2 ft × 3 ft",
    summary: "Layered paper and pigment tracing the outlines of inherited social form.",
    curatorsPick: false,
    thumbnail: asset("work-03.jpg", "/figma/artworks/work-03.jpg"),
    updatedAt: "2020-05-15T19:00:00.000Z",
  }),
  seed({
    slug: "golden-thread",
    title: "Golden Thread",
    artist: "Amina Bako",
    medium: "Textile",
    year: "2024",
    dimensions: "120 × 150 cm",
    summary: "A single warm line drawn through a field of muted weave.",
    curatorsPick: false,
    thumbnail: asset("work-04.jpg", "/figma/artworks/work-04.jpg"),
    updatedAt: "2020-05-15T17:00:00.000Z",
  }),
  seed({
    slug: "golden-thread-oil",
    title: "Golden Thread",
    artist: "Mobi Aderemi",
    medium: "Oil Painting",
    year: "2023",
    dimensions: "90 × 120 cm",
    summary: "Oil on linen, worked wet into wet until the seam between figure and ground closes.",
    curatorsPick: false,
    thumbnail: asset("work-05.jpg", "/figma/artworks/work-05.jpg"),
    updatedAt: "2020-05-15T23:00:00.000Z",
  }),
  seed({
    slug: "golden-thread-bronze",
    title: "Golden Thread",
    artist: "Amina Bako",
    medium: "Bronze sculpture",
    year: "2023",
    dimensions: "45 × 30 × 30 cm",
    summary: "A cast filament held upright, catching light along its full length.",
    curatorsPick: false,
    thumbnail: asset("work-06.jpg", "/figma/artworks/work-06.jpg"),
    updatedAt: "2020-05-15T22:00:00.000Z",
  }),
  seed({
    slug: "golden-thread-mixed",
    title: "Golden Thread",
    artist: "Marcellina Akpojotor",
    medium: "Mixed media",
    year: "2022",
    dimensions: "2 ft × 3 ft",
    summary: "Found paper, thread and pigment built into a shallow relief.",
    curatorsPick: false,
    thumbnail: asset("work-07.jpg", "/figma/artworks/work-07.jpg"),
    updatedAt: "2020-05-15T18:00:00.000Z",
  }),
  seed({
    slug: "golden-thread-study",
    title: "Golden Thread",
    artist: "Mobi Aderemi",
    medium: "Mixed media",
    year: "2022",
    dimensions: "50 × 70 cm",
    summary: "A working study for the larger piece, kept for its unresolved edges.",
    curatorsPick: false,
    thumbnail: asset("work-08.jpg", "/figma/artworks/work-08.jpg"),
    updatedAt: "2020-05-15T18:00:00.000Z",
  }),
];

const byRecency = (a: Artwork, b: Artwork) => b.updatedAt.localeCompare(a.updatedAt);

export const listArtworks = () => [...store].sort(byRecency);

export const getArtwork = (slug: string) => store.find((item) => item.slug === slug);

export type ArtworkInput = Omit<Artwork, "slug" | "updatedAt"> & { slug: string };

/** Shared by create and update: slug settled, story sanitised, assets identified. */
const normalise = (input: ArtworkInput, slug: string): Artwork => ({
  ...input,
  slug,
  story: sanitizeRichText(input.story),
  thumbnail: input.thumbnail,
  media: identifyAssets(input.media),
  updatedAt: new Date().toISOString(),
});

export const createArtwork = (input: ArtworkInput) => {
  const slug = uniqueSlug(
    store.map((item) => item.slug),
    slugify(input.slug || input.title),
    "artwork"
  );
  const created = normalise(input, slug);
  store.push(created);
  return created;
};

export const updateArtwork = (slug: string, input: ArtworkInput) => {
  const index = store.findIndex((item) => item.slug === slug);
  if (index === -1) return undefined;
  const next = uniqueSlug(
    store.map((item) => item.slug),
    slugify(input.slug || input.title),
    "artwork",
    slug
  );
  const updated = normalise(input, next);
  store[index] = updated;
  return updated;
};

export const deleteArtwork = (slug: string) => {
  const index = store.findIndex((item) => item.slug === slug);
  if (index === -1) return false;
  store.splice(index, 1);
  return true;
};
