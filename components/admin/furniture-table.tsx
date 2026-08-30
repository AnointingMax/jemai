"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { SortableHead, nextSort, type SortState } from "@/components/admin/sortable-head";
import { useTableQuery } from "@/components/admin/use-table-query";
import { TablePager } from "@/components/admin/table-pager";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
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
import { naira } from "@/lib/admin/content";

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

/** The category filter's "everything" value — a Select item cannot carry "". */
export const ALL_CATEGORIES = "all";

const PAGE_SIZE = 8;

const compare = (a: FurnitureRow, b: FurnitureRow, key: RowKey) =>
  key === "price" || key === "stock"
    ? a[key] - b[key]
    : String(a[key]).localeCompare(String(b[key]));

/**
 * The furniture index: a search-and-filter bar over a sortable table, paged
 * eight rows at a time.
 *
 * Search and filter live in the URL and run in the database, so the view
 * survives a reload, walks back through history and can be sent as a link —
 * and an export takes what the query returned rather than what happened to be
 * fetched. Sorting and paging are done here, over the rows that came back.
 */
export const FurnitureTable = ({
  rows,
  categories,
  search,
  category,
}: {
  rows: FurnitureRow[];
  categories: string[];
  /** The search the page queried with, as it stands in the URL. */
  search: string;
  /** Likewise the category filter, or "all". */
  category: string;
}) => {
  const [sort, setSort] = useState<SortState<RowKey>>({ key: "updatedAt", direction: "desc" });
  const [page, setPage] = useState(1);

  // Search and category narrow the query the page ran; only the ordering is
  // left to do here, over the rows that came back.
  const { term, setTerm, onFilter, navigating } = useTableQuery({
    search,
    filter: category,
    filterKey: "category",
    filterAll: ALL_CATEGORIES,
    onNarrow: () => setPage(1),
  });

  const filtered = useMemo(() => {
    const sorted = [...rows].sort((a, b) => compare(a, b, sort.key));
    return sort.direction === "asc" ? sorted : sorted.reverse();
  }, [rows, sort]);

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
    <div
      className={`border-border-default overflow-hidden rounded-xl border transition-opacity ${
        navigating ? "opacity-60" : ""
      }`}
    >
      <div className="border-border-default bg-admin-muted flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center">
        <div className="relative w-full">
          <Search
            aria-hidden
            className="text-text-secondary pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
          />
          <Input
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Search by product name"
            aria-label="Search by product name"
            className="border-border-default bg-background h-10 pl-9 text-sm md:text-sm"
          />
        </div>
        <Select value={category} onValueChange={onFilter}>
          <SelectTrigger
            aria-label="Filter by category"
            disabled={navigating}
            className="border-border-default bg-background w-full text-sm data-[size=default]:h-10 sm:w-fit"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_CATEGORIES}>All</SelectItem>
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

      <TablePager current={current} pageCount={pageCount} onGoTo={goTo} />
    </div>
  );
};
