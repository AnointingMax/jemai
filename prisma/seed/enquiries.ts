import { prisma } from "../../lib/prisma";

/**
 * The follow-up queue the enquiry frames were drawn against. Every `artworkSlug`
 * is a real slug out of the artwork seed — resolved to that work's id below, so
 * the sheet's "Open artwork record" link lands on something.
 */
const enquirySeed = [
  { reference: 1042, artworkSlug: "threads-of-becoming", artworkTitle: "Threads of Becoming", artist: "Amina Bako", name: "Ada Okafor", email: "ada.okafor@example.com", phone: "+234 701 660 1430", message: "I saw this work at the Lagos preview and have not stopped thinking about it. Could you tell me whether it is still available, and what the acquisition process looks like?", receivedAt: "2026-08-18T10:24:00.000Z", status: "New" },
  { reference: 1041, artworkSlug: "contour-of-class", artworkTitle: "Contour of Class", artist: "Marcellina Akpojotor", name: "Julius Vaughan", email: "julius.vaughan@example.com", phone: "+234 805 220 4419", message: "We are dressing a double-height entrance hall in Ikoyi and this is the scale we have been looking for. Is the artist open to a commission at a larger size?", receivedAt: "2026-08-17T16:05:00.000Z", status: "New" },
  { reference: 1040, artworkSlug: "golden-thread", artworkTitle: "Golden Thread", artist: "Amina Bako", name: "Teni Alade", email: "teni.alade@example.com", phone: "+234 704 667 6343", message: "Please could you send condition notes and framing options for this piece?", receivedAt: "2026-08-17T09:38:00.000Z", status: "New" },
  { reference: 1039, artworkSlug: "drops-of-effervescence", artworkTitle: "Drops of effervescence", artist: "Mobi Aderemi", name: "Mathilde Lewis", email: "mathilde.lewis@example.com", phone: "+234 806 442 7781", message: "Enquiring on behalf of a client based in London. What would shipping and insurance to the UK involve?", receivedAt: "2026-08-16T13:52:00.000Z", status: "New" },
  { reference: 1038, artworkSlug: "golden-thread-oil", artworkTitle: "Golden Thread", artist: "Mobi Aderemi", name: "Kelechi Nwosu", email: "kelechi.nwosu@example.com", phone: "+234 703 118 9022", message: "We spoke briefly at the opening. I would like to arrange a private viewing before the end of the month if that is possible.", receivedAt: "2026-08-15T11:14:00.000Z", status: "In conversation" },
  { reference: 1037, artworkSlug: "golden-thread-bronze", artworkTitle: "Golden Thread", artist: "Amina Bako", name: "Ngozi Eze", email: "ngozi.eze@example.com", phone: "+234 703 909 6612", message: "Is the bronze part of an edition, and if so how many remain?", receivedAt: "2026-08-14T15:47:00.000Z", status: "In conversation" },
  { reference: 1036, artworkSlug: "threads-of-becoming", artworkTitle: "Threads of Becoming", artist: "Amina Bako", name: "Zaid Schwartz", email: "zaid.schwartz@example.com", phone: "+234 809 771 2264", message: "Our practice is furnishing a boutique hotel and we would like to discuss placing several works from this series across the public rooms.", receivedAt: "2026-08-13T08:29:00.000Z", status: "In conversation" },
  { reference: 1035, artworkSlug: "golden-thread-mixed", artworkTitle: "Golden Thread", artist: "Marcellina Akpojotor", name: "Bisi Adeyemi", email: "bisi.adeyemi@example.com", phone: "+234 807 554 3390", message: "Could I see this piece in person? I am in Lagos until the 20th.", receivedAt: "2026-08-12T17:03:00.000Z", status: "Closed" },
  { reference: 1034, artworkSlug: "contour-of-class", artworkTitle: "Contour of Class", artist: "Marcellina Akpojotor", name: "Femi Bankole", email: "femi.bankole@example.com", phone: "+234 810 226 8874", message: "Asking about provenance and whether the work has been exhibited before. Happy to be sent a full catalogue entry.", receivedAt: "2026-08-11T12:41:00.000Z", status: "Closed" },
  { reference: 1033, artworkSlug: "golden-thread-study", artworkTitle: "Golden Thread", artist: "Mobi Aderemi", name: "Amara Chukwu", email: "amara.chukwu@example.com", phone: "+234 806 118 4407", message: "What is the lead time on a study of this size?", receivedAt: "2026-08-10T09:56:00.000Z", status: "Closed" },
  { reference: 1032, artworkSlug: "drops-of-effervescence", artworkTitle: "Drops of effervescence", artist: "Mobi Aderemi", name: "Tunde Bakare", email: "tunde.bakare@example.com", phone: "+234 802 663 1195", message: "Interested in this work for a corporate collection. Please send whatever documentation the board would need to see.", receivedAt: "2026-08-09T14:18:00.000Z", status: "Closed" },
  { reference: 1031, artworkSlug: "golden-thread", artworkTitle: "Golden Thread", artist: "Amina Bako", name: "Olly Schroeder", email: "olly.schroeder@example.com", phone: "+234 802 337 5510", message: "Does the price include installation?", receivedAt: "2026-08-08T10:02:00.000Z", status: "Closed" },
];

export const seedEnquiries = async () => {
  if (await prisma.enquiry.count()) return 0;

  // The fixtures name their pieces by slug, but an enquiry is filed against an
  // artwork's id. Resolve the whole set once rather than per row.
  const artworks = await prisma.artwork.findMany({ select: { id: true, slug: true } });
  const idBySlug = new Map(artworks.map((artwork) => [artwork.slug, artwork.id]));

  await prisma.enquiry.createMany({
    data: enquirySeed.map(({ artworkSlug, ...item }) => ({
      ...item,
      // A fixture naming a work that is not in the catalogue still seeds, as an
      // enquiry whose piece has gone — the same state a deletion leaves behind.
      artworkId: idBySlug.get(artworkSlug) ?? null,
      receivedAt: new Date(item.receivedAt),
    })),
  });

  // The references above are written explicitly, which leaves the sequence
  // still sitting at 1 — the first real enquiry would collide on the unique
  // index. Walk it past the seeded block.
  await prisma.$executeRawUnsafe(
    `SELECT setval(pg_get_serial_sequence('artwork_enquiries', 'reference'), (SELECT MAX("reference") FROM "artwork_enquiries"))`,
  );

  return enquirySeed.length;
};
