import { countArtworks } from "@/lib/admin/artworks";
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

/** The three queues somebody has to answer, and the counter that sums them. */
const openRequests = async (): Promise<AttentionItem[]> => [
  { count: await countNewEnquiries(), title: "Artwork enquiries", detail: "Awaiting follow-up", href: "/admin/artwork-enquiries" },
  { count: await countNewConsultations(), title: "Consultation requests", detail: "Review project briefs", href: "/admin/consultation-requests" },
  { count: await countUpcomingExhibitions(), title: "Upcoming exhibitions", detail: "Registration open", href: "/admin/exhibitions" },
];

/**
 * The overview's rail. Orders join the three request queues because a paid
 * order sitting on "New" is the one thing on this screen that somebody is
 * already owed — but they stay out of the "Open requests" counter, which is
 * about correspondence rather than fulfillment.
 */
export const needsAttention = async (): Promise<AttentionItem[]> => [
  ...(await openRequests()),
  { count: await countNewOrders(), title: "Furniture orders", detail: "Paid and awaiting fulfillment", href: "/admin/orders" },
];

export type OverviewStat = { label: string; value: number; href: string; };

export const overviewStats = async (): Promise<OverviewStat[]> => [
  { label: "Furniture products", value: await countFurniture(), href: "/admin/furniture" },
  { label: "Artworks", value: await countArtworks(), href: "/admin/artworks" },
  { label: "Upcoming exhibitions", value: await countUpcomingExhibitions(), href: "/admin/exhibitions" },
  { label: "Open requests", value: (await openRequests()).reduce((sum, item) => sum + item.count, 0), href: "/admin/consultation-requests" },
];
