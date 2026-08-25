import { listFurniture } from "@/lib/admin/furniture";
import { listOrders } from "@/lib/admin/orders";

/** The rows the overview frame draws: the newest handful, in frame order. */
export const recentOrders = () => listOrders().slice(0, 7);

export type AttentionItem = {
  count: number;
  title: string;
  detail: string;
  href: string;
};

/** The right-hand rail: queues with something waiting in them. */
export const needsAttention: AttentionItem[] = [
  { count: 4, title: "Artwork enquiries", detail: "Awaiting follow-up", href: "/admin/artwork-enquiries" },
  { count: 3, title: "Consultation requests", detail: "Review project briefs", href: "/admin/consultation-requests" },
  { count: 2, title: "Upcoming exhibitions", detail: "Registration open", href: "/admin/exhibitions" },
];

export type OverviewStat = { label: string; value: number; href: string };

/**
 * The four counters across the top. Furniture reads the live store so a product
 * created in this session moves the number; the rest are fixtures until their
 * own stores land.
 */
export const overviewStats = (): OverviewStat[] => [
  { label: "Furniture products", value: listFurniture().length, href: "/admin/furniture" },
  { label: "Artworks", value: 18, href: "/admin/artworks" },
  { label: "Upcoming exhibitions", value: 3, href: "/admin/exhibitions" },
  { label: "Open requests", value: needsAttention.reduce((sum, item) => sum + item.count, 0), href: "/admin/consultation-requests" },
];
