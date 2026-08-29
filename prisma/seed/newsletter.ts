import { prisma } from "../../lib/prisma";

/**
 * The subscriber list the newsletter frame was drawn against — the same
 * addresses, sources and timestamps, so the index still fills a page and its
 * pager before a single real sign-up comes in.
 */
const subscriberSeed = [
  { email: "nneka.obi@example.com", name: "Nneka Obi", source: "Footer form", subscribedAt: "2026-08-18T07:56:00.000Z" },
  { email: "tolu.martins@example.com", name: "Tolu Martins", source: "Exhibition", subscribedAt: "2026-08-17T14:08:00.000Z" },
  { email: "ada.okafor@example.com", name: "Ada Okafor", source: "Checkout", subscribedAt: "2026-08-16T12:45:00.000Z" },
  { email: "sade.bello@example.com", name: "Sade Bello", source: "Footer form", subscribedAt: "2026-08-15T10:22:00.000Z" },
  { email: "femi.cole@example.com", name: "Femi Cole", source: "Footer form", subscribedAt: "2026-08-14T09:31:00.000Z" },
  { email: "chidi.eze@example.com", name: "Chidi Eze", source: "Exhibition", subscribedAt: "2026-08-13T18:04:00.000Z" },
  { email: "amaka.nwosu@example.com", name: "Amaka Nwosu", source: "Checkout", subscribedAt: "2026-08-12T11:17:00.000Z" },
  { email: "kelechi.udo@example.com", name: "", source: "Footer form", subscribedAt: "2026-08-11T08:49:00.000Z" },
  { email: "yemi.adeyemi@example.com", name: "Yemi Adeyemi", source: "Footer form", subscribedAt: "2026-08-10T16:35:00.000Z" },
  { email: "ifeoma.balogun@example.com", name: "Ifeoma Balogun", source: "Exhibition", subscribedAt: "2026-08-09T13:02:00.000Z" },
  { email: "seyi.ogunlade@example.com", name: "Seyi Ogunlade", source: "Checkout", subscribedAt: "2026-08-08T19:20:00.000Z" },
  { email: "hauwa.ibrahim@example.com", name: "Hauwa Ibrahim", source: "Footer form", subscribedAt: "2026-08-07T07:11:00.000Z" },
  { email: "obinna.aneke@example.com", name: "", source: "Exhibition", subscribedAt: "2026-08-06T15:58:00.000Z" },
  { email: "zainab.lawal@example.com", name: "Zainab Lawal", source: "Footer form", subscribedAt: "2026-08-05T10:07:00.000Z" },
];

export const seedSubscribers = async () => {
  if (await prisma.subscriber.count()) return 0;

  await prisma.subscriber.createMany({
    data: subscriberSeed.map((item) => ({
      ...item,
      subscribedAt: new Date(item.subscribedAt),
    })),
  });

  return subscriberSeed.length;
};
