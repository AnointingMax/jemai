import { formatDateTimeShort } from "@/lib/admin/content";
import { prisma } from "@/lib/prisma";
import type { Subscriber as SubscriberRecord } from "@/lib/generated/prisma/client";

/**
 * Where a sign-up came from. The storefront has exactly three places that take
 * an email address, and the index's Source column names them.
 */
export type SubscriberSource = "Footer form" | "Exhibition" | "Checkout";

export const subscriberSources: SubscriberSource[] = ["Footer form", "Exhibition", "Checkout"];

export type Subscriber = {
  id: string;
  /** The address is the identity — the table is unique on it, not on the id. */
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

/** The row as the console's one subscriber shape. */
const toSubscriber = (record: SubscriberRecord): Subscriber => ({
  id: record.id,
  email: record.email,
  name: record.name,
  // The column is free text in the database; anything the console never wrote
  // still has to land on one of the three the Source column knows about.
  source: (subscriberSources.find((source) => source === record.source) ??
    "Footer form") as SubscriberSource,
  subscribedAt: record.subscribedAt.toISOString(),
});

/** Newest first — the order the index draws before the reader sorts it. */
export const listSubscribers = async () => {
  const records = await prisma.subscriber.findMany({ orderBy: { subscribedAt: "desc" } });
  return records.map(toSubscriber);
};

/** A count query, not a fetch of the whole list. */
export const countSubscribers = () => prisma.subscriber.count();

export type SubscriberInput = {
  email: string;
  name: string;
  source: SubscriberSource;
};

/**
 * Records a sign-up. Idempotent by address: subscribing again refreshes the
 * date and the source rather than failing on the unique index, and only fills
 * in a name if this sign-up carried one — the footer form asks for an address
 * alone, and it must not wipe a name a checkout already gave us.
 */
export const subscribe = async (input: SubscriberInput) => {
  const email = input.email.trim().toLowerCase();

  const record = await prisma.subscriber.upsert({
    where: { email },
    update: {
      source: input.source,
      subscribedAt: new Date(),
      ...(input.name ? { name: input.name } : {}),
    },
    create: { email, name: input.name, source: input.source },
  });

  return toSubscriber(record);
};
