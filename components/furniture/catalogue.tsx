"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/site/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { LoadMorePager } from "@/components/shared/load-more-pager";
import type { CatalogueProduct } from "@/lib/products";

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
  "border-border-default text-body-sm text-text-primary focus-visible:border-border-strong h-8.5 w-full rounded-none border-0 border-b bg-transparent px-0 shadow-none ring-0 transition-colors focus-visible:ring-0 dark:bg-transparent";

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
};

const Field = ({ label, value, onChange, children }: FieldProps) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger
      aria-label={label}
      className={cn(
        fieldClass,
        // The trigger renders its own chevron; the frame draws a narrow one in
        // the primary ink rather than shadcn's 16px muted glyph.
        "data-[size=default]:h-8.5 [&>svg]:size-2.5 [&>svg]:text-text-primary",
      )}
    >
      <SelectValue />
    </SelectTrigger>
    <SelectContent>{children}</SelectContent>
  </Select>
);

type CatalogueProps = {
  products: CatalogueProduct[];
  collections: string[];
  colors: string[];
  collection: string;
};

export const Catalogue = ({
  products,
  collections,
  colors,
  collection,
}: CatalogueProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [availability, setAvailability] = useState("in-stock");
  const [colour, setColour] = useState("all");
  const [sort, setSort] = useState<SortKey>("featured");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const setCollection = useCallback(
    (value: string) => {
      const params = new URLSearchParams(window.location.search);
      if (value === "All") params.delete("collection");
      else params.set("collection", value);

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
      setVisible(PAGE_SIZE);
    },
    [pathname, router],
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const matches = products.filter(
      (product) =>
        (collection === "All" || product.collection === collection) &&
        (colour === "all" || product.colors.includes(colour)) &&
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
  }, [availability, collection, colour, products, query, sort]);

  const shown = Math.min(visible, filtered.length);

  /** Every filter change restarts paging, so "Load more" never skips a page. */
  const repage =
    <T,>(set: (value: T) => void) =>
      (value: T) => {
        set(value);
        setVisible(PAGE_SIZE);
      };

  const reset = () => {
    setQuery("");
    setAvailability("in-stock");
    setColour("all");
    setSort("featured");
    setVisible(PAGE_SIZE);
    // Last, because it repages and navigates on its own.
    setCollection("All");
  };

  return (
    <>
      <nav
        aria-label="Product categories"
        className="mt-8 w-full px-4 sm:px-6 lg:mt-9 lg:px-page-gutter"
      >
        <ToggleGroup
          type="single"
          variant="tab"
          size="tab"
          spacing={5}
          value={collection}
          onValueChange={(value) => setCollection(value || "All")}
          className="mx-auto w-full max-w-432 justify-start overflow-x-auto lg:justify-center [&::-webkit-scrollbar]:hidden scrollbar-none"
        >
          {["All", ...collections].map((item) => (
            <ToggleGroupItem
              key={item}
              value={item}
              className="whitespace-nowrap"
            >
              {item}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </nav>

      {/* Filter bar — its rules run the full width of the viewport */}
      <div className="border-border-default mt-1 w-full border-t border-b">
        <div className="w-full px-4 sm:px-6 lg:px-page-gutter">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-3.75 pt-3 pb-2.5">
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-[repeat(4,1fr)_80px]">
              <div>
                <label className="sr-only" htmlFor="catalogue-search">
                  Search catalogue
                </label>
                <Input
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
                <SelectItem value="in-stock">In Stock</SelectItem>
                <SelectItem value="made-to-order">Made To Order</SelectItem>
              </Field>

              <Field label="Colour" value={colour} onChange={repage(setColour)}>
                <SelectItem value="all">Color</SelectItem>
                {colors.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </Field>

              <Field
                label="Sort"
                value={sort}
                onChange={(value) => repage(setSort)(value as SortKey)}
              >
                {Object.entries(sorts).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </Field>

              <Button
                type="button"
                variant="chip"
                size="field"
                onClick={reset}
                className="border"
              >
                Clear
              </Button>
            </div>

            <p className="text-eyebrow-lg text-text-secondary uppercase">
              {filtered.length} {filtered.length === 1 ? "item" : "items"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 w-full px-4 sm:px-6 lg:mt-10.25 lg:px-page-gutter">
        <div className="mx-auto flex w-full max-w-432 flex-col">
          {filtered.length > 0 ? (
            <>
              <div className="grid w-full grid-cols-1 gap-grid-gutter-compact sm:grid-cols-2 lg:grid-cols-4">
                {filtered.slice(0, shown).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              <div className="mt-5 flex flex-col items-center">
                <LoadMorePager
                  shown={shown}
                  total={filtered.length}
                  noun="products"
                  onLoadMore={() => setVisible((count) => count + PAGE_SIZE)}
                />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-stack-default py-stack-feature text-center">
              <p className="text-body text-text-secondary">
                Nothing in the catalogue matches these filters yet.
              </p>
              <Button
                type="button"
                variant="link"
                onClick={reset}
                className="text-label text-action-link h-auto p-0 underline-offset-4"
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

/** Home › Furniture, centred above the page title. */
export const CatalogueBreadcrumb = () => (
  <nav
    aria-label="Breadcrumb"
    className="flex items-center justify-center gap-2.5"
  >
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
