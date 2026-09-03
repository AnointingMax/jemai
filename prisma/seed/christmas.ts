import { prisma } from "../../lib/prisma";
import type { ChristmasStatus, RequestedArea } from "../../lib/christmas";

type ChristmasSeedRow = {
  reference: number;
  year: number;
  name: string;
  email: string;
  phone: string;
  propertyType: string;
  areas: RequestedArea[];
  status: ChristmasStatus;
  receivedAt: string;
};

/**
 * Two batches, so the year and status filters both have something to work on.
 *
 * The 2026 campaign has **twelve paid** of its twenty slots, which is the "8
 * Available Slots" the frame prints — a slot is spent by payment, not by
 * submission — plus three live enquiries above them at the other three
 * statuses. Behind it sits last year's fully booked season.
 */
const christmasSeed: ChristmasSeedRow[] = [
  { reference: 21, year: 2026, name: "Tunde Bakare", email: "tunde.bakare@example.com", phone: "+234 806 449 2036", propertyType: "Detached house", areas: [{ area: "Living + Dining", quantity: 2 }, { area: "Kitchen", quantity: 1 }], status: "New", receivedAt: "2026-09-03T08:14:00.000Z" },
  { reference: 20, year: 2026, name: "Nneka Eze", email: "nneka.eze@example.com", phone: "+234 802 550 9917", propertyType: "Duplex", areas: [{ area: "Exterior & Compound", quantity: 1 }, { area: "Bedrooms", quantity: 5 }], status: "In conversation", receivedAt: "2026-09-02T15:20:00.000Z" },
  { reference: 19, year: 2026, name: "Rotimi Coker", email: "rotimi.coker@example.com", phone: "+234 703 118 4492", propertyType: "Commercial space", areas: [{ area: "Exterior & Compound", quantity: 1 }], status: "Closed", receivedAt: "2026-09-02T11:57:00.000Z" },

  { reference: 18, year: 2026, name: "Ada Okafor", email: "ada.okafor@example.com", phone: "+234 803 555 0198", propertyType: "Detached house", areas: [{ area: "Living + Dining", quantity: 1 }, { area: "Bedrooms", quantity: 3 }], status: "Paid", receivedAt: "2026-09-02T09:42:00.000Z" },
  { reference: 17, year: 2026, name: "Teni Alade", email: "teni.alade@example.com", phone: "+234 806 221 4470", propertyType: "Duplex", areas: [{ area: "Exterior & Compound", quantity: 1 }], status: "Paid", receivedAt: "2026-09-01T16:18:00.000Z" },
  { reference: 16, year: 2026, name: "Kelechi Nwosu", email: "kelechi.nwosu@example.com", phone: "+234 802 118 9036", propertyType: "Detached house", areas: [{ area: "Bedrooms", quantity: 4 }, { area: "Kitchen", quantity: 1 }], status: "Paid", receivedAt: "2026-09-01T11:05:00.000Z" },
  { reference: 15, year: 2026, name: "Femi Cole", email: "femi.cole@example.com", phone: "+234 705 664 2213", propertyType: "Apartment", areas: [{ area: "Living + Dining", quantity: 1 }, { area: "Kitchen", quantity: 1 }], status: "Paid", receivedAt: "2026-08-31T14:32:00.000Z" },
  { reference: 14, year: 2026, name: "Zara Bello", email: "zara.bello@example.com", phone: "+234 809 330 7752", propertyType: "Bungalow", areas: [{ area: "Exterior & Compound", quantity: 1 }, { area: "Living + Dining", quantity: 1 }], status: "Paid", receivedAt: "2026-08-30T10:16:00.000Z" },
  { reference: 13, year: 2026, name: "Ifeanyi Eze", email: "ifeanyi.eze@example.com", phone: "+234 807 445 1129", propertyType: "Semi-detached house", areas: [{ area: "Bedrooms", quantity: 2 }], status: "Paid", receivedAt: "2026-08-29T17:40:00.000Z" },
  { reference: 12, year: 2026, name: "Amara Nwosu", email: "amara.nwosu@example.com", phone: "+234 701 882 6604", propertyType: "Duplex", areas: [{ area: "Living + Dining", quantity: 1 }, { area: "Bedrooms", quantity: 2 }], status: "Paid", receivedAt: "2026-08-28T12:08:00.000Z" },
  { reference: 11, year: 2026, name: "Damilola Adebayo", email: "damilola.adebayo@example.com", phone: "+234 805 993 3318", propertyType: "Detached house", areas: [{ area: "Bedrooms", quantity: 3 }, { area: "Kitchen", quantity: 1 }], status: "Paid", receivedAt: "2026-08-27T09:25:00.000Z" },
  { reference: 10, year: 2026, name: "Chioma Obi", email: "chioma.obi@example.com", phone: "+234 808 274 5560", propertyType: "Apartment", areas: [{ area: "Exterior & Compound", quantity: 1 }, { area: "Kitchen", quantity: 1 }], status: "Paid", receivedAt: "2026-08-26T15:04:00.000Z" },
  { reference: 9, year: 2026, name: "Segun Akinola", email: "segun.akinola@example.com", phone: "+234 703 117 8845", propertyType: "Commercial space", areas: [{ area: "Living + Dining", quantity: 1 }], status: "Paid", receivedAt: "2026-08-25T11:48:00.000Z" },
  { reference: 8, year: 2026, name: "Bisi Adenuga", email: "bisi.adenuga@example.com", phone: "+234 809 224 7731", propertyType: "Bungalow", areas: [{ area: "Bedrooms", quantity: 2 }, { area: "Kitchen", quantity: 1 }], status: "Paid", receivedAt: "2026-08-24T08:31:00.000Z" },
  { reference: 7, year: 2026, name: "Uche Mba", email: "uche.mba@example.com", phone: "+234 806 771 3308", propertyType: "Apartment", areas: [{ area: "Living + Dining", quantity: 1 }], status: "Paid", receivedAt: "2026-08-23T13:57:00.000Z" },

  { reference: 6, year: 2025, name: "Yemi Fashola", email: "yemi.fashola@example.com", phone: "+234 809 662 1174", propertyType: "Detached house", areas: [{ area: "Living + Dining", quantity: 1 }, { area: "Bedrooms", quantity: 4 }], status: "Paid", receivedAt: "2025-11-28T10:12:00.000Z" },
  { reference: 5, year: 2025, name: "Chinelo Umeh", email: "chinelo.umeh@example.com", phone: "+234 705 338 4429", propertyType: "Apartment", areas: [{ area: "Kitchen", quantity: 1 }], status: "Paid", receivedAt: "2025-11-21T15:46:00.000Z" },
  { reference: 4, year: 2025, name: "Bode Salami", email: "bode.salami@example.com", phone: "+234 803 771 5582", propertyType: "Bungalow", areas: [{ area: "Exterior & Compound", quantity: 1 }, { area: "Living + Dining", quantity: 1 }], status: "Paid", receivedAt: "2025-11-14T09:03:00.000Z" },
  { reference: 3, year: 2025, name: "Aisha Lawal", email: "aisha.lawal@example.com", phone: "+234 807 226 6640", propertyType: "Duplex", areas: [{ area: "Bedrooms", quantity: 3 }], status: "Paid", receivedAt: "2025-11-07T17:25:00.000Z" },
  { reference: 2, year: 2025, name: "Kunle Oshodi", email: "kunle.oshodi@example.com", phone: "+234 802 995 3317", propertyType: "Semi-detached house", areas: [{ area: "Living + Dining", quantity: 1 }, { area: "Kitchen", quantity: 1 }], status: "Paid", receivedAt: "2025-10-30T11:39:00.000Z" },
  { reference: 1, year: 2025, name: "Ngozi Ibeh", email: "ngozi.ibeh@example.com", phone: "+234 806 114 7728", propertyType: "Commercial space", areas: [{ area: "Exterior & Compound", quantity: 1 }], status: "Paid", receivedAt: "2025-10-22T14:08:00.000Z" },
];

export const seedChristmasRequests = async () => {
  if (await prisma.christmasRequest.count()) return 0;

  await prisma.christmasRequest.createMany({
    data: christmasSeed.map((item) => ({
      ...item,
      receivedAt: new Date(item.receivedAt),
    })),
  });

  // The references above are written explicitly, which leaves the sequence
  // still sitting at 1 — the first real request would collide on the unique
  // index. Walk it past the seeded block.
  await prisma.$executeRawUnsafe(
    `SELECT setval(pg_get_serial_sequence('christmas_requests', 'reference'), (SELECT MAX("reference") FROM "christmas_requests"))`,
  );

  return christmasSeed.length;
};
