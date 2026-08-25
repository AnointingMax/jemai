import { listFurniture } from "@/lib/admin/furniture";

export type FulfilmentStatus = "New" | "Processing" | "Shipped" | "Delivered";

export type AdminOrder = {
  id: string;
  customer: string;
  phone: string;
  /** Whole naira, as the frame prints it. */
  total: number;
  /** Pre-formatted; these are fixtures, not a live feed. */
  date: string;
  status: FulfilmentStatus;
};

/** The seven rows the overview frame draws, in frame order. */
export const recentOrders: AdminOrder[] = [
  { id: "#JM-2048", customer: "Ada Okafor", phone: "+234 704 667 6343", total: 1600, date: "Jan 16, 2025", status: "New" },
  { id: "#JM-2047", customer: "Teni Alade", phone: "+234 704 667 6343", total: 2600, date: "Jan 15, 2025", status: "New" },
  { id: "#JM-2046", customer: "Kelechi Nwosu", phone: "+234 704 667 6343", total: 5600, date: "Jan 16, 2025", status: "New" },
  { id: "#JM-2045", customer: "Mathilde Lewis", phone: "+234 704 667 6343", total: 6300, date: "Jan 14, 2025", status: "New" },
  { id: "#JM-2044", customer: "Olly Schroeder", phone: "+234 704 667 6343", total: 2100, date: "Jan 14, 2025", status: "New" },
  { id: "#JM-2043", customer: "Julius Vaughan", phone: "+234 704 667 6343", total: 1070, date: "Jan 14, 2025", status: "Processing" },
  { id: "#JM-2042", customer: "Zaid Schwartz", phone: "+234 704 667 6343", total: 8100, date: "Jan 14, 2025", status: "Processing" },
];

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
