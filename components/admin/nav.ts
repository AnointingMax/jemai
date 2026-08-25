import {
  Armchair,
  CalendarDays,
  ClipboardList,
  Frame,
  LayoutDashboard,
  Mail,
  MessageSquare,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";

export type AdminNavItem = {
  title: string;
  url: string;
  /** Shown on its own when the rail is collapsed, so every row needs one. */
  icon: LucideIcon;
};

export type AdminNavGroup = {
  title: string;
  items: AdminNavItem[];
};

/**
 * The console's navigation, in frame order. The breadcrumb and the collapsed
 * icon rail both read this list, so a route is only named once.
 */
export const adminNav: AdminNavGroup[] = [
  {
    title: "Content",
    items: [
      { title: "Overview", url: "/admin", icon: LayoutDashboard },
      { title: "Furniture", url: "/admin/furniture", icon: Armchair },
      { title: "Artworks", url: "/admin/artworks", icon: Frame },
      { title: "Exhibitions", url: "/admin/exhibitions", icon: CalendarDays },
    ],
  },
  {
    title: "Operations",
    items: [
      { title: "Furniture orders", url: "/admin/orders", icon: ShoppingBag },
      {
        title: "Artwork enquiries",
        url: "/admin/artwork-enquiries",
        icon: MessageSquare,
      },
      {
        title: "Consultation requests",
        url: "/admin/consultation-requests",
        icon: ClipboardList,
      },
    ],
  },
  {
    title: "Audience",
    items: [{ title: "Newsletter", url: "/admin/newsletter", icon: Mail }],
  },
];

/** The nav entry a pathname sits under, used for the breadcrumb tail. */
export const findAdminNavItem = (pathname: string) => {
  const items = adminNav.flatMap((group) => group.items);
  const exact = items.find((item) => item.url === pathname);
  if (exact) return exact;
  return items
    .filter((item) => item.url !== "/admin" && pathname.startsWith(`${item.url}/`))
    .sort((a, b) => b.url.length - a.url.length)[0];
};
