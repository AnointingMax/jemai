import {
  formatDateRange,
  formatDateSpan,
  naira,
  slugify,
  uniqueSlug,
  type MediaAsset,
} from "@/lib/admin/content";

/** Upcoming shows are live on the storefront; archived ones sit in the past record. */
export type ExhibitionStatus = "Upcoming" | "Archived";

export const exhibitionStatuses: ExhibitionStatus[] = ["Upcoming", "Archived"];

/**
 * Admission is either free or a single ticket price. The frames draw it as a
 * radio pair with an amount field that only matters on the paid branch, so the
 * price is kept even while free — flipping back and forth must not lose it.
 */
export type Admission = { paid: boolean; price: number };

export type Exhibition = {
  slug: string;
  name: string;
  artist: string;
  /** `yyyy-mm-dd`, the value a native date field hands back. */
  startDate: string;
  endDate: string;
  venue: string;
  admission: Admission;
  /** The short line under the title on the detail record. */
  summary: string;
  /** The exhibition's own detail-page copy. */
  content: string;
  /** The "About the Artist" panel. */
  artistBio: string;
  status: ExhibitionStatus;
  thumbnail: MediaAsset | null;
  /** The artist's portrait — its own single slot, beside the thumbnail. */
  artistProfile: MediaAsset | null;
  media: MediaAsset[];
  /** Slugs out of the artwork catalogue, linked onto the exhibition page. */
  featured: string[];
  /** ISO string; the index sorts on it. */
  updatedAt: string;
};

/** "Paid · ₦15,000", or "Free" — the index's Admission column and the record row. */
export const describeAdmission = (admission: Admission) =>
  admission.paid ? `Paid · ${naira(admission.price)}` : "Free";

/** "15 Aug – 14 Sep" — the index's Date column. */
export const exhibitionDates = (exhibition: Pick<Exhibition, "startDate" | "endDate">) =>
  formatDateRange(exhibition.startDate, exhibition.endDate);

/** "12 September–4 October 2026" — the detail record's Date row. */
export const exhibitionSpan = (exhibition: Pick<Exhibition, "startDate" | "endDate">) =>
  formatDateSpan(exhibition.startDate, exhibition.endDate);

const asset = (name: string, src: string): MediaAsset => ({
  id: `${name}-${src}`,
  name,
  size: 167301,
  src,
});

const summary =
  "The exhibition asks how land remembers the people who pass through it, and how the places that shape us continue to live within us, even after we have moved on.";

const content =
  "Threads Of Becoming unfolds through repetition, material and gradual changes in tone. Suspended forms move from pale grey to deep umber, creating a rhythmic field that appears both ordered and organic.\n\nIndividual strands gather into a larger whole, turning fibre into a meditation on continuity, transformation and the memories carried through material. Subtle variations in colour and tension prevent the repeated elements from becoming uniform; each retains a character of its own.";

const artistBio =
  "Amina Bako is a Nigerian painter whose practice explores the relationship between land, memory and belonging. Drawing from the Guinea savannah and her memories of family compounds in Kaduna, she approaches landscape not simply as scenery, but as a living record of the people, rituals and histories held within it.\n\nWorking through layered colour, textured surfaces and recurring images of trees, pathways and gathering places, Bako creates paintings that move between observation and remembrance. Woven cloth, weathered walls, red earth and shifting light reappear throughout her work, allowing familiar environments to carry both personal and collective meaning.";

type Seed = Pick<
  Exhibition,
  "slug" | "name" | "startDate" | "endDate" | "venue" | "status" | "updatedAt"
> & { admission?: Admission };

/**
 * The eight rows the index frame draws. As everywhere else in this design the
 * copy is placeholder — one artist across every show, three titles repeated —
 * so it is transcribed as drawn rather than invented around.
 */
const seed = ({ admission, ...input }: Seed): Exhibition => ({
  artist: "Amina Bako",
  admission: admission ?? { paid: false, price: 0 },
  summary,
  content,
  artistBio,
  thumbnail: asset("threads-of-becoming.jpg", "/figma/exhibitions/artist-portrait.jpg"),
  artistProfile: asset("amina-bako.jpg", "/figma/exhibitions/artist-portrait.jpg"),
  media: [
    asset("install-01.jpg", "/figma/artworks/work-01.jpg"),
    asset("install-02.jpg", "/figma/artworks/work-02.jpg"),
    asset("install-03.jpg", "/figma/artworks/work-03.jpg"),
  ],
  featured: ["work-01", "work-02", "work-03", "work-04"],
  ...input,
});

/**
 * The programme lives in module memory: this console has no backend yet, so
 * creates and edits survive for the life of the server process and no longer.
 * Swapping this for a real store means replacing the five functions below and
 * nothing that imports them.
 */
const store: Exhibition[] = [
  seed({
    slug: "the-land-knows-our-names",
    name: "The Land Knows Our Names",
    startDate: "2026-08-15",
    endDate: "2026-09-14",
    venue: "JEMAI Gallery, Lagos",
    admission: { paid: true, price: 15000 },
    status: "Upcoming",
    updatedAt: "2026-05-15T21:00:00.000Z",
  }),
  seed({
    slug: "between-earth-and-light",
    name: "Between Earth and Light",
    startDate: "2026-09-12",
    endDate: "2026-09-26",
    venue: "JEMAI Gallery, Lagos",
    status: "Upcoming",
    updatedAt: "2026-05-15T20:00:00.000Z",
  }),
  seed({
    slug: "material-memory",
    name: "Material Memory",
    startDate: "2026-10-18",
    endDate: "2026-11-02",
    venue: "Victoria Island",
    status: "Upcoming",
    updatedAt: "2026-05-15T19:00:00.000Z",
  }),
  seed({
    slug: "forms-of-stillness",
    name: "Forms of Stillness",
    startDate: "2025-07-12",
    endDate: "2025-07-25",
    venue: "Victoria Island",
    status: "Archived",
    updatedAt: "2026-05-15T18:00:00.000Z",
  }),
  seed({
    slug: "between-earth-and-light-2025",
    name: "Between Earth and Light",
    startDate: "2025-05-12",
    endDate: "2025-05-25",
    venue: "Victoria Island",
    status: "Archived",
    updatedAt: "2026-05-15T17:00:00.000Z",
  }),
  seed({
    slug: "between-earth-and-light-lagos",
    name: "Between Earth and Light",
    startDate: "2025-05-12",
    endDate: "2025-05-25",
    venue: "JEMAI Gallery, Lagos",
    status: "Archived",
    updatedAt: "2026-05-15T16:00:00.000Z",
  }),
  seed({
    slug: "the-land-knows-our-names-2024",
    name: "The Land Knows Our Names",
    startDate: "2024-05-18",
    endDate: "2024-06-02",
    venue: "Victoria Island",
    status: "Archived",
    updatedAt: "2026-05-15T15:00:00.000Z",
  }),
  seed({
    slug: "material-memory-2024",
    name: "Material Memory",
    startDate: "2024-03-15",
    endDate: "2024-04-14",
    venue: "Victoria Island",
    status: "Archived",
    updatedAt: "2026-05-15T14:00:00.000Z",
  }),
];

/** Newest first — the order the index draws and the order the seeds imply. */
const byRecency = (a: Exhibition, b: Exhibition) => b.updatedAt.localeCompare(a.updatedAt);

export const listExhibitions = () => [...store].sort(byRecency);

export const getExhibition = (slug: string) => store.find((item) => item.slug === slug);

export type ExhibitionInput = Omit<Exhibition, "updatedAt">;

const slugsInUse = () => store.map((item) => item.slug);

export const createExhibition = (input: ExhibitionInput) => {
  const slug = uniqueSlug(slugify(input.slug || input.name), slugsInUse(), "exhibition");
  const created: Exhibition = { ...input, slug, updatedAt: new Date().toISOString() };
  store.push(created);
  return created;
};

export const updateExhibition = (slug: string, input: ExhibitionInput) => {
  const index = store.findIndex((item) => item.slug === slug);
  if (index === -1) return undefined;
  const next = uniqueSlug(slugify(input.slug || input.name), slugsInUse(), "exhibition", slug);
  const updated: Exhibition = { ...input, slug: next, updatedAt: new Date().toISOString() };
  store[index] = updated;
  return updated;
};

export const deleteExhibition = (slug: string) => {
  const index = store.findIndex((item) => item.slug === slug);
  if (index === -1) return false;
  store.splice(index, 1);
  return true;
};
