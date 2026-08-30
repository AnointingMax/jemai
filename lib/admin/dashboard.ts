import { countArtworks } from "@/lib/admin/artworks";
import { countNewEnquiries } from "@/lib/admin/enquiries";
import { countUpcomingExhibitions } from "@/lib/admin/exhibitions";
import { countFurniture } from "@/lib/admin/furniture";
import { listOrders } from "@/lib/admin/orders";

/** The rows the overview frame draws: the newest handful, in frame order. */
export const recentOrders = () => listOrders().slice(0, 7);

export type AttentionItem = {
  count: number;
  title: string;
  detail: string;
  href: string;
};

/**
 * The right-hand rail: queues with something waiting in them. Enquiries and
 * exhibitions count their own tables, so an enquiry sent on the storefront or a
 * run that has ended moves the number; the rest are fixtures until
 * their own stores land.
 */
export const needsAttention = async (): Promise<AttentionItem[]> => [
  { count: await countNewEnquiries(), title: "Artwork enquiries", detail: "Awaiting follow-up", href: "/admin/artwork-enquiries" },
  { count: 3, title: "Consultation requests", detail: "Review project briefs", href: "/admin/consultation-requests" },
  { count: await countUpcomingExhibitions(), title: "Upcoming exhibitions", detail: "Registration open", href: "/admin/exhibitions" },
];

export type OverviewStat = { label: string; value: number; href: string };

/**
 * The four counters across the top. Furniture, artworks and exhibitions count
 * their own tables, so a record created in the console moves the number; the
 * rest are fixtures until their own stores land.
 */
export const overviewStats = async (): Promise<OverviewStat[]> => [
  { label: "Furniture products", value: await countFurniture(), href: "/admin/furniture" },
  { label: "Artworks", value: await countArtworks(), href: "/admin/artworks" },
  { label: "Upcoming exhibitions", value: await countUpcomingExhibitions(), href: "/admin/exhibitions" },
  { label: "Open requests", value: (await needsAttention()).reduce((sum, item) => sum + item.count, 0), href: "/admin/consultation-requests" },
];
