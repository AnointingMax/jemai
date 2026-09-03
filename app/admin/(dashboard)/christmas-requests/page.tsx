import { ChristmasTable } from "@/components/admin/christmas-table";
import { ChristmasToolbar } from "@/components/admin/christmas-toolbar";
import {
  ALL_CHRISTMAS_STATUSES,
  ALL_CHRISTMAS_YEARS,
} from "@/lib/admin/christmas-record";
import {
  christmasSlotsLeft,
  christmasYears,
  currentChristmasYear,
  listChristmasRequests,
} from "@/lib/admin/christmas";
import { christmasStatuses } from "@/lib/christmas";
import { param, paramOneOf } from "@/lib/admin/table-query";

/**
 * Christmas requests — the seasonal campaign's queue.
 *
 * The service runs all year round and is batched by year, so the year is the
 * screen's primary narrowing and lives in the header beside the export rather
 * than in the search card, where the search box and the status filter sit.
 *
 * **All three narrow in the database, not over rows already sent.** They are
 * URL state, so the view survives a reload and can be sent as a link — and the
 * export re-runs the same query rather than serialising a page of rows.
 *
 * **The default is the current campaign, not everything.** A queue batched by
 * year is worked one season at a time, and the slot count only means anything
 * against a single allocation — so `?year=all` is the deliberate choice and an
 * absent parameter is this Christmas. That is also why the count disappears in
 * the all-years view: there is no one allocation left for it to be out of.
 */
const AdminChristmasRequestsPage = async ({
  searchParams,
}: PageProps<"/admin/christmas-requests">) => {
  const query = await searchParams;
  const search = param(query, "q") ?? "";

  const status = paramOneOf(query, "status", christmasStatuses);
  const yearParam = param(query, "year");
  const showAll = yearParam === "all";
  const year = showAll
    ? undefined
    : yearParam && /^\d{4}$/.test(yearParam)
      ? Number(yearParam)
      : currentChristmasYear();

  const [requests, years, slotsLeft] = await Promise.all([
    listChristmasRequests({ search, year, status }),
    christmasYears(),
    year ? christmasSlotsLeft(year) : Promise.resolve(null),
  ]);

  const selected = showAll ? ALL_CHRISTMAS_YEARS : String(year);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-baseline gap-3">
            <h1 className="text-text-primary text-2xl font-semibold">Christmas requests</h1>
            {slotsLeft !== null && (
              <span className="text-action-primary text-sm font-medium">
                {slotsLeft} Available {slotsLeft === 1 ? "Slot" : "Slots"}
              </span>
            )}
          </div>
          <p className="text-text-secondary max-w-[70ch] text-sm">
            {year
              ? `View customer requests submitted for the Christmas ${year} seasonal decoration service.`
              : "View customer requests submitted for the Christmas seasonal decoration service, across every year it has run."}
          </p>
        </div>

        <ChristmasToolbar
          search={search}
          status={status ?? ""}
          year={selected}
          years={years}
        />
      </header>

      <ChristmasTable
        requests={requests}
        search={search}
        status={status ?? ALL_CHRISTMAS_STATUSES}
        yearParam={yearParam}
      />
    </div>
  );
};

export default AdminChristmasRequestsPage;
