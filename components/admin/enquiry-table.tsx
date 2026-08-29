"use client";

import { useMemo, useOptimistic, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { toast } from "sonner";

import { updateEnquiryStatusAction } from "@/app/admin/(dashboard)/artwork-enquiries/actions";

import { EnquirySheet } from "@/components/admin/enquiry-sheet";
import { SortableHead, nextSort, type SortState } from "@/components/admin/sortable-head";
import { StatusBadge } from "@/components/admin/status-badge";
import { TablePager } from "@/components/admin/table-pager";
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
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  describeArtwork,
  enquiredAt,
  enquiryStatuses,
  type AdminEnquiry,
  type EnquiryStatus,
} from "@/lib/admin/enquiry-record";

type RowKey = "reference" | "name" | "artworkTitle" | "receivedAt" | "status";

const PAGE_SIZE = 10;

/** The filter's "everything" option — a Select item cannot carry an empty value. */
const ALL = "All statuses";

/** Untouched first when the reader sorts on Status: it is the queue's whole point. */
const compare = (a: AdminEnquiry, b: AdminEnquiry, key: RowKey) =>
  key === "status"
    ? enquiryStatuses.indexOf(a.status) - enquiryStatuses.indexOf(b.status)
    : a[key].localeCompare(b[key]);

/**
 * Artwork enquiries: a search box and a status filter over a sortable table,
 * paged ten rows at a time. Filtering and sorting run client-side over the whole
 * queue, the same arrangement the newsletter and exhibition indexes use — the
 * page stays a server component and no keystroke costs a round trip.
 *
 * A row opens the enquiry in a side sheet; the enquiry number is a real button
 * so the same affordance is reachable from the keyboard.
 */
export const EnquiryTable = ({ enquiries }: { enquiries: AdminEnquiry[] }) => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>(ALL);
  const [sort, setSort] = useState<SortState<RowKey>>({ key: "receivedAt", direction: "desc" });
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);
  const router = useRouter();
  const [, startTransition] = useTransition();
  // The pill and the sheet's select move the moment the reader commits, then
  // the refreshed server data replaces the guess. A failed write leaves the
  // optimistic value behind with it, so the row snaps back to the truth.
  const [rows, applyStatus] = useOptimistic(
    enquiries,
    (current, edit: { id: string; status: EnquiryStatus }) =>
      current.map((enquiry) =>
        enquiry.id === edit.id ? { ...enquiry, status: edit.status } : enquiry
      )
  );

  const onStatusChange = (id: string, status: EnquiryStatus) =>
    startTransition(async () => {
      applyStatus({ id, status });
      const result = await updateEnquiryStatusAction({ id, status });

      if (result.error) {
        toast.error(result.message);
        return;
      }

      toast.success(result.data);
      router.refresh();
    });

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const matches = rows.filter(
      (row) =>
        (filter === ALL || row.status === filter) &&
        (!needle ||
          row.name.toLowerCase().includes(needle) ||
          row.email.toLowerCase().includes(needle) ||
          row.artworkTitle.toLowerCase().includes(needle))
    );
    const sorted = matches.sort((a, b) => compare(a, b, sort.key));
    return sort.direction === "asc" ? sorted : sorted.reverse();
  }, [rows, query, filter, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  // A search can strand the reader past the last page; clamp on render rather
  // than resetting in an effect, which would flash the old page first.
  const current = Math.min(page, pageCount);
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const onSort = (key: RowKey) => {
    setSort(nextSort(sort, key));
    setPage(1);
  };

  const open = rows.find((enquiry) => enquiry.id === openId) ?? null;

  return (
    <div className="flex flex-col gap-4">
      {/* Search and the status filter share the card above the table, the way
          the newsletter index gives search one of its own. */}
      <div className="border-border-default flex flex-col gap-3 rounded-xl border p-3 sm:flex-row">
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
            placeholder="Search name, email or artwork"
            aria-label="Search name, email or artwork"
            className="border-border-default bg-background h-10 pl-9 text-sm md:text-sm"
          />
        </div>
        <Select
          value={filter}
          onValueChange={(value) => {
            setFilter(value);
            setPage(1);
          }}
        >
          <SelectTrigger
            aria-label="Filter by status"
            className="border-border-default bg-background text-text-primary w-full text-sm data-[size=default]:h-10 sm:w-48"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[ALL, ...enquiryStatuses].map((value) => (
              <SelectItem key={value} value={value}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="border-border-default overflow-hidden rounded-xl border">
        {visible.length === 0 ? (
          <Empty className="py-16">
            <EmptyHeader>
              <EmptyTitle>No enquiries match</EmptyTitle>
              <EmptyDescription>
                Try a different name or artwork, or clear the search and filter.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="overflow-x-auto">
            <Table className="min-w-[860px]">
              <TableHeader className="bg-admin-muted">
                <TableRow className="border-border-default hover:bg-transparent">
                  <SortableHead sortKey="reference" sort={sort} onSort={onSort} className="h-11 px-6">
                    Enquiry
                  </SortableHead>
                  <SortableHead sortKey="name" sort={sort} onSort={onSort} className="h-11">
                    Enquirer
                  </SortableHead>
                  <SortableHead sortKey="artworkTitle" sort={sort} onSort={onSort} className="h-11">
                    Artwork
                  </SortableHead>
                  <SortableHead sortKey="receivedAt" sort={sort} onSort={onSort} className="h-11">
                    Received
                  </SortableHead>
                  <SortableHead
                    sortKey="status"
                    sort={sort}
                    onSort={onSort}
                    className="h-11 pr-6"
                  >
                    Status
                  </SortableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((enquiry) => (
                  <TableRow
                    key={enquiry.id}
                    onClick={() => setOpenId(enquiry.id)}
                    className="border-border-default hover:bg-admin-muted cursor-pointer"
                  >
                    <TableCell className="px-6 py-5">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setOpenId(enquiry.id);
                        }}
                        className="text-text-primary focus-visible:ring-ring/50 cursor-pointer rounded-sm text-sm outline-none focus-visible:ring-3"
                      >
                        {enquiry.reference}
                      </button>
                    </TableCell>
                    <TableCell className="py-5 pr-6 pl-0">
                      <span className="text-text-primary block text-sm font-medium">
                        {enquiry.name}
                      </span>
                      <span className="text-text-secondary block text-xs">{enquiry.email}</span>
                    </TableCell>
                    <TableCell className="text-text-secondary py-5 pr-6 pl-0 text-sm">
                      {describeArtwork(enquiry)}
                    </TableCell>
                    <TableCell className="text-text-secondary py-5 pr-6 pl-0 text-sm">
                      {enquiredAt(enquiry)}
                    </TableCell>
                    <TableCell className="py-5 pr-6 pl-0">
                      <StatusBadge status={enquiry.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <TablePager
          current={current}
          pageCount={pageCount}
          onGoTo={(next) => setPage(Math.min(Math.max(next, 1), pageCount))}
        />
      </div>

      <EnquirySheet
        enquiry={open}
        onOpenChange={(next) => !next && setOpenId(null)}
        onStatusChange={(status) => open && onStatusChange(open.id, status)}
      />
    </div>
  );
};
