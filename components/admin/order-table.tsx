"use client";

import { useMemo, useState } from "react";

import { OrderSheet } from "@/components/admin/order-sheet";
import { SortableHead, nextSort, type SortState } from "@/components/admin/sortable-head";
import { StatusBadge } from "@/components/admin/status-badge";
import { TablePager } from "@/components/admin/table-pager";
import { Checkbox } from "@/components/ui/checkbox";
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
  fulfilmentStatuses,
  formatOrderDate,
  naira,
  type AdminOrder,
  type FulfilmentStatus,
} from "@/lib/admin/orders";

type OrderKey = "id" | "customer" | "total" | "placedAt" | "status";

/** Numeric on Total, lifecycle order on Status, lexical everywhere else. */
const compare = (a: AdminOrder, b: AdminOrder, key: OrderKey) => {
  if (key === "total") return a.total - b.total;
  if (key === "status")
    return fulfilmentStatuses.indexOf(a.status) - fulfilmentStatuses.indexOf(b.status);
  return String(a[key]).localeCompare(String(b[key]));
};

type OrderTableProps = {
  orders: AdminOrder[];
  /** Omit to draw every row without a footer — the overview's compact form. */
  pageSize?: number;
};

/**
 * The furniture orders table: a select column, five sortable columns and a
 * status pill. A row opens the order in a side sheet; the Order ID is a real
 * button so the same affordance is reachable from the keyboard.
 *
 * Selection is local — the frames draw the checkboxes but no bulk action is
 * wired up yet, so the header box only drives select-all.
 */
export const OrderTable = ({ orders, pageSize }: OrderTableProps) => {
  const [sort, setSort] = useState<SortState<OrderKey>>({ key: "placedAt", direction: "desc" });
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);
  // Status edits live here until the fulfilment endpoint exists, so the sheet's
  // select and the table's pill stay in agreement for the session.
  const [overrides, setOverrides] = useState<Record<string, FulfilmentStatus>>({});

  const rows = useMemo(() => {
    const withStatus = orders.map((order) =>
      overrides[order.id] ? { ...order, status: overrides[order.id] } : order
    );
    const sorted = withStatus.sort((a, b) => compare(a, b, sort.key));
    return sort.direction === "asc" ? sorted : sorted.reverse();
  }, [orders, overrides, sort]);

  const pageCount = pageSize ? Math.max(1, Math.ceil(rows.length / pageSize)) : 1;
  // Sorting can strand the reader past the last page; clamp on render rather
  // than resetting in an effect, which would flash the old page first.
  const current = Math.min(page, pageCount);
  const visible = pageSize ? rows.slice((current - 1) * pageSize, current * pageSize) : rows;

  const allSelected = selected.length === orders.length && orders.length > 0;

  const toggle = (id: string) =>
    setSelected((value) =>
      value.includes(id) ? value.filter((entry) => entry !== id) : [...value, id]
    );

  const onSort = (key: OrderKey) => {
    setSort(nextSort(sort, key));
    setPage(1);
  };

  const open = rows.find((order) => order.id === openId) ?? null;

  return (
    <>
      <div className="overflow-x-auto">
        {/* The index has the full page to itself; the overview draws the same
            table inside a narrower card, so it gets a lower floor. */}
        <Table className={cn("min-w-[700px]", pageSize && "min-w-[860px]")}>
          <TableHeader className="bg-surface-page">
            <TableRow className="border-border-default hover:bg-transparent">
              <TableHead className="h-12 w-16 px-4">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={(checked) =>
                    setSelected(checked ? orders.map((order) => order.id) : [])
                  }
                  aria-label="Select all orders"
                />
              </TableHead>
              <SortableHead sortKey="id" sort={sort} onSort={onSort}>
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
              <SortableHead sortKey="status" sort={sort} onSort={onSort}>
                Fulfilment Status
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
                <TableCell className="w-16 px-4 py-4" onClick={(event) => event.stopPropagation()}>
                  <Checkbox
                    checked={selected.includes(order.id)}
                    onCheckedChange={() => toggle(order.id)}
                    aria-label={`Select order ${order.id}`}
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
                    {order.id}
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
                <TableCell className="py-4 pr-6 pl-0">
                  <StatusBadge status={order.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

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
        onStatusChange={(status) =>
          open && setOverrides((value) => ({ ...value, [open.id]: status }))
        }
      />
    </>
  );
};
