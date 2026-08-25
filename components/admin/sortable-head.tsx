"use client";

import { ChevronsUpDown } from "lucide-react";

import { TableHead } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type SortDirection = "asc" | "desc";
export type SortState<K extends string> = { key: K; direction: SortDirection };

/** Clicking the active column flips it; clicking another starts it ascending. */
export const nextSort = <K extends string>(current: SortState<K>, key: K): SortState<K> =>
  current.key === key
    ? { key, direction: current.direction === "asc" ? "desc" : "asc" }
    : { key, direction: "asc" };

type SortableHeadProps<K extends string> = {
  sortKey: K;
  sort: SortState<K>;
  onSort: (key: K) => void;
  children: React.ReactNode;
  className?: string;
};

/**
 * A column header that sorts on click. The frames draw the affordance on every
 * sortable column at once — a dimmed up/down chevron that goes solid on the
 * column currently in force — rather than only on the active one.
 */
export const SortableHead = <K extends string>({
  sortKey,
  sort,
  onSort,
  children,
  className,
}: SortableHeadProps<K>) => {
  const active = sort.key === sortKey;

  return (
    <TableHead
      aria-sort={active ? (sort.direction === "asc" ? "ascending" : "descending") : "none"}
      className={cn("h-12 pr-6 pl-0", className)}
    >
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className="text-text-secondary hover:text-text-primary focus-visible:ring-ring/50 flex cursor-pointer items-center gap-1.5 rounded-sm text-sm font-normal outline-none focus-visible:ring-3"
      >
        {children}
        <ChevronsUpDown
          aria-hidden
          className={cn("size-3.5 shrink-0", active ? "text-text-primary" : "text-text-secondary/50")}
        />
      </button>
    </TableHead>
  );
};
