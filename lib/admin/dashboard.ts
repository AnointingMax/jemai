import { countArtworks } from "@/lib/admin/artworks";
import { hasPermission, type AdminPermission } from "@/lib/admin/auth/permissions";
import { countNewConsultations } from "@/lib/admin/consultations";
import { countNewEnquiries } from "@/lib/admin/enquiries";
import { countUpcomingExhibitions } from "@/lib/admin/exhibitions";
import { countFurniture } from "@/lib/admin/furniture";
import { countNewOrders, recentOrders } from "@/lib/admin/orders";

/** The rows the overview frame draws: the newest handful, in frame order. */
export { recentOrders };

export type AttentionItem = {
  count: number;
  title: string;
  detail: string;
  href: string;
};

type Gated<T> = { permission: AdminPermission; load: () => Promise<T>; };

const resolve = async <T,>(
  gated: Gated<T>[],
  permissions: readonly string[],
): Promise<T[]> =>
  Promise.all(
    gated.filter((card) => hasPermission(permissions, card.permission)).map((card) => card.load()),
  );

/** The three queues somebody has to answer, and the counter that sums them. */
const openRequests = (): Gated<AttentionItem>[] => [
  {
    permission: "artwork-enquiries",
    load: async () => ({ count: await countNewEnquiries(), title: "Artwork enquiries", detail: "Awaiting follow-up", href: "/admin/artwork-enquiries" }),
  },
  {
    permission: "consultation-requests",
    load: async () => ({ count: await countNewConsultations(), title: "Consultation requests", detail: "Review project briefs", href: "/admin/consultation-requests" }),
  },
  {
    permission: "exhibitions",
    load: async () => ({ count: await countUpcomingExhibitions(), title: "Upcoming exhibitions", detail: "Registration open", href: "/admin/exhibitions" }),
  },
];

/**
 * The overview's rail. Orders join the three request queues because a paid
 * order sitting on "New" is the one thing on this screen that somebody is
 * already owed — but they stay out of the "Open requests" counter, which is
 * about correspondence rather than fulfillment.
 */
export const needsAttention = async (permissions: readonly string[]): Promise<AttentionItem[]> =>
  resolve(
    [
      ...openRequests(),
      {
        permission: "orders",
        load: async () => ({ count: await countNewOrders(), title: "Furniture orders", detail: "Paid and awaiting fulfillment", href: "/admin/orders" }),
      },
    ],
    permissions,
  );

export type OverviewStat = { label: string; value: number; href: string; };

/** The deck, filtered. "Open requests" sums only the queues this admin may open. */
export const overviewStats = async (permissions: readonly string[]): Promise<OverviewStat[]> => {
  const stats = await resolve<OverviewStat>(
    [
      { permission: "furniture", load: async () => ({ label: "Furniture products", value: await countFurniture(), href: "/admin/furniture" }) },
      { permission: "artworks", load: async () => ({ label: "Artworks", value: await countArtworks(), href: "/admin/artworks" }) },
      { permission: "exhibitions", load: async () => ({ label: "Upcoming exhibitions", value: await countUpcomingExhibitions(), href: "/admin/exhibitions" }) },
    ],
    permissions,
  );

  const requests = await resolve(openRequests(), permissions);
  if (!requests.length) return stats;

  return [
    ...stats,
    {
      label: "Open requests",
      value: requests.reduce((sum, item) => sum + item.count, 0),
      href: requests[0].href,
    },
  ];
};
