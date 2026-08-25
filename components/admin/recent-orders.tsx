"use client";

import { useMemo, useState } from "react";

import { SortableHead, nextSort, type SortState } from "@/components/admin/sortable-head";
import { StatusBadge } from "@/components/admin/status-badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { naira } from "@/lib/admin/furniture";
import type { AdminOrder } from "@/lib/admin/dashboard";

type OrderKey = "id" | "customer" | "total" | "date" | "status";

/** Numeric on Total, lexical everywhere else. */
const compare = (a: AdminOrder, b: AdminOrder, key: OrderKey) =>
  key === "total" ? a.total - b.total : String(a[key]).localeCompare(String(b[key]));

/**
 * The overview's order table: a select column, five sortable columns and a
 * status pill. Selection is local — there are no bulk actions wired up yet, but
 * the frame draws the checkboxes, so the header box drives select-all.
 */
export const RecentOrders = ({ orders }: { orders: AdminOrder[] }) => {
  const [sort, setSort] = useState<SortState<OrderKey>>({ key: "id", direction: "desc" });
  const [selected, setSelected] = useState<string[]>([]);

  const rows = useMemo(() => {
    const sorted = [...orders].sort((a, b) => compare(a, b, sort.key));
    return sort.direction === "asc" ? sorted : sorted.reverse();
  }, [orders, sort]);

  const allSelected = selected.length === orders.length && orders.length > 0;

  const toggle = (id: string) =>
    setSelected((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id]
    );

  return (
    <Table className="min-w-[640px]">
      <TableHeader>
        <TableRow className="border-border-default hover:bg-transparent">
          <TableHead className="h-12 w-16 px-4">
            <Checkbox
              checked={allSelected}
              onCheckedChange={(checked) => setSelected(checked ? orders.map((o) => o.id) : [])}
              aria-label="Select all orders"
            />
          </TableHead>
          <SortableHead sortKey="id" sort={sort} onSort={(key) => setSort(nextSort(sort, key))}>
            Order ID
          </SortableHead>
          <SortableHead sortKey="customer" sort={sort} onSort={(key) => setSort(nextSort(sort, key))}>
            Customer
          </SortableHead>
          <SortableHead sortKey="total" sort={sort} onSort={(key) => setSort(nextSort(sort, key))}>
            Total
          </SortableHead>
          <SortableHead sortKey="date" sort={sort} onSort={(key) => setSort(nextSort(sort, key))}>
            Date
          </SortableHead>
          <SortableHead sortKey="status" sort={sort} onSort={(key) => setSort(nextSort(sort, key))}>
            Fulfilment Status
          </SortableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((order) => (
          <TableRow
            key={order.id}
            data-state={selected.includes(order.id) ? "selected" : undefined}
            className="border-border-default"
          >
            <TableCell className="w-16 px-4 py-4">
              <Checkbox
                checked={selected.includes(order.id)}
                onCheckedChange={() => toggle(order.id)}
                aria-label={`Select order ${order.id}`}
              />
            </TableCell>
            <TableCell className="text-text-primary py-4 pr-6 pl-0 text-sm">{order.id}</TableCell>
            <TableCell className="py-4 pr-6 pl-0">
              <span className="text-text-primary block text-sm font-medium">{order.customer}</span>
              <span className="text-text-secondary block text-xs">{order.phone}</span>
            </TableCell>
            <TableCell className="text-text-primary py-4 pr-6 pl-0 text-sm">{naira(order.total)}</TableCell>
            <TableCell className="text-text-secondary py-4 pr-6 pl-0 text-sm">{order.date}</TableCell>
            <TableCell className="py-4 pr-6 pl-0">
              <StatusBadge status={order.status} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
