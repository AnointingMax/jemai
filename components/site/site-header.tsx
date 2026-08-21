"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { BagIcon, ChevronDownIcon, SearchIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

const navItems: NavItem[] = [
  { label: "Furniture", href: "/furniture" },
  {
    label: "Art",
    href: "/artworks",
    children: [
      { label: "Shop All", href: "/artworks" },
      { label: "Architecture", href: "/artworks/architecture" },
      { label: "Fashion", href: "/artworks/fashion" },
      { label: "Line", href: "/artworks/line" },
      { label: "Paintings", href: "/artworks/paintings" },
    ],
  },
  { label: "Exhibitions", href: "/exhibitions" },
  { label: "About", href: "/about" },
  { label: "Consultations", href: "/consultation" },
  { label: "Contact", href: "/contact" },
];

const localizations = ["NGN", "EN"];

type SiteHeaderProps = {
  bagCount?: number;
};

export const SiteHeader = ({ bagCount = 0 }: SiteHeaderProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-page-gutter">
      <header className="mx-auto flex min-h-[60px] w-full max-w-[1728px] items-center justify-between gap-4">
        {/* Desktop navigation */}
        <nav className="hidden h-[60px] lg:flex lg:w-[608.5px]" aria-label="Main">
          <ul className="flex h-full flex-wrap items-stretch">
            {navItems.map((item) => (
              <li key={item.label} className="group relative flex items-center px-2">
                <Link
                  href={item.href}
                  className="text-label text-text-primary hover:text-action-link whitespace-nowrap transition-colors"
                >
                  {item.label}
                </Link>
                {item.children && (
                  <ul className="invisible absolute top-full left-2 z-20 w-[200px] max-w-[300px] min-w-[200px] rounded-b-[4px] bg-white py-4 opacity-0 shadow-[0_20px_20px_rgba(0,0,0,0.1)] transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    {item.children.map((child) => (
                      <li key={child.label}>
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
        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          className="text-icon-primary -ml-2 flex size-11 items-center justify-center lg:hidden"
        >
          {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>

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
          <div className="hidden h-[60px] items-center gap-2 md:flex">
            {localizations.map((code) => (
              <button
                key={code}
                type="button"
                className="text-label text-text-primary flex min-h-8 min-w-8 items-center justify-between gap-1"
              >
                {code}
                <ChevronDownIcon className="text-icon-primary w-[9px]" />
              </button>
            ))}
          </div>

          <div className="flex items-center pl-2 md:pl-4">
            <div className="hidden h-6 w-px bg-[#dfdfdf] md:block" />
            <button
              type="button"
              aria-label="Search"
              className="text-icon-primary flex size-11 items-center justify-center md:ml-4"
            >
              <SearchIcon className="size-8" />
            </button>
            <button
              type="button"
              className="bg-surface-inverse text-text-inverse text-label flex h-11 items-center justify-center gap-1.5 rounded-[2px] px-3.5 py-2 backdrop-blur-[7px] sm:px-[14px]"
            >
              <BagIcon className="size-4" />
              <span className="whitespace-nowrap">Bag ({bagCount})</span>
            </button>
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
                      <li key={child.label}>
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
          <div className={cn("flex items-center gap-4 pt-2 md:hidden")}>
            {localizations.map((code) => (
              <button
                key={code}
                type="button"
                className="text-label text-text-primary flex items-center gap-1"
              >
                {code}
                <ChevronDownIcon className="text-icon-primary w-[9px]" />
              </button>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
};
