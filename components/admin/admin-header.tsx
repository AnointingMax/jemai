"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { findAdminNavItem } from "@/components/admin/nav";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

/**
 * The 64px console header: rail toggle, then a breadcrumb whose tail is the nav
 * entry the current route sits under.
 */
export const AdminHeader = () => {
  const pathname = usePathname();
  const current = findAdminNavItem(pathname);

  return (
    <header className="border-border-default bg-background sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="text-text-primary" />
      <Separator
        orientation="vertical"
        className="bg-border-default mr-2 data-vertical:h-4 data-vertical:self-center"
      />
      <Breadcrumb>
        <BreadcrumbList className="text-label sm:gap-2.5">
          <BreadcrumbItem>
            <BreadcrumbLink asChild className="text-text-secondary font-normal">
              <Link href="/admin">JEMAI Admin</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-text-secondary" />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-text-primary font-medium">
              {current?.title ?? "Overview"}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
};
