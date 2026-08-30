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

import { hasPermission, type AdminPermission } from "@/lib/admin/auth/permissions";

export type AdminNavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  permission?: AdminPermission;
};

export type AdminNavGroup = {
  title: string;
  items: AdminNavItem[];
};

export const adminNav: AdminNavGroup[] = [
  {
    title: "Content",
    items: [
      { title: "Overview", url: "/admin", icon: LayoutDashboard },
      { title: "Furniture", url: "/admin/furniture", icon: Armchair, permission: "furniture" },
      { title: "Artworks", url: "/admin/artworks", icon: Frame, permission: "artworks" },
      { title: "Exhibitions", url: "/admin/exhibitions", icon: CalendarDays, permission: "exhibitions" },
    ],
  },
  {
    title: "Operations",
    items: [
      { title: "Furniture orders", url: "/admin/orders", icon: ShoppingBag, permission: "orders" },
      {
        title: "Artwork enquiries",
        url: "/admin/artwork-enquiries",
        icon: MessageSquare,
        permission: "artwork-enquiries",
      },
      {
        title: "Consultation requests",
        url: "/admin/consultation-requests",
        icon: ClipboardList,
        permission: "consultation-requests",
      },
    ],
  },
  {
    title: "Audience",
    items: [
      { title: "Newsletter", url: "/admin/newsletter", icon: Mail, permission: "newsletter" },
    ],
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

export const visibleAdminNav = (permissions: readonly string[]): AdminNavGroup[] =>
  adminNav
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) => !item.permission || hasPermission(permissions, item.permission),
      ),
    }))
    .filter((group) => group.items.length);
