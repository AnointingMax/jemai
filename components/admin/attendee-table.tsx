"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { SortableHead, nextSort, type SortState } from "@/components/admin/sortable-head";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  registrationStatuses,
  type RegistrationStatus,
} from "@/lib/admin/registration-record";

/** What the attendee list draws off a registration. */
export type AttendeeRow = {
  reference: string;
  name: string;
  email: string;
  phone: string;
  /** "Free", or "₦15,000" — already formatted, so sorting stays off it. */
  amount: string;
  status: RegistrationStatus;
  /** "15 May 2026 9:00 pm", already formatted; `registeredAt` is what sorts. */
  registered: string;
  registeredAt: string;
};

type RowKey = "name" | "email" | "status" | "registeredAt";

const PAGE_SIZE = 10;

/** The filter's "everything" option — a Select item cannot carry an empty value. */
export const ALL_PAYMENTS = "All payments";

/** The URL a filter and a search term make together. */
const hrefFor = (pathname: string, payment: string, search: string) => {
  const params = new URLSearchParams();
  if (payment !== ALL_PAYMENTS) params.set("payment", payment);
  if (search.trim()) params.set("q", search.trim());
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
};

/** How long the reader stops typing before the search becomes a query. */
const TYPING_PAUSE = 300;

/**
 * Sorting on Status follows the payment's own order — confirmed, still owed,
 * failed — rather than the alphabet, which would put Failed in the middle.
 */
const compare = (a: AttendeeRow, b: AttendeeRow, key: RowKey) =>
  key === "status"
    ? registrationStatuses.indexOf(a.status) - registrationStatuses.indexOf(b.status)
    : a[key].localeCompare(b[key]);

/**
 * One exhibition's attendees: a payment filter and a search box over a sortable
 * table, paged ten rows at a time.
 *
 * Both narrowings live in the URL and run in the database. That is what makes
 * them survive a reload, walk back through the browser's history, work as a
 * link somebody else can open — and, because the page's `where` decides which
 * rows exist at all, it is also what the export in the header carries.
 *
 * The field itself stays local so typing is not a navigation per keystroke: it
 * settles for a moment first, then the term becomes a query. Sorting and paging
 * are the two things still done here, over the rows the query returned.
 */
export const AttendeeTable = ({
  rows,
  payment,
  search,
}: {
  rows: AttendeeRow[];
  /** The filter the page queried with, as it stands in the URL. */
  payment: string;
  /** The search term the page queried with, likewise. */
  search: string;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [navigating, startNavigating] = useTransition();

  const [term, setTerm] = useState(search);
  const [sort, setSort] = useState<SortState<RowKey>>({
    key: "registeredAt",
    direction: "desc",
  });
  const [page, setPage] = useState(1);

  /**
   * The typed term becomes a query once the reader pauses. `replace` rather
   * than `push`, so back does not walk through every prefix of what was typed —
   * but a filter change below is a `replace` for the same reason and both still
   * restore on reload, which is the point.
   */
  useEffect(() => {
    if (term.trim() === search) return;

    const timer = setTimeout(
      () =>
        startNavigating(() => {
          setPage(1);
          router.replace(hrefFor(pathname, payment, term), { scroll: false });
        }),
      TYPING_PAUSE,
    );

    return () => clearTimeout(timer);
  }, [term, search, payment, pathname, router]);

  /** A filter change is immediate — there is nothing to wait for. */
  const onFilter = (value: string) => {
    setPage(1);
    startNavigating(() => {
      router.replace(hrefFor(pathname, value, term), { scroll: false });
    });
  };

  const found = useMemo(() => {
    const sorted = [...rows].sort((a, b) => compare(a, b, sort.key));
    return sort.direction === "asc" ? sorted : sorted.reverse();
  }, [rows, sort]);

  const pageCount = Math.max(1, Math.ceil(found.length / PAGE_SIZE));
  // A search can strand the reader past the last page; clamp on render rather
  // than resetting in an effect, which would flash the old page first.
  const current = Math.min(page, pageCount);
  const visible = found.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const goTo = (next: number) => setPage(Math.min(Math.max(next, 1), pageCount));

  const onSort = (key: RowKey) => {
    setSort(nextSort(sort, key));
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Search and the payment filter share the card above the table, the way
          the enquiries queue arranges its own two. */}
      <div className="border-border-default flex flex-col gap-3 rounded-xl border p-3 sm:flex-row">
        <div className="relative w-full">
          <Search
            aria-hidden
            className="text-text-secondary pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
          />
          <Input
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Search name, email or reference"
            aria-label="Search name, email or reference"
            className="border-border-default bg-background h-10 pl-9 text-sm md:text-sm"
          />
        </div>
        <Select value={payment} onValueChange={onFilter}>
          <SelectTrigger
            aria-label="Filter by payment status"
            disabled={navigating}
            className="border-border-default bg-background text-text-primary w-full text-sm data-[size=default]:h-10 sm:w-52"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[ALL_PAYMENTS, ...registrationStatuses].map((value) => (
              <SelectItem key={value} value={value}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div
        className={`border-border-default overflow-hidden rounded-xl border transition-opacity ${
          navigating ? "opacity-60" : ""
        }`}
      >
        {visible.length === 0 ? (
          <Empty className="py-16">
            <EmptyHeader>
              <EmptyTitle>
                {search || payment !== ALL_PAYMENTS
                  ? "No attendees match"
                  : "Nobody has registered yet"}
              </EmptyTitle>
              <EmptyDescription>
                {search
                  ? "Try a different name, address or reference, or clear the search."
                  : payment !== ALL_PAYMENTS
                    ? `No registration is ${payment.toLowerCase()}. Choose another payment status.`
                    : "Registrations taken on the exhibition page appear here."}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="overflow-x-auto">
            <Table className="min-w-[900px]">
              <TableHeader className="bg-admin-muted">
                <TableRow className="border-border-default hover:bg-transparent">
                  <SortableHead sortKey="name" sort={sort} onSort={onSort} className="h-11 px-6">
                    Name
                  </SortableHead>
                  <SortableHead sortKey="email" sort={sort} onSort={onSort} className="h-11">
                    Email
                  </SortableHead>
                  <TableHead className="text-text-secondary h-11 pr-6 pl-0 text-sm font-normal">
                    Phone
                  </TableHead>
                  <TableHead className="text-text-secondary h-11 pr-6 pl-0 text-sm font-normal">
                    Paid
                  </TableHead>
                  <SortableHead sortKey="status" sort={sort} onSort={onSort} className="h-11">
                    Status
                  </SortableHead>
                  <SortableHead
                    sortKey="registeredAt"
                    sort={sort}
                    onSort={onSort}
                    className="h-11 pr-6"
                  >
                    Registered
                  </SortableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((row) => (
                  <TableRow key={row.reference} className="border-border-default">
                    <TableCell className="text-text-primary px-6 py-5 text-sm font-medium">
                      {row.name}
                    </TableCell>
                    <TableCell className="text-text-secondary py-5 pr-6 pl-0 text-sm">
                      {row.email}
                    </TableCell>
                    <TableCell className="text-text-secondary py-5 pr-6 pl-0 text-sm">
                      {row.phone || "—"}
                    </TableCell>
                    <TableCell className="text-text-primary py-5 pr-6 pl-0 text-sm">
                      {row.amount}
                    </TableCell>
                    <TableCell className="py-5 pr-6 pl-0">
                      <StatusBadge status={row.status} />
                    </TableCell>
                    <TableCell className="text-text-secondary py-5 pr-6 pl-0 text-sm">
                      {row.registered}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <TablePager current={current} pageCount={pageCount} onGoTo={goTo} />
      </div>
    </div>
  );
};
