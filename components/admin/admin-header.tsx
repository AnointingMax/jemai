"use client";

import { Fragment } from "react";

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
 * The segments below a section's own route, as the breadcrumb prints them:
 * `new` becomes "Add new Furniture", and a slug is title-cased back into a name.
 * A slug that carried an accent comes back without it — the sections that need
 * the exact name can grow their own crumb later.
 */
const describeSegment = (segment: string, section: string) => {
  // "Artworks" names the section but "Add new Artwork" names one record, so the
  // crumb drops a trailing plural. "Furniture" has none and is left alone.
  if (segment === "new") return `Add new ${section.replace(/s$/, "")}`;
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/**
 * The 64px console header: rail toggle, then a breadcrumb — JEMAI Admin, the
 * nav entry the route sits under, and a crumb per segment below it.
 */
export const AdminHeader = () => {
  const pathname = usePathname();
  const current = findAdminNavItem(pathname);
  const section = current?.title ?? "Overview";
  const trail = current
    ? pathname
        .slice(current.url.length)
        .split("/")
        .filter(Boolean)
        .map((segment) => describeSegment(segment, section))
    : [];

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
            {trail.length && current ? (
              <BreadcrumbLink asChild className="text-text-secondary font-normal">
                <Link href={current.url}>{section}</Link>
              </BreadcrumbLink>
            ) : (
              <BreadcrumbPage className="text-text-primary font-medium">{section}</BreadcrumbPage>
            )}
          </BreadcrumbItem>
          {trail.map((crumb, index) => (
            <Fragment key={crumb}>
              <BreadcrumbSeparator className="text-text-secondary" />
              <BreadcrumbItem>
                {index === trail.length - 1 ? (
                  <BreadcrumbPage className="text-text-primary font-medium">
                    {crumb}
                  </BreadcrumbPage>
                ) : (
                  <span className="text-text-secondary font-normal">{crumb}</span>
                )}
              </BreadcrumbItem>
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
};
