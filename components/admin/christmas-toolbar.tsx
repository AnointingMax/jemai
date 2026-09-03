"use client";

import { useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";

import { exportChristmasRequestsAction } from "@/app/admin/(dashboard)/christmas-requests/actions";
import { ExportCsvButton } from "@/components/admin/export-csv-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ALL_CHRISTMAS_YEARS } from "@/lib/admin/christmas-record";

/**
 * The header's right-hand controls: the campaign year, then the export.
 *
 * The campaign runs all year round and is batched by year, so the year is the
 * index's primary narrowing rather than one filter among several — which is why
 * it sits up here beside the export instead of in the search card.
 *
 * The navigation is written out here rather than taken from `useTableQuery`,
 * which holds the search term in state seeded once from the URL: the search box
 * is in the *table*, so a second copy of that hook up here would still be
 * holding the term as it stood when the toolbar mounted, and changing the year
 * after a search would put the stale term back in the URL. Reading `search`
 * from props each time is what keeps the two controls composing.
 */
export const ChristmasToolbar = ({
  search,
  status,
  year,
  years,
}: {
  /** The search in the URL, which the year filter has to carry through. */
  search: string;
  /** Likewise the status filter, empty when there is none. */
  status: string;
  /** The year in the URL, or the "everything" label. */
  year: string;
  /** Every batch that has taken a request, plus the current one. */
  years: number[];
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [navigating, startNavigating] = useTransition();

  const onYearChange = (value: string) =>
    startNavigating(() => {
      const params = new URLSearchParams();
      if (search) params.set("q", search);
      if (status) params.set("status", status);
      // Always written out, including "all": an absent parameter means the
      // current campaign, so there would be no way back to everything.
      params.set("year", value === ALL_CHRISTMAS_YEARS ? "all" : value);
      router.replace(`${pathname}?${params}`, { scroll: false });
    });

  return (
    <div className="flex shrink-0 items-center gap-3">
      <Select value={year} onValueChange={onYearChange}>
        <SelectTrigger
          aria-label="Filter by campaign year"
          disabled={navigating}
          className="border-border-default bg-background text-text-primary w-40 text-sm data-[size=default]:h-11"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {[ALL_CHRISTMAS_YEARS, ...years.map(String)].map((value) => (
            <SelectItem key={value} value={value}>
              {value === ALL_CHRISTMAS_YEARS ? value : `Christmas ${value}`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <ExportCsvButton
        onExport={() =>
          exportChristmasRequestsAction({
            search,
            status,
            year: year === ALL_CHRISTMAS_YEARS ? "" : year,
          })
        }
      />
    </div>
  );
};
