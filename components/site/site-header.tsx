"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { BagIcon, SearchIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import type { MenuLink, SiteMenus } from "@/lib/navigation";

type NavItem = {
  label: string;
  href: string;
  children?: MenuLink[];
  mobileOnly?: boolean;
};

const buildNav = (menus: SiteMenus): NavItem[] => [
  {
    label: "Furniture",
    href: "/furniture",
    children: menus.furniture.length > 1 ? menus.furniture : undefined,
  },
  {
    label: "Art",
    href: "/artworks",
    children: menus.art.length > 1 ? menus.art : undefined,
  },
  { label: "Exhibitions", href: "/exhibitions" },
  { label: "About", href: "/about", mobileOnly: true },
  { label: "Consultations", href: "/consultation" },
  { label: "Contact", href: "/contact", mobileOnly: true },
];

export const SiteHeader = ({ menus }: { menus: SiteMenus; }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { count, setOpen } = useCart();

  const navItems = buildNav(menus);
  const desktopNavItems = navItems.filter((item) => !item.mobileOnly);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-page-gutter">
      <header className="mx-auto flex min-h-15 w-full max-w-432 items-center justify-between gap-4">
        {/* Desktop navigation */}
        <nav className="hidden h-15 lg:flex flex-1" aria-label="Main">
          <ul className="flex h-full flex-wrap items-stretch">
            {desktopNavItems.map((item) => (
              <li key={item.label} className="group relative flex items-center px-2">
                <Link
                  href={item.href}
                  className="text-label text-text-primary hover:text-action-link whitespace-nowrap transition-colors"
                >
                  {item.label}
                </Link>
                {item.children && (
                  <ul className="invisible absolute top-full left-2 z-20 w-50 max-w-75 min-w-50 rounded-b-[4px] bg-white py-4 opacity-0 shadow-[0_20px_20px_rgba(0,0,0,0.1)] transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className="text-label text-text-primary hover:text-action-link block px-6 py-2 transition-colors"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile menu toggle */}
        <Button
          type="button"
          variant="quiet"
          size="icon-touch"
          onClick={() => setMobileOpen((open) => !open)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          className="text-icon-primary -ml-2 lg:hidden"
        >
          {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </Button>

        <Link href="/" aria-label="JEMAI home" className="shrink-0 py-[12.375px]">
          <Image
            src="/figma/brand/wordmark.svg"
            alt="JEMAI"
            width={96}
            height={24}
            priority
            unoptimized
          />
        </Link>

        <div className="flex flex-1 items-center justify-end">
          <div className="flex items-center pl-2 md:pl-4">
            <div className="hidden h-6 w-px bg-[#dfdfdf] md:block" />
            <Button
              type="button"
              variant="quiet"
              size="icon-touch"
              aria-label="Search"
              className="text-icon-primary md:ml-4"
            >
              <SearchIcon className="size-8" />
            </Button>
            <Button
              type="button"
              variant="inverse"
              onClick={() => setOpen(true)}
              aria-label={`Open cart, ${count} ${count === 1 ? "item" : "items"}`}
              className="text-label h-11 gap-1.5 px-3.5 py-2 sm:px-3.5"
            >
              <BagIcon className="size-4" />
              <span className="whitespace-nowrap">Bag ({count})</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile navigation */}
      {mobileOpen && (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="border-border-default border-t py-stack-copy lg:hidden"
        >
          <ul className="flex flex-col">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-label text-text-primary block py-3"
                >
                  {item.label}
                </Link>
                {item.children && (
                  <ul className="pb-2 pl-4">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          className="text-body-sm text-text-secondary block py-2"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
};
