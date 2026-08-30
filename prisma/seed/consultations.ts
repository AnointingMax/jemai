import { prisma } from "../../lib/prisma";

const consultationSeed = [
  { reference: 318, name: "Chidinma Okonkwo", email: "chidinma.okonkwo@example.com", phone: "+234 802 771 6034", projectType: "Full Renovation", startDate: "2026-10-05", endDate: "2027-03-19", budget: "₦50,000,000 – ₦150,000,000", summary: "A four-bedroom family house in Ikoyi that has not been touched since 2009. We want to open up the ground floor, rework the kitchen entirely and rethink how the living spaces connect to the garden.\n\nWe are not in a hurry, but we would like to start before the rains.", receivedAt: "2026-08-18T08:47:00.000Z", status: "New" },
  { reference: 317, name: "Emeka Nnadi", email: "emeka.nnadi@example.com", phone: "+234 706 440 2218", projectType: "Interior Decor", startDate: "2026-09-14", endDate: "2026-11-27", budget: "₦15,000,000 – ₦50,000,000", summary: "Newly built apartment in Victoria Island, completely empty. Looking for a single coherent scheme rather than furniture bought piece by piece.", receivedAt: "2026-08-17T15:12:00.000Z", status: "New" },
  { reference: 316, name: "Halima Sanusi", email: "halima.sanusi@example.com", phone: "+234 803 226 9915", projectType: "Art Curation", startDate: "", endDate: "", budget: "", summary: "We are opening a members' club in Lekki early next year and want a curated collection across the bar, the dining room and two private rooms. Still working out the budget, which is partly why I am writing.", receivedAt: "2026-08-16T11:30:00.000Z", status: "New" },
  { reference: 315, name: "Ronke Adebayo", email: "ronke.adebayo@example.com", phone: "+234 805 118 7742", projectType: "Furniture Selection", startDate: "2026-09-01", endDate: "2026-10-15", budget: "₦5,000,000 – ₦15,000,000", summary: "Two reception rooms and a study. The architecture is finished and we only need help choosing and placing the furniture.", receivedAt: "2026-08-15T09:05:00.000Z", status: "Reviewing" },
  { reference: 314, name: "Ibrahim Yusuf", email: "ibrahim.yusuf@example.com", phone: "+234 809 553 1180", projectType: "Architecture", startDate: "2027-01-11", endDate: "2028-06-30", budget: "Above ₦150,000,000", summary: "A new-build family house on a corner plot in Abuja. We have the survey and planning consent; what we do not have is a design we believe in.", receivedAt: "2026-08-14T17:22:00.000Z", status: "Reviewing" },
  { reference: 313, name: "Grace Oyelaran", email: "grace.oyelaran@example.com", phone: "+234 701 993 4408", projectType: "Interior Decor", startDate: "2026-09-07", endDate: "2026-12-18", budget: "₦15,000,000 – ₦50,000,000", summary: "Our office reception and boardroom, which currently look like nobody chose them.", receivedAt: "2026-08-13T13:48:00.000Z", status: "Scheduled" },
  { reference: 312, name: "Daniel Okonjo", email: "daniel.okonjo@example.com", phone: "+234 802 664 3371", projectType: "Full Renovation", startDate: "2026-10-19", endDate: "2027-02-05", budget: "₦50,000,000 – ₦150,000,000", summary: "A townhouse in Yaba we have just bought. Structurally sound, everything else needs to go. We would like to keep the original staircase if that is at all workable.", receivedAt: "2026-08-12T10:16:00.000Z", status: "Scheduled" },
  { reference: 311, name: "Simi Fashola", email: "simi.fashola@example.com", phone: "+234 806 337 5529", projectType: "Other", startDate: "", endDate: "", budget: "Under ₦5,000,000", summary: "A single room — a home studio. Small project, but I would rather it were done properly than cheaply.", receivedAt: "2026-08-11T16:41:00.000Z", status: "Closed" },
  { reference: 310, name: "Uche Mbanefo", email: "uche.mbanefo@example.com", phone: "+234 703 552 8807", projectType: "Art Curation", startDate: "2026-09-21", endDate: "2026-11-06", budget: "₦5,000,000 – ₦15,000,000", summary: "Six to eight works for a private residence, chosen to sit together.", receivedAt: "2026-08-10T12:09:00.000Z", status: "Closed" },
  { reference: 309, name: "Peju Ogundipe", email: "peju.ogundipe@example.com", phone: "+234 808 114 6693", projectType: "Furniture Selection", startDate: "2026-08-24", endDate: "2026-09-30", budget: "", summary: "Dining room only. We have the table already and need everything that goes around it.", receivedAt: "2026-08-09T07:53:00.000Z", status: "Closed" },
  { reference: 308, name: "Bola Ransome", email: "bola.ransome@example.com", phone: "+234 807 229 4416", projectType: "Architecture", startDate: "2027-02-01", endDate: "2027-12-15", budget: "Above ₦150,000,000", summary: "A guest house on family land outside Ibadan. Early days — we are talking to three practices before deciding.", receivedAt: "2026-08-08T14:37:00.000Z", status: "Closed" },
  { reference: 307, name: "Ifeanyi Duru", email: "ifeanyi.duru@example.com", phone: "+234 809 880 2245", projectType: "Interior Decor", startDate: "", endDate: "", budget: "₦5,000,000 – ₦15,000,000", summary: "Two bedrooms and a hallway. No fixed dates; whenever you have capacity.", receivedAt: "2026-08-07T09:24:00.000Z", status: "Closed" },
];

/** A fixture's date, or null where it left the field blank. */
const day = (value: string) => (value ? new Date(`${value}T00:00:00.000Z`) : null);

export const seedConsultations = async () => {
  if (await prisma.consultation.count()) return 0;

  await prisma.consultation.createMany({
    data: consultationSeed.map((item) => ({
      ...item,
      startDate: day(item.startDate),
      endDate: day(item.endDate),
      receivedAt: new Date(item.receivedAt),
    })),
  });

  // The references above are written explicitly, which leaves the sequence
  // still sitting at 1 — the first real request would collide on the unique
  // index. Walk it past the seeded block.
  await prisma.$executeRawUnsafe(
    `SELECT setval(pg_get_serial_sequence('consultation_requests', 'reference'), (SELECT MAX("reference") FROM "consultation_requests"))`,
  );

  return consultationSeed.length;
};
