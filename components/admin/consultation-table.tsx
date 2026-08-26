"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { ConsultationSheet } from "@/components/admin/consultation-sheet";
import { SortableHead, nextSort, type SortState } from "@/components/admin/sortable-head";
import { StatusBadge } from "@/components/admin/status-badge";
import { TableCountPager } from "@/components/admin/table-pager";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import {
  consultationStatuses,
  consultationWindow,
  requestedAt,
  type AdminConsultation,
  type ConsultationStatus,
} from "@/lib/admin/consultations";

type RowKey = "id" | "name" | "projectType" | "startDate" | "receivedAt" | "status";

const PAGE_SIZE = 10;

/** The filter's "everything" option — a Select item cannot carry an empty value. */
const ALL = "All statuses";

/** Untouched first when the reader sorts on Status: it is the queue's whole point. */
const compare = (a: AdminConsultation, b: AdminConsultation, key: RowKey) =>
  key === "status"
    ? consultationStatuses.indexOf(a.status) - consultationStatuses.indexOf(b.status)
    : a[key].localeCompare(b[key]);

/**
 * Design consultation requests: a search box and a status filter over a
 * sortable table, paged ten rows at a time. Filtering and sorting run
 * client-side over the whole queue, as on the enquiries index — the page stays
 * a server component and no keystroke costs a round trip.
 *
 * A row opens the brief in a side sheet; the request number is a real button so
 * the same affordance is reachable from the keyboard.
 */
export const ConsultationTable = ({ requests }: { requests: AdminConsultation[] }) => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>(ALL);
  const [sort, setSort] = useState<SortState<RowKey>>({ key: "receivedAt", direction: "desc" });
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);
  // Status edits live here until the consultation endpoint exists, so the
  // sheet's select and the table's pill stay in agreement for the session.
  const [overrides, setOverrides] = useState<Record<string, ConsultationStatus>>({});

  const rows = useMemo(
    () =>
      requests.map((request) =>
        overrides[request.id] ? { ...request, status: overrides[request.id] } : request
      ),
    [requests, overrides]
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const matches = rows.filter(
      (row) =>
        (filter === ALL || row.status === filter) &&
        (!needle ||
          row.name.toLowerCase().includes(needle) ||
          row.email.toLowerCase().includes(needle) ||
          row.projectType.toLowerCase().includes(needle))
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

  const open = rows.find((request) => request.id === openId) ?? null;

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
            placeholder="Search name, email or project type"
            aria-label="Search name, email or project type"
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
            {[ALL, ...consultationStatuses].map((value) => (
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
              <EmptyTitle>No requests match</EmptyTitle>
              <EmptyDescription>
                Try a different name or project type, or clear the search and filter.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="overflow-x-auto">
            <Table className="min-w-[940px]">
              <TableHeader className="bg-admin-muted">
                <TableRow className="border-border-default hover:bg-transparent">
                  <SortableHead sortKey="id" sort={sort} onSort={onSort} className="h-11 px-6">
                    Request
                  </SortableHead>
                  <SortableHead sortKey="name" sort={sort} onSort={onSort} className="h-11">
                    Client
                  </SortableHead>
                  <SortableHead sortKey="projectType" sort={sort} onSort={onSort} className="h-11">
                    Project type
                  </SortableHead>
                  <SortableHead sortKey="startDate" sort={sort} onSort={onSort} className="h-11">
                    Timeline
                  </SortableHead>
                  <SortableHead sortKey="receivedAt" sort={sort} onSort={onSort} className="h-11">
                    Received
                  </SortableHead>
                  <SortableHead sortKey="status" sort={sort} onSort={onSort} className="h-11 pr-6">
                    Status
                  </SortableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((request) => (
                  <TableRow
                    key={request.id}
                    onClick={() => setOpenId(request.id)}
                    className="border-border-default hover:bg-admin-muted cursor-pointer"
                  >
                    <TableCell className="px-6 py-5">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setOpenId(request.id);
                        }}
                        className="text-text-primary focus-visible:ring-ring/50 cursor-pointer rounded-sm text-sm outline-none focus-visible:ring-3"
                      >
                        {request.id}
                      </button>
                    </TableCell>
                    <TableCell className="py-5 pr-6 pl-0">
                      <span className="text-text-primary block text-sm font-medium">
                        {request.name}
                      </span>
                      <span className="text-text-secondary block text-xs">{request.email}</span>
                    </TableCell>
                    <TableCell className="text-text-secondary py-5 pr-6 pl-0 text-sm">
                      {request.projectType}
                    </TableCell>
                    <TableCell className="text-text-secondary py-5 pr-6 pl-0 text-sm">
                      {consultationWindow(request)}
                    </TableCell>
                    <TableCell className="text-text-secondary py-5 pr-6 pl-0 text-sm">
                      {requestedAt(request)}
                    </TableCell>
                    <TableCell className="py-5 pr-6 pl-0">
                      <StatusBadge status={request.status} />
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
          onGoTo={(next) => setPage(Math.min(Math.max(next, 1), pageCount))}
        />
      </div>

      <ConsultationSheet
        request={open}
        onOpenChange={(next) => !next && setOpenId(null)}
        onStatusChange={(status) =>
          open && setOverrides((value) => ({ ...value, [open.id]: status }))
        }
      />
    </div>
  );
};
