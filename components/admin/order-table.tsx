"use client";

import { useMemo, useOptimistic, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { toast } from "sonner";

import { updateOrderStatusAction } from "@/app/admin/(dashboard)/orders/actions";

import { OrderSheet } from "@/components/admin/order-sheet";
import { SortableHead, nextSort, type SortState } from "@/components/admin/sortable-head";
import { StatusBadge } from "@/components/admin/status-badge";
import { TablePager } from "@/components/admin/table-pager";
import { useTableQuery } from "@/components/admin/use-table-query";
import { Checkbox } from "@/components/ui/checkbox";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  fulfillmentStatuses,
  formatOrderDate,
  naira,
  type AdminOrder,
  type FulfillmentStatus,
} from "@/lib/admin/order-record";

type OrderKey = "number" | "customer" | "total" | "placedAt" | "status";

/** The filter's "everything" option — a Select item cannot carry an empty value. */
export const ALL_FULFILLMENT_STATUSES = "All statuses";

/** Numeric on Total, lifecycle order on Status, lexical everywhere else. */
const compare = (a: AdminOrder, b: AdminOrder, key: OrderKey) => {
  if (key === "total") return a.total - b.total;
  if (key === "status")
    return fulfillmentStatuses.indexOf(a.status) - fulfillmentStatuses.indexOf(b.status);
  return String(a[key]).localeCompare(String(b[key]));
};

type OrderTableProps = {
  orders: AdminOrder[];
  /** Omit to draw every row without a footer — the overview's compact form. */
  pageSize?: number;
};

/**
 * The index's search box and status filter. Both narrowings are kept in the URL
 * and run in the database, so the export carries the same rows the reader is
 * looking at rather than a page's worth of them.
 */
export const OrderFilters = ({
  search,
  status,
}: {
  /** The search the page queried with, as it stands in the URL. */
  search: string;
  /** Likewise the status filter, or its "everything" label. */
  status: string;
}) => {
  const { term, setTerm, onFilter, navigating } = useTableQuery({
    search,
    filter: status,
    filterKey: "status",
    filterAll: ALL_FULFILLMENT_STATUSES,
  });

  return (
    <div className="border-border-default flex flex-col gap-3 rounded-xl border p-3 sm:flex-row">
      <div className="relative w-full">
        <Search
          aria-hidden
          className="text-text-secondary pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
        />
        <Input
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          placeholder="Search customer, email or order number"
          aria-label="Search customer, email or order number"
          className="border-border-default bg-background h-10 pl-9 text-sm md:text-sm"
        />
      </div>
      <Select value={status} onValueChange={onFilter}>
        <SelectTrigger
          aria-label="Filter by fulfillment status"
          disabled={navigating}
          className="border-border-default bg-background text-text-primary w-full text-sm data-[size=default]:h-10 sm:w-52"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {[ALL_FULFILLMENT_STATUSES, ...fulfillmentStatuses].map((value) => (
            <SelectItem key={value} value={value}>
              {value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

/**
 * The furniture orders table: a select column, five sortable columns and a
 * status pill. A row opens the order in a side sheet; the order number is a
 * real button so the same affordance is reachable from the keyboard.
 *
 * Search and the status filter are `OrderFilters` above it: they live in the
 * URL and run in the database, so the view survives a reload, can be sent as a
 * link, and an export takes what the query returned rather than what happened
 * to be fetched. Sorting and paging are done here, over the rows that came
 * back. The overview draws the same table with neither, which is what omitting
 * `pageSize` means.
 *
 * Selection is local — the frames draw the checkboxes but no bulk action is
 * wired up yet, so the header box only drives select-all.
 */
export const OrderTable = ({ orders, pageSize }: OrderTableProps) => {
  const [sort, setSort] = useState<SortState<OrderKey>>({ key: "placedAt", direction: "desc" });
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);
  const router = useRouter();
  const [, startTransition] = useTransition();
  // The pill and the sheet's select move the moment the reader commits, then
  // the refreshed server data replaces the guess. A failed write leaves the
  // optimistic value behind with it, so the row snaps back to the truth.
  const [rows, applyStatus] = useOptimistic(
    orders,
    (current, edit: { id: string; status: FulfillmentStatus; }) =>
      current.map((order) => (order.id === edit.id ? { ...order, status: edit.status } : order)),
  );

  const onStatusChange = (id: string, next: FulfillmentStatus) =>
    startTransition(async () => {
      applyStatus({ id, status: next });
      const result = await updateOrderStatusAction({ id, status: next });

      if (result.error) {
        toast.error(result.message);
        return;
      }

      toast.success(result.data);
      router.refresh();
    });

  const sorted = useMemo(() => {
    const ordered = [...rows].sort((a, b) => compare(a, b, sort.key));
    return sort.direction === "asc" ? ordered : ordered.reverse();
  }, [rows, sort]);

  const pageCount = pageSize ? Math.max(1, Math.ceil(sorted.length / pageSize)) : 1;
  // Sorting can strand the reader past the last page; clamp on render rather
  // than resetting in an effect, which would flash the old page first.
  const current = Math.min(page, pageCount);
  const visible = pageSize ? sorted.slice((current - 1) * pageSize, current * pageSize) : sorted;

  const allSelected = selected.length === rows.length && rows.length > 0;

  const toggle = (id: string) =>
    setSelected((value) =>
      value.includes(id) ? value.filter((entry) => entry !== id) : [...value, id],
    );

  const onSort = (key: OrderKey) => {
    setSort(nextSort(sort, key));
    setPage(1);
  };

  const open = rows.find((order) => order.id === openId) ?? null;

  return (
    <>
      {visible.length === 0 ? (
        <Empty className="py-16">
          <EmptyHeader>
            <EmptyTitle>No orders yet</EmptyTitle>
            <EmptyDescription>
              Paystack-verified purchases land here. Try a different search, or clear the filter.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="overflow-x-auto">
          {/* The index has the full page to itself; the overview draws the same
              table inside a narrower card, so it gets a lower floor. */}
          <Table className={cn("min-w-[700px]", pageSize && "min-w-[940px]")}>
            <TableHeader className="bg-surface-page">
              <TableRow className="border-border-default hover:bg-transparent">
                <TableHead className="h-12 w-16 px-4">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={(checked) =>
                      setSelected(checked ? rows.map((order) => order.id) : [])
                    }
                    aria-label="Select all orders"
                  />
                </TableHead>
                <SortableHead sortKey="number" sort={sort} onSort={onSort}>
                  Order ID
                </SortableHead>
                <SortableHead sortKey="customer" sort={sort} onSort={onSort}>
                  Customer
                </SortableHead>
                <SortableHead sortKey="total" sort={sort} onSort={onSort}>
                  Total
                </SortableHead>
                <SortableHead sortKey="placedAt" sort={sort} onSort={onSort}>
                  Date
                </SortableHead>
                {/* Payment is its own axis and only the index has room for it —
                    the overview is a fulfillment glance. */}
                {pageSize ? <TableHead className="h-12 pr-6 pl-0">Payment</TableHead> : null}
                <SortableHead sortKey="status" sort={sort} onSort={onSort}>
                  Fulfillment Status
                </SortableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((order) => (
                <TableRow
                  key={order.id}
                  data-state={selected.includes(order.id) ? "selected" : undefined}
                  onClick={() => setOpenId(order.id)}
                  className="border-border-default hover:bg-admin-muted cursor-pointer"
                >
                  {/* The box is its own control inside a clickable row, so it has
                      to keep the click to itself. */}
                  <TableCell
                    className="w-16 px-4 py-4"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <Checkbox
                      checked={selected.includes(order.id)}
                      onCheckedChange={() => toggle(order.id)}
                      aria-label={`Select order ${order.number}`}
                    />
                  </TableCell>
                  <TableCell className="py-4 pr-6 pl-0">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setOpenId(order.id);
                      }}
                      className="text-text-primary focus-visible:ring-ring/50 cursor-pointer rounded-sm text-sm outline-none focus-visible:ring-3"
                    >
                      {order.number}
                    </button>
                  </TableCell>
                  <TableCell className="py-4 pr-6 pl-0">
                    <span className="text-text-primary block text-sm font-medium">
                      {order.customer}
                    </span>
                    <span className="text-text-secondary block text-xs">{order.phone}</span>
                  </TableCell>
                  <TableCell className="text-text-primary py-4 pr-6 pl-0 text-sm">
                    {naira(order.total)}
                  </TableCell>
                  <TableCell className="text-text-secondary py-4 pr-6 pl-0 text-sm">
                    {formatOrderDate(order.placedAt)}
                  </TableCell>
                  {pageSize ? (
                    <TableCell className="py-4 pr-6 pl-0">
                      <StatusBadge status={order.payment} />
                    </TableCell>
                  ) : null}
                  <TableCell className="py-4 pr-6 pl-0">
                    <StatusBadge status={order.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {pageSize ? (
        <TablePager
          current={current}
          pageCount={pageCount}
          onGoTo={(next) => setPage(Math.min(Math.max(next, 1), pageCount))}
        />
      ) : null}

      <OrderSheet
        order={open}
        onOpenChange={(next) => !next && setOpenId(null)}
        onStatusChange={(next) => open && onStatusChange(open.id, next)}
      />
    </>
  );
};
