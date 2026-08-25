/**
 * Helpers every admin catalogue shares. Furniture, artworks and exhibitions all
 * upload the same kind of asset, print the same kind of timestamp and derive
 * slugs the same way, so those live here rather than in whichever section
 * happened to need them first.
 */

/** A media entry — thumbnail, portrait or gallery slot. `size` is what the uploader reported. */
export type MediaAsset = {
  id: string;
  name: string;
  /** Bytes, as the picker reported them. Formatted for display, never summed. */
  size: number;
  src: string;
};

/** Naira, whole units, hand-grouped so server and client always agree. */
export const naira = (amount: number) =>
  `₦${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/**
 * "15 May 2020 9:00 pm" — the index's Updated column. Built by hand rather than
 * through `Intl` so a server render and a client re-render cannot disagree about
 * locale data.
 */
export const formatUpdatedAt = (iso: string) => {
  const date = new Date(iso);
  const hour = date.getUTCHours();
  const meridiem = hour < 12 ? "am" : "pm";
  const twelve = hour % 12 === 0 ? 12 : hour % 12;
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  return `${date.getUTCDate()} ${months[date.getUTCMonth()]} ${date.getUTCFullYear()} ${twelve}:${minutes} ${meridiem}`;
};

/**
 * A `yyyy-mm-dd` field value as its parts, without going through `Date` — a
 * bare date string parses as UTC midnight and prints as the day before in any
 * negative offset, which is exactly the bug a date-only field must not have.
 */
const parts = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return { year, month: month - 1, day };
};

/** "15 Aug – 14 Sep", collapsing the month when both ends share one. */
export const formatDateRange = (start: string, end: string) => {
  const from = parts(start);
  const to = parts(end);
  if (!from && !to) return "—";
  if (!from || !to) {
    const only = (from ?? to)!;
    return `${only.day} ${months[only.month]}`;
  }
  return from.month === to.month && from.year === to.year
    ? `${from.day} – ${to.day} ${months[to.month]}`
    : `${from.day} ${months[from.month]} – ${to.day} ${months[to.month]}`;
};

/** "12 September–4 October 2026" — the long form the detail record prints. */
export const formatDateSpan = (start: string, end: string) => {
  const from = parts(start);
  const to = parts(end);
  if (!from || !to) return "—";
  return `${from.day} ${monthNames[from.month]}–${to.day} ${monthNames[to.month]} ${to.year}`;
};

/** File sizes as the upload rows draw them: "163.38 KB". */
export const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(2)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
};

/** Lowercase, hyphenated, punctuation dropped — what the slug field suggests. */
export const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/**
 * A slug none of `taken` already holds, suffixed `-2`, `-3`, … if it does.
 * `ignore` is the record's own current slug, so re-saving it unchanged is a
 * no-op rather than a rename.
 */
export const uniqueSlug = (candidate: string, taken: string[], fallback: string, ignore?: string) => {
  const base = candidate || fallback;
  let slug = base;
  for (let n = 2; taken.some((held) => held === slug && held !== ignore); n += 1) slug = `${base}-${n}`;
  return slug;
};
