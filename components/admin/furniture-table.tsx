"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { SortableHead, nextSort, type SortState } from "@/components/admin/sortable-head";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { naira } from "@/lib/admin/furniture";

/** What the index needs off a product — never the media or the long copy. */
export type FurnitureRow = {
  slug: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  options: string;
  updatedAt: string;
  updatedLabel: string;
  thumbnail: string | null;
};

type RowKey = "name" | "category" | "price" | "stock" | "updatedAt";

const PAGE_SIZE = 8;

const compare = (a: FurnitureRow, b: FurnitureRow, key: RowKey) =>
  key === "price" || key === "stock"
    ? a[key] - b[key]
    : String(a[key]).localeCompare(String(b[key]));

/**
 * The page numbers the frame draws: the first three, an ellipsis, then the last
 * three — collapsing to a plain run whenever the whole set fits in seven slots.
 */
const pageWindow = (total: number, current: number): (number | "ellipsis")[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const edges = new Set([1, 2, 3, total - 2, total - 1, total, current]);
  const pages = [...edges].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b);
  return pages.flatMap((page, index) =>
    index > 0 && page - pages[index - 1] > 1 ? (["ellipsis", page] as const) : [page]
  );
};

/**
 * The furniture index: a search-and-filter bar over a sortable table, paged
 * eight rows at a time. All of it is client-side over the full list — the
 * catalogue is small enough that a round trip per keystroke would be the slower
 * option, and it keeps the page a plain server component.
 */
export const FurnitureTable = ({
  rows,
  categories,
}: {
  rows: FurnitureRow[];
  categories: string[];
}) => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<SortState<RowKey>>({ key: "updatedAt", direction: "desc" });
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const matches = rows.filter(
      (row) =>
        (category === "all" || row.category === category) &&
        (!needle || row.name.toLowerCase().includes(needle))
    );
    const sorted = matches.sort((a, b) => compare(a, b, sort.key));
    return sort.direction === "asc" ? sorted : sorted.reverse();
  }, [rows, query, category, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  // A filter change can strand the reader past the last page; clamp on render
  // rather than resetting in an effect, which would flash the old page first.
  const current = Math.min(page, pageCount);
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const goTo = (next: number) => setPage(Math.min(Math.max(next, 1), pageCount));

  const onSort = (key: RowKey) => {
    setSort(nextSort(sort, key));
    setPage(1);
  };

  return (
    <div className="border-border-default overflow-hidden rounded-xl border">
      <div className="border-border-default flex flex-col gap-3 border-b bg-admin-muted p-4 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-[680px]">
          <Search
            aria-hidden
            className="text-text-secondary pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
          />
          <Input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Search by product name"
            aria-label="Search by product name"
            className="border-border-default bg-background h-10 pl-9 text-sm md:text-sm"
          />
        </div>
        <Select
          value={category}
          onValueChange={(value) => {
            setCategory(value);
            setPage(1);
          }}
        >
          <SelectTrigger
            aria-label="Filter by category"
            className="border-border-default bg-background h-10 w-full text-sm sm:w-24"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {categories.map((value) => (
              <SelectItem key={value} value={value}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {visible.length === 0 ? (
        <Empty className="py-16">
          <EmptyHeader>
            <EmptyTitle>No products match</EmptyTitle>
            <EmptyDescription>
              Try a different name, or clear the category filter.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <Table className="min-w-[860px]">
          <TableHeader>
            <TableRow className="border-border-default hover:bg-transparent">
              <SortableHead sortKey="name" sort={sort} onSort={onSort} className="px-4">
                Name
              </SortableHead>
              <SortableHead sortKey="category" sort={sort} onSort={onSort}>
                Category
              </SortableHead>
              <SortableHead sortKey="price" sort={sort} onSort={onSort}>
                Price
              </SortableHead>
              <SortableHead sortKey="stock" sort={sort} onSort={onSort}>
                Stock
              </SortableHead>
              <TableHead className="text-text-secondary h-12 pr-6 pl-0 text-sm font-normal">
                Options
              </TableHead>
              <SortableHead sortKey="updatedAt" sort={sort} onSort={onSort}>
                Updated
              </SortableHead>
              <TableHead className="h-12 px-4 text-right">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map((row) => (
              <TableRow key={row.slug} className="border-border-default">
                <TableCell className="px-4 py-3">
                  <Link
                    href={`/admin/furniture/${row.slug}`}
                    className="text-text-primary focus-visible:ring-ring/50 flex items-center gap-3 rounded-sm text-sm font-medium outline-none focus-visible:ring-3"
                  >
                    <span className="bg-surface-subtle relative size-9 shrink-0 overflow-hidden rounded-md">
                      {row.thumbnail ? (
                        <Image
                          src={row.thumbnail}
                          alt=""
                          fill
                          sizes="36px"
                          className="object-cover"
                        />
                      ) : null}
                    </span>
                    {row.name}
                  </Link>
                </TableCell>
                <TableCell className="text-text-secondary py-3 pr-6 pl-0 text-sm">
                  {row.category}
                </TableCell>
                <TableCell className="text-text-primary py-3 pr-6 pl-0 text-sm">
                  {naira(row.price)}
                </TableCell>
                <TableCell className="text-text-primary py-3 pr-6 pl-0 text-sm">{row.stock}</TableCell>
                <TableCell className="text-text-secondary py-3 pr-6 pl-0 text-sm">
                  {row.options}
                </TableCell>
                <TableCell className="text-text-secondary py-3 pr-6 pl-0 text-sm">
                  {row.updatedLabel}
                </TableCell>
                <TableCell className="px-4 py-3 text-right">
                  <Button variant="link" size="sm" asChild className="text-action-link h-auto p-0">
                    <Link href={`/admin/furniture/${row.slug}/edit`}>Edit</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <div className="border-border-default border-t p-4">
        <Pagination>
          <PaginationContent className="w-full justify-between gap-2">
            <PaginationItem>
              <PaginationPrevious
                href="#"
                aria-disabled={current === 1}
                className="border-border-default h-10 border data-[disabled=true]:pointer-events-none aria-disabled:pointer-events-none aria-disabled:opacity-50"
                onClick={(event) => {
                  event.preventDefault();
                  goTo(current - 1);
                }}
              />
            </PaginationItem>
            <div className="flex items-center gap-1">
              {pageWindow(pageCount, current).map((page, index) =>
                page === "ellipsis" ? (
                  <PaginationItem key={`gap-${index}`}>
                    <span className="text-text-secondary flex size-9 items-center justify-center text-sm">
                      …
                    </span>
                  </PaginationItem>
                ) : (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      isActive={page === current}
                      className="size-9"
                      onClick={(event) => {
                        event.preventDefault();
                        goTo(page);
                      }}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
            </div>
            <PaginationItem>
              <PaginationNext
                href="#"
                aria-disabled={current === pageCount}
                className="border-border-default h-10 border data-[disabled=true]:pointer-events-none aria-disabled:pointer-events-none aria-disabled:opacity-50"
                onClick={(event) => {
                  event.preventDefault();
                  goTo(current + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};
