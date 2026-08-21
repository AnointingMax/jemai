"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ChevronDownIcon } from "@/components/icons";
import { ProductCard } from "@/components/site/product-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { catalogue, collections, colours } from "@/lib/products";

/** How many cards the frame draws before the first "Load more". */
const PAGE_SIZE = 16;

const sorts = {
  featured: "Sort — Featured",
  "price-asc": "Sort — Price, low to high",
  "price-desc": "Sort — Price, high to low",
  name: "Sort — Name, A to Z",
} as const;

type SortKey = keyof typeof sorts;

/** Shared field chrome: 34px tall, sitting on a hairline rather than in a box. */
const fieldClass =
  "border-border-default text-body-sm text-text-primary focus-visible:border-border-strong h-[34px] w-full border-b bg-transparent outline-none transition-colors";

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
};

const Field = ({ label, value, onChange, children }: FieldProps) => (
  <div className="relative">
    <label className="sr-only" htmlFor={`catalogue-${label}`}>
      {label}
    </label>
    <select
      id={`catalogue-${label}`}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={cn(fieldClass, "cursor-pointer appearance-none pr-6")}
    >
      {children}
    </select>
    <ChevronDownIcon
      aria-hidden
      className="text-text-primary pointer-events-none absolute top-1/2 right-1 w-[10px] -translate-y-1/2"
    />
  </div>
);

export const Catalogue = () => {
  const [collection, setCollection] = useState("All");
  const [query, setQuery] = useState("");
  const [availability, setAvailability] = useState("in-stock");
  const [colour, setColour] = useState("all");
  const [sort, setSort] = useState<SortKey>("featured");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const matches = catalogue.filter(
      (product) =>
        (collection === "All" || product.collection === collection) &&
        (colour === "all" || product.colour === colour) &&
        product.inStock === (availability === "in-stock") &&
        (needle === "" ||
          product.name.toLowerCase().includes(needle) ||
          product.category.toLowerCase().includes(needle)),
    );

    if (sort === "featured") return matches;
    if (sort === "name")
      return [...matches].sort((a, b) => a.name.localeCompare(b.name));
    return [...matches].sort((a, b) =>
      sort === "price-asc" ? a.amount - b.amount : b.amount - a.amount,
    );
  }, [availability, collection, colour, query, sort]);

  const shown = Math.min(visible, filtered.length);

  /** Every filter change restarts paging, so "Load more" never skips a page. */
  const repage = <T,>(set: (value: T) => void) => (value: T) => {
    set(value);
    setVisible(PAGE_SIZE);
  };

  const reset = () => {
    setCollection("All");
    setQuery("");
    setAvailability("in-stock");
    setColour("all");
    setSort("featured");
    setVisible(PAGE_SIZE);
  };

  return (
    <>
      <nav
        aria-label="Product categories"
        className="mt-8 w-full px-4 sm:px-6 lg:mt-9 lg:px-page-gutter"
      >
        <ul className="mx-auto flex w-full max-w-[1728px] items-center gap-5 overflow-x-auto lg:justify-center [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
          {["All", ...collections].map((item) => (
            <li key={item} className="flex">
              <button
                type="button"
                aria-current={collection === item ? "true" : undefined}
                onClick={() => repage(setCollection)(item)}
                className={cn(
                  "text-label border-b pb-1 font-normal whitespace-nowrap transition-colors",
                  collection === item
                    ? "border-text-primary text-text-primary"
                    : "text-text-primary/40 hover:text-text-primary/70 border-transparent",
                )}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Filter bar — its rules run the full width of the viewport */}
      <div className="border-border-default mt-1 w-full border-t border-b">
        <div className="w-full px-4 sm:px-6 lg:px-page-gutter">
          <div className="mx-auto flex w-full max-w-[1152px] flex-col gap-[15px] pt-3 pb-2.5">
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-[repeat(4,1fr)_80px]">
              <div>
                <label className="sr-only" htmlFor="catalogue-search">
                  Search catalogue
                </label>
                <input
                  id="catalogue-search"
                  type="search"
                  value={query}
                  onChange={(event) => repage(setQuery)(event.target.value)}
                  placeholder="Search Catalog"
                  className={cn(
                    fieldClass,
                    "border-border-default/50 placeholder:text-text-primary/40 [&::-webkit-search-cancel-button]:appearance-none",
                  )}
                />
              </div>

              <Field
                label="Availability"
                value={availability}
                onChange={repage(setAvailability)}
              >
                <option value="in-stock">In Stock</option>
                <option value="made-to-order">Made To Order</option>
              </Field>

              <Field label="Colour" value={colour} onChange={repage(setColour)}>
                <option value="all">Color</option>
                {colours.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Field>

              <Field
                label="Sort"
                value={sort}
                onChange={(value) => repage(setSort)(value as SortKey)}
              >
                {Object.entries(sorts).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Field>

              <button
                type="button"
                onClick={reset}
                className="border-border-default text-eyebrow-lg text-text-primary hover:border-border-strong h-[34px] rounded-[4px] border uppercase transition-colors"
              >
                Clear
              </button>
            </div>

            <p className="text-eyebrow-lg text-text-secondary uppercase">
              {filtered.length} {filtered.length === 1 ? "item" : "items"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 w-full px-4 sm:px-6 lg:mt-[41px] lg:px-page-gutter">
        <div className="mx-auto flex w-full max-w-[1728px] flex-col">
          {filtered.length > 0 ? (
            <>
              <div className="grid w-full grid-cols-1 gap-grid-gutter-compact sm:grid-cols-2 lg:grid-cols-4">
                {filtered.slice(0, shown).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              <div className="mt-5 flex flex-col items-center">
                <p className="text-body-sm text-[#3c4347]">
                  1-{shown} of {filtered.length} products
                </p>
                <div aria-hidden className="mt-1 h-px w-40 bg-[#eaeaea]">
                  <div
                    className="h-px bg-[#3c4347]"
                    style={{ width: `${(shown / filtered.length) * 100}%` }}
                  />
                </div>

                {shown < filtered.length && (
                  <Button
                    type="button"
                    size="cta"
                    onClick={() => setVisible((count) => count + PAGE_SIZE)}
                    className="mt-[30px] h-[47px] bg-[#333639] px-[30px] hover:bg-[#333639]/90"
                  >
                    Load more
                  </Button>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-stack-default py-stack-feature text-center">
              <p className="text-body text-text-secondary">
                Nothing in the catalogue matches these filters yet.
              </p>
              <button
                type="button"
                onClick={reset}
                className="text-label text-action-link underline-offset-4 hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

/** Home › Furniture, centred above the page title. */
export const CatalogueBreadcrumb = () => (
  <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2.5">
    <Link
      href="/"
      className="text-body-xs text-text-primary underline-offset-4 hover:underline"
    >
      Home
    </Link>
    <ChevronRight aria-hidden className="text-text-secondary size-3" />
    <span className="text-body-xs text-text-secondary" aria-current="page">
      Furniture
    </span>
  </nav>
);
