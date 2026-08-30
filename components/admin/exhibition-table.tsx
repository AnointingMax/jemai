"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { SortableHead, nextSort, type SortState } from "@/components/admin/sortable-head";
import { StatusBadge } from "@/components/admin/status-badge";
import { TablePager } from "@/components/admin/table-pager";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ExhibitionStatus } from "@/lib/admin/exhibitions";

/** What the index needs off an exhibition — never the media or the long copy. */
export type ExhibitionRow = {
  slug: string;
  name: string;
  /** "15 Aug – 14 Sep", already formatted; `startDate` is what sorting reads. */
  dates: string;
  startDate: string;
  venue: string;
  admission: string;
  status: ExhibitionStatus;
};

type RowKey = "name" | "startDate" | "status";

const PAGE_SIZE = 8;

/**
 * The exhibitions index: a search box over a sortable table, paged eight rows
 * at a time. Filtering and sorting run client-side over the whole programme —
 * it is small enough that a round trip per keystroke would be the slower
 * option, and it keeps the page a plain server component.
 */
export const ExhibitionTable = ({ rows }: { rows: ExhibitionRow[] }) => {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortState<RowKey>>({ key: "startDate", direction: "desc" });
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const matches = rows.filter((row) => !needle || row.name.toLowerCase().includes(needle));
    const sorted = matches.sort((a, b) => a[sort.key].localeCompare(b[sort.key]));
    return sort.direction === "asc" ? sorted : sorted.reverse();
  }, [rows, query, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  // A search can strand the reader past the last page; clamp on render rather
  // than resetting in an effect, which would flash the old page first.
  const current = Math.min(page, pageCount);
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const goTo = (next: number) => setPage(Math.min(Math.max(next, 1), pageCount));

  const onSort = (key: RowKey) => {
    setSort(nextSort(sort, key));
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* The frame gives search its own card, above and separate from the table. */}
      <div className="border-border-default rounded-xl border p-4">
        <div className="relative w-full">
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
            placeholder="Search exhibition name"
            aria-label="Search exhibition name"
            className="border-border-default bg-background h-11 pl-9 text-sm md:text-sm"
          />
        </div>
      </div>

      <div className="border-border-default overflow-hidden rounded-xl border">
        {visible.length === 0 ? (
          <Empty className="py-16">
            <EmptyHeader>
              <EmptyTitle>No exhibitions match</EmptyTitle>
              <EmptyDescription>Try a different name, or clear the search.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="overflow-x-auto">
            <Table className="min-w-[860px]">
              <TableHeader className="bg-admin-muted">
                <TableRow className="border-border-default hover:bg-transparent">
                  <SortableHead sortKey="name" sort={sort} onSort={onSort} className="px-6">
                    Exhibition
                  </SortableHead>
                  <SortableHead sortKey="startDate" sort={sort} onSort={onSort}>
                    Date
                  </SortableHead>
                  <TableHead className="text-text-secondary h-12 pr-6 pl-0 text-sm font-normal">
                    Venue
                  </TableHead>
                  <TableHead className="text-text-secondary h-12 pr-6 pl-0 text-sm font-normal">
                    Admission
                  </TableHead>
                  <SortableHead sortKey="status" sort={sort} onSort={onSort}>
                    Status
                  </SortableHead>
                  <TableHead className="h-12 px-6 text-right">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((row) => (
                  <TableRow key={row.slug} className="border-border-default">
                    <TableCell className="px-6 py-4">
                      <Link
                        href={`/admin/exhibitions/${row.slug}`}
                        className="text-text-primary focus-visible:ring-ring/50 rounded-sm text-sm font-medium outline-none focus-visible:ring-3"
                      >
                        {row.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-text-secondary py-4 pr-6 pl-0 text-sm">
                      {row.dates}
                    </TableCell>
                    <TableCell className="text-text-primary py-4 pr-6 pl-0 text-sm">
                      {row.venue}
                    </TableCell>
                    <TableCell className="text-text-primary py-4 pr-6 pl-0 text-sm">
                      {row.admission}
                    </TableCell>
                    <TableCell className="py-4 pr-6 pl-0">
                      <StatusBadge status={row.status} />
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="border-border-default h-8 px-3 text-sm"
                        >
                          <Link href={`/admin/exhibitions/${row.slug}/attendees`}>
                            View attendees
                          </Link>
                        </Button>
                        <Button
                          variant="link"
                          size="sm"
                          asChild
                          className="text-action-link h-auto p-0"
                        >
                          <Link href={`/admin/exhibitions/${row.slug}/edit`}>Edit</Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <TablePager current={current} pageCount={pageCount} onGoTo={goTo} />
      </div>
    </div>
  );
};
