"use client";

import { useMemo, useOptimistic, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { toast } from "sonner";

import { updateConsultationStatusAction } from "@/app/admin/(dashboard)/consultation-requests/actions";

import { ConsultationSheet } from "@/components/admin/consultation-sheet";
import { SortableHead, nextSort, type SortState } from "@/components/admin/sortable-head";
import { useTableQuery } from "@/components/admin/use-table-query";
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
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import {
  consultationStatuses,
  consultationWindow,
  requestedAt,
  type AdminConsultation,
  type ConsultationStatus,
} from "@/lib/admin/consultation-record";

type RowKey = "reference" | "name" | "projectType" | "startDate" | "receivedAt" | "status";

const PAGE_SIZE = 10;

/** The filter's "everything" option — a Select item cannot carry an empty value. */
export const ALL_CONSULTATION_STATUSES = "All statuses";

/** Untouched first when the reader sorts on Status: it is the queue's whole point. */
const compare = (a: AdminConsultation, b: AdminConsultation, key: RowKey) =>
  key === "status"
    ? consultationStatuses.indexOf(a.status) - consultationStatuses.indexOf(b.status)
    : a[key].localeCompare(b[key]);

/**
 * Design consultation requests: a search box and a status filter over a
 * sortable table, paged ten rows at a time.
 *
 * Search and filter live in the URL and run in the database, so the view
 * survives a reload, walks back through history and can be sent as a link —
 * and an export takes what the query returned rather than what happened to be
 * fetched. Sorting and paging are done here, over the rows that came back.
 *
 * A row opens the brief in a side sheet; the request number is a real button so
 * the same affordance is reachable from the keyboard.
 */
export const ConsultationTable = ({
  requests,
  search,
  status,
}: {
  requests: AdminConsultation[];
  /** The search the page queried with, as it stands in the URL. */
  search: string;
  /** Likewise the status filter, or its "everything" label. */
  status: string;
}) => {
  const [sort, setSort] = useState<SortState<RowKey>>({ key: "receivedAt", direction: "desc" });
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);
  const router = useRouter();
  const [, startTransition] = useTransition();
  // The pill and the sheet's select move the moment the reader commits, then
  // the refreshed server data replaces the guess. A failed write leaves the
  // optimistic value behind with it, so the row snaps back to the truth.
  const [rows, applyStatus] = useOptimistic(
    requests,
    (current, edit: { id: string; status: ConsultationStatus }) =>
      current.map((request) =>
        request.id === edit.id ? { ...request, status: edit.status } : request
      )
  );

  const onStatusChange = (id: string, status: ConsultationStatus) =>
    startTransition(async () => {
      applyStatus({ id, status });
      const result = await updateConsultationStatusAction({ id, status });

      if (result.error) {
        toast.error(result.message);
        return;
      }

      toast.success(result.data);
      router.refresh();
    });

  // Search and status narrow the list the page read; only the ordering is left
  // to do here, over the records that came back.
  const { term, setTerm, onFilter, navigating } = useTableQuery({
    search,
    filter: status,
    filterKey: "status",
    filterAll: ALL_CONSULTATION_STATUSES,
    onNarrow: () => setPage(1),
  });

  const filtered = useMemo(() => {
    const sorted = [...rows].sort((a, b) => compare(a, b, sort.key));
    return sort.direction === "asc" ? sorted : sorted.reverse();
  }, [rows, sort]);

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
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Search name, email or project type"
            aria-label="Search name, email or project type"
            className="border-border-default bg-background h-10 pl-9 text-sm md:text-sm"
          />
        </div>
        <Select value={status} onValueChange={onFilter}>
          <SelectTrigger
            aria-label="Filter by status"
            disabled={navigating}
            className="border-border-default bg-background text-text-primary w-full text-sm data-[size=default]:h-10 sm:w-48"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[ALL_CONSULTATION_STATUSES, ...consultationStatuses].map((value) => (
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
                  <SortableHead sortKey="reference" sort={sort} onSort={onSort} className="h-11 px-6">
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
                        {request.reference}
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

        <TablePager
          current={current}
          pageCount={pageCount}
          onGoTo={(next) => setPage(Math.min(Math.max(next, 1), pageCount))}
        />
      </div>

      <ConsultationSheet
        request={open}
        onOpenChange={(next) => !next && setOpenId(null)}
        onStatusChange={(status) => open && onStatusChange(open.id, status)}
      />
    </div>
  );
};
