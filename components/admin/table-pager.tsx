"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

/**
 * The page numbers the frames draw: the first three, an ellipsis, then the last
 * three — collapsing to a plain run whenever the whole set fits in seven slots.
 */
export const pageWindow = (total: number, current: number): (number | "ellipsis")[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const edges = new Set([1, 2, 3, total - 2, total - 1, total, current]);
  const pages = [...edges].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b);
  return pages.flatMap((page, index) =>
    index > 0 && page - pages[index - 1] > 1 ? (["ellipsis", page] as const) : [page]
  );
};

/**
 * The newsletter frame's footer instead of the button pager above: a record
 * count on the left and a bare run of text links on the right. Same window
 * logic, no chrome — that list is read far more often than it is paged.
 */
export const TableCountPager = ({
  count,
  current,
  pageCount,
  onGoTo,
}: {
  count: number;
  current: number;
  pageCount: number;
  onGoTo: (page: number) => void;
}) => {
  const step = (label: string, to: number, disabled: boolean) => (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onGoTo(to)}
      className="text-text-secondary hover:text-text-primary focus-visible:ring-ring/50 cursor-pointer rounded-sm px-0.5 outline-none focus-visible:ring-3 disabled:pointer-events-none disabled:opacity-50"
    >
      {label}
    </button>
  );

  return (
    <div className="border-border-default flex items-center justify-between gap-4 border-t px-6 py-5.5">
      <p className="text-text-secondary text-sm">
        Showing {count} {count === 1 ? "record" : "records"}
      </p>
      <nav aria-label="Pagination" className="flex items-center gap-1.5 text-xs">
        {step("Previous", current - 1, current === 1)}
        {pageWindow(pageCount, current).map((page, index) =>
          page === "ellipsis" ? (
            <span key={`gap-${index}`} className="text-text-secondary px-0.5">
              …
            </span>
          ) : (
            <button
              key={page}
              type="button"
              aria-current={page === current ? "page" : undefined}
              onClick={() => onGoTo(page)}
              className={cn(
                "focus-visible:ring-ring/50 cursor-pointer rounded-sm px-0.5 outline-none focus-visible:ring-3",
                page === current
                  ? "text-text-primary font-medium"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              {page}
            </button>
          )
        )}
        {step("Next", current + 1, current === pageCount)}
      </nav>
    </div>
  );
};

/** Previous / numbers / Next, sitting in the footer band of an index table. */
export const TablePager = ({
  current,
  pageCount,
  onGoTo,
}: {
  current: number;
  pageCount: number;
  onGoTo: (page: number) => void;
}) => (
  <div className="border-border-default border-t p-4">
    <Pagination>
      <PaginationContent className="w-full justify-between gap-2">
        <PaginationItem>
          <PaginationPrevious
            href="#"
            aria-disabled={current === 1}
            className="border-border-default h-10 border data-[disabled=true]:pointer-events-none aria-disabled:pointer-events-none aria-disabled:opacity-50"
            onClick={(event) => {
              event.preventDefault();
              onGoTo(current - 1);
            }}
          />
        </PaginationItem>
        <div className="flex items-center gap-1">
          {pageWindow(pageCount, current).map((page, index) =>
            page === "ellipsis" ? (
              <PaginationItem key={`gap-${index}`}>
                <span className="text-text-secondary flex size-9 items-center justify-center text-sm">
                  …
                </span>
              </PaginationItem>
            ) : (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  isActive={page === current}
                  className="size-9"
                  onClick={(event) => {
                    event.preventDefault();
                    onGoTo(page);
                  }}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          )}
        </div>
        <PaginationItem>
          <PaginationNext
            href="#"
            aria-disabled={current === pageCount}
            className="border-border-default h-10 border data-[disabled=true]:pointer-events-none aria-disabled:pointer-events-none aria-disabled:opacity-50"
            onClick={(event) => {
              event.preventDefault();
              onGoTo(current + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  </div>
);
