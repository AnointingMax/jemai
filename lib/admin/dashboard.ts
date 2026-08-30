import { countArtworks } from "@/lib/admin/artworks";
import { countNewConsultations } from "@/lib/admin/consultations";
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

export const needsAttention = async (): Promise<AttentionItem[]> => [
  { count: await countNewEnquiries(), title: "Artwork enquiries", detail: "Awaiting follow-up", href: "/admin/artwork-enquiries" },
  { count: await countNewConsultations(), title: "Consultation requests", detail: "Review project briefs", href: "/admin/consultation-requests" },
  { count: await countUpcomingExhibitions(), title: "Upcoming exhibitions", detail: "Registration open", href: "/admin/exhibitions" },
];

export type OverviewStat = { label: string; value: number; href: string; };

export const overviewStats = async (): Promise<OverviewStat[]> => [
  { label: "Furniture products", value: await countFurniture(), href: "/admin/furniture" },
  { label: "Artworks", value: await countArtworks(), href: "/admin/artworks" },
  { label: "Upcoming exhibitions", value: await countUpcomingExhibitions(), href: "/admin/exhibitions" },
  { label: "Open requests", value: (await needsAttention()).reduce((sum, item) => sum + item.count, 0), href: "/admin/consultation-requests" },
];
