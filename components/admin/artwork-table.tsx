"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { SortableHead, nextSort, type SortState } from "@/components/admin/sortable-head";
import { useTableQuery } from "@/components/admin/use-table-query";
import { Badge } from "@/components/ui/badge";
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

/** What the index needs off an artwork — never the media or the story HTML. */
export type ArtworkRow = {
  slug: string;
  title: string;
  artist: string;
  medium: string;
  curatorsPick: boolean;
  updatedAt: string;
  updatedLabel: string;
  thumbnail: string | null;
};

type RowKey = "title" | "artist" | "medium" | "updatedAt";

/** The medium filter's "everything" value — a Select item cannot carry "". */
export const ALL_MEDIUMS = "all";

const PAGE_SIZE = 8;

const compare = (a: ArtworkRow, b: ArtworkRow, key: RowKey) =>
  String(a[key]).localeCompare(String(b[key]));

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
 * The artwork index. Same shape as the furniture one — a URL-held search and
 * medium filter narrowing the query, sortable columns, eight rows a page — but
 * the columns are the gallery's: artist and medium in place of price and stock,
 * and no money anywhere on the screen.
 */
export const ArtworkTable = ({
  rows,
  mediums,
  search,
  medium,
}: {
  rows: ArtworkRow[];
  mediums: string[];
  /** The search the page queried with, as it stands in the URL. */
  search: string;
  /** Likewise the medium filter, or "all". */
  medium: string;
}) => {
  const [sort, setSort] = useState<SortState<RowKey>>({ key: "updatedAt", direction: "desc" });
  const [page, setPage] = useState(1);

  // Search and medium narrow the query the page ran; only the ordering is left
  // to do here, over the rows that came back.
  const { term, setTerm, onFilter, navigating } = useTableQuery({
    search,
    filter: medium,
    filterKey: "medium",
    filterAll: ALL_MEDIUMS,
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
        <div className="relative w-full sm:max-w-[680px]">
          <Search
            aria-hidden
            className="text-text-secondary pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
          />
          <Input
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Search by title or artist"
            aria-label="Search by title or artist"
            className="border-border-default bg-background h-10 pl-9 text-sm md:text-sm"
          />
        </div>
        <Select value={medium} onValueChange={onFilter}>
          <SelectTrigger
            aria-label="Filter by medium"
            disabled={navigating}
            className="border-border-default bg-background h-10 w-full text-sm sm:w-24"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_MEDIUMS}>All</SelectItem>
            {mediums.map((value) => (
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
            <EmptyTitle>No artworks match</EmptyTitle>
            <EmptyDescription>
              Try a different title or artist, or clear the medium filter.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <Table className="min-w-[760px]">
          <TableHeader>
            <TableRow className="border-border-default hover:bg-transparent">
              <SortableHead sortKey="title" sort={sort} onSort={onSort} className="px-4">
                Name
              </SortableHead>
              <SortableHead sortKey="artist" sort={sort} onSort={onSort}>
                Artist
              </SortableHead>
              <SortableHead sortKey="medium" sort={sort} onSort={onSort}>
                Medium
              </SortableHead>
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
                    href={`/admin/artworks/${row.slug}`}
                    className="text-text-primary focus-visible:ring-ring/50 flex items-center gap-3 rounded-sm text-sm font-medium outline-none focus-visible:ring-3"
                  >
                    <span className="bg-surface-subtle relative size-9 shrink-0 overflow-hidden rounded-md">
                      {row.thumbnail ? (
                        <Image src={row.thumbnail} alt="" fill sizes="36px" className="object-cover" />
                      ) : null}
                    </span>
                    {row.title}
                    {row.curatorsPick ? (
                      <Badge
                        variant="outline"
                        className="border-border-default text-text-secondary h-5 rounded-full px-2 text-[10px] font-medium"
                      >
                        Curator&rsquo;s Pick
                      </Badge>
                    ) : null}
                  </Link>
                </TableCell>
                <TableCell className="text-text-secondary py-3 pr-6 pl-0 text-sm">
                  {row.artist}
                </TableCell>
                <TableCell className="text-text-secondary py-3 pr-6 pl-0 text-sm">
                  {row.medium}
                </TableCell>
                <TableCell className="text-text-secondary py-3 pr-6 pl-0 text-sm">
                  {row.updatedLabel}
                </TableCell>
                <TableCell className="px-4 py-3 text-right">
                  <Button variant="link" size="sm" asChild className="text-action-link h-auto p-0">
                    <Link href={`/admin/artworks/${row.slug}/edit`}>Edit</Link>
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
