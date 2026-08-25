"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
