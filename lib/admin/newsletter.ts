import { formatDateTimeShort } from "@/lib/admin/content";

/**
 * Where a sign-up came from. The storefront has exactly three places that take
 * an email address, and the index's Source column names them.
 */
export type SubscriberSource = "Footer form" | "Exhibition" | "Checkout";

export const subscriberSources: SubscriberSource[] = ["Footer form", "Exhibition", "Checkout"];

export type Subscriber = {
  /** The address is the identity — the list is keyed on it, not on a row id. */
  email: string;
  /** Blank for a footer sign-up, which only asks for an address. */
  name: string;
  source: SubscriberSource;
  /** ISO string; the Date column sorts on it and formats off it. */
  subscribedAt: string;
};

/** "18 Aug · 07:56" — the index's Date column. */
export const subscribedAt = (subscriber: Pick<Subscriber, "subscribedAt">) =>
  formatDateTimeShort(subscriber.subscribedAt);

const store: Subscriber[] = [
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

/** Newest first — the order the index draws before the reader sorts it. */
export const listSubscribers = () =>
  [...store].sort((a, b) => b.subscribedAt.localeCompare(a.subscribedAt));
