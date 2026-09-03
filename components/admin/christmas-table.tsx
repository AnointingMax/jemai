"use client";

import { useMemo, useOptimistic, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { toast } from "sonner";

import { updateChristmasStatusAction } from "@/app/admin/(dashboard)/christmas-requests/actions";
import { ChristmasSheet } from "@/components/admin/christmas-sheet";
import { SortableHead, nextSort, type SortState } from "@/components/admin/sortable-head";
import { StatusBadge } from "@/components/admin/status-badge";
import { TablePager } from "@/components/admin/table-pager";
import { useTableQuery } from "@/components/admin/use-table-query";
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
  ALL_CHRISTMAS_STATUSES,
  areaSummary,
  submittedAt,
  type AdminChristmasRequest,
} from "@/lib/admin/christmas-record";
import { christmasStatuses, type ChristmasStatus } from "@/lib/christmas";

type RowKey = "reference" | "name" | "areas" | "receivedAt" | "status";

const PAGE_SIZE = 10;

/** Untouched first when the reader sorts on Status: it is the queue's whole point. */
const compare = (a: AdminChristmasRequest, b: AdminChristmasRequest, key: RowKey) => {
  if (key === "areas") return areaSummary(a).localeCompare(areaSummary(b));
  if (key === "status")
    return christmasStatuses.indexOf(a.status) - christmasStatuses.indexOf(b.status);
  return String(a[key]).localeCompare(String(b[key]));
};

/**
 * Christmas requests: a search box over a sortable table, paged ten rows at a
 * time.
 *
 * Search and the year filter live in the URL and run in the database, so the
 * view survives a reload and can be sent as a link. Sorting and paging are done
 * here, over the rows that came back. The year filter is not in this card — the
 * campaign is batched by year, so that narrowing sits up beside the export
 * rather than reading as one filter among several.
 *
 * A row opens the request in a side sheet; the reference is a real button so
 * the same affordance is reachable from the keyboard.
 */
export const ChristmasTable = ({
  requests,
  search,
  status,
  yearParam,
}: {
  requests: AdminChristmasRequest[];
  /** The search the page queried with, as it stands in the URL. */
  search: string;
  /** The status filter, or its "everything" label. */
  status: string;
  /** The `year` parameter verbatim — "all", a year, or absent. */
  yearParam?: string;
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
    (current, edit: { id: string; status: ChristmasStatus }) =>
      current.map((request) =>
        request.id === edit.id ? { ...request, status: edit.status } : request,
      ),
  );

  const onStatusChange = (id: string, status: ChristmasStatus) =>
    startTransition(async () => {
      applyStatus({ id, status });
      const result = await updateChristmasStatusAction({ id, status });

      if (result.error) {
        toast.error(result.message);
        return;
      }

      toast.success(result.data);
      router.refresh();
    });

  // This card owns the search box and the status filter; the year belongs to
  // the toolbar, and is carried through verbatim so neither control drops it.
  // An absent `year` stays absent — that is the current campaign, which the
  // page decides, not a value to write out.
  const { term, setTerm, onFilter, navigating } = useTableQuery({
    search,
    filter: status,
    filterKey: "status",
    filterAll: ALL_CHRISTMAS_STATUSES,
    keep: { year: yearParam },
    onNarrow: () => setPage(1),
  });

  const sorted = useMemo(() => {
    const ordered = [...rows].sort((a, b) => compare(a, b, sort.key));
    return sort.direction === "asc" ? ordered : ordered.reverse();
  }, [rows, sort]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  // A search can strand the reader past the last page; clamp on render rather
  // than resetting in an effect, which would flash the old page first.
  const current = Math.min(page, pageCount);
  const visible = sorted.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const onSort = (key: RowKey) => {
    setSort(nextSort(sort, key));
    setPage(1);
  };

  const open = rows.find((request) => request.id === openId) ?? null;

  return (
    <div className="flex flex-col gap-4">
      <div className="border-border-default flex flex-col gap-3 rounded-xl border p-3 sm:flex-row">
        <div className="relative w-full">
          <Search
            aria-hidden
            className="text-text-secondary pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
          />
          <Input
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Search name, email or property type"
            aria-label="Search name, email or property type"
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
            {[ALL_CHRISTMAS_STATUSES, ...christmasStatuses].map((value) => (
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
                Try a different name or property type, or clear the search and filters.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="overflow-x-auto">
            <Table className="min-w-[1000px]">
              <TableHeader className="bg-admin-muted">
                <TableRow className="border-border-default hover:bg-transparent">
                  <SortableHead
                    sortKey="reference"
                    sort={sort}
                    onSort={onSort}
                    className="h-11 px-6"
                  >
                    Request ID
                  </SortableHead>
                  <SortableHead sortKey="name" sort={sort} onSort={onSort} className="h-11">
                    Customer
                  </SortableHead>
                  <SortableHead sortKey="areas" sort={sort} onSort={onSort} className="h-11">
                    Decoration areas
                  </SortableHead>
                  <SortableHead sortKey="receivedAt" sort={sort} onSort={onSort} className="h-11">
                    Submitted
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
                      {areaSummary(request)}
                    </TableCell>
                    <TableCell className="text-text-secondary py-5 pr-6 pl-0 text-sm">
                      {submittedAt(request)}
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

      <ChristmasSheet
        request={open}
        onOpenChange={(next) => !next && setOpenId(null)}
        onStatusChange={(status) => open && onStatusChange(open.id, status)}
      />
    </div>
  );
};
