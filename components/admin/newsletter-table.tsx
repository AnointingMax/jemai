"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { SortableHead, nextSort, type SortState } from "@/components/admin/sortable-head";
import { TableCountPager } from "@/components/admin/table-pager";
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

/** What the index draws off a subscriber. `subscribedAt` is what sorting reads. */
export type SubscriberRow = {
  email: string;
  name: string;
  source: string;
  /** "18 Aug · 07:56", already formatted. */
  date: string;
  subscribedAt: string;
};

type RowKey = "email" | "name" | "source" | "subscribedAt";

const PAGE_SIZE = 10;

/**
 * The frame's column proportions, as percentages of the card so they hold at
 * every width. They come off the 1440 frame as 308 / 283 / 284 / 261 of a
 * 1136px card — the Date column is the narrow one, not an equal quarter.
 */
const COLUMN_WIDTHS = ["27.1%", "24.9%", "25%", "23%"];

/**
 * Newsletter subscribers: a search box over a sortable table, paged ten rows at
 * a time. Filtering and sorting run client-side over the whole list, the same
 * arrangement the exhibitions index uses — the page stays a server component
 * and no keystroke costs a round trip.
 */
export const NewsletterTable = ({ rows }: { rows: SubscriberRow[] }) => {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortState<RowKey>>({ key: "subscribedAt", direction: "desc" });
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const matches = rows.filter(
      (row) =>
        !needle ||
        row.email.toLowerCase().includes(needle) ||
        row.name.toLowerCase().includes(needle)
    );
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
      <div className="border-border-default rounded-xl border p-3">
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
            placeholder="Search name or email"
            aria-label="Search name or email"
            className="border-border-default bg-background h-10 pl-9 text-sm md:text-sm"
          />
        </div>
      </div>

      <div className="border-border-default overflow-hidden rounded-xl border">
        {visible.length === 0 ? (
          <Empty className="py-16">
            <EmptyHeader>
              <EmptyTitle>No subscribers match</EmptyTitle>
              <EmptyDescription>Try a different name or address, or clear the search.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="overflow-x-auto">
            <Table className="min-w-[860px] table-fixed">
              <colgroup>
                {COLUMN_WIDTHS.map((width) => (
                  <col key={width} style={{ width }} />
                ))}
              </colgroup>
              <TableHeader className="bg-admin-muted">
                <TableRow className="border-border-default hover:bg-transparent">
                  <SortableHead sortKey="email" sort={sort} onSort={onSort} className="h-11 px-6">
                    Email address
                  </SortableHead>
                  <SortableHead sortKey="name" sort={sort} onSort={onSort} className="h-11">
                    Name
                  </SortableHead>
                  <SortableHead sortKey="source" sort={sort} onSort={onSort} className="h-11">
                    Source
                  </SortableHead>
                  <SortableHead sortKey="subscribedAt" sort={sort} onSort={onSort} className="h-11 pr-6">
                    Date
                  </SortableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((row) => (
                  <TableRow key={row.email} className="border-border-default">
                    <TableCell className="text-text-primary px-6 py-5.5 text-sm">
                      {row.email}
                    </TableCell>
                    {/* A footer sign-up only asks for an address, so the name can be blank. */}
                    <TableCell className="text-text-secondary py-5.5 pr-6 pl-0 text-sm">
                      {row.name || "—"}
                    </TableCell>
                    <TableCell className="text-text-secondary py-5.5 pr-6 pl-0 text-sm">
                      {row.source}
                    </TableCell>
                    <TableCell className="text-text-secondary py-5.5 pr-6 pl-0 text-sm">
                      {row.date}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <TableCountPager
          count={filtered.length}
          current={current}
          pageCount={pageCount}
          onGoTo={goTo}
        />
      </div>
    </div>
  );
};
