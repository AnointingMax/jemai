"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";

/**
 * The search box and filter of a console index, held in the URL.
 *
 * The field itself stays local so typing is not a navigation per keystroke: it
 * settles for a moment, then the term becomes a query parameter and the page
 * re-runs its own `where`. A filter has nothing to wait for and navigates at
 * once. Both use `replace`, so Back does not walk through every prefix of what
 * somebody typed — the state still restores on reload, which is the point.
 */

/** How long the reader stops typing before the search becomes a query. */
const TYPING_PAUSE = 300;

export const useTableQuery = ({
  search,
  filter,
  filterKey,
  filterAll,
  onNarrow,
}: {
  /** The search term the page queried with, as it stands in the URL. */
  search: string;
  /** Likewise the filter, or its "everything" label when there is none. */
  filter?: string;
  /** The parameter the filter is kept in — "medium", "status", and so on. */
  filterKey?: string;
  /** The label that means no filter; a Select item cannot carry an empty value. */
  filterAll?: string;
  /** Called whenever the narrowing changes, to send paging back to page one. */
  onNarrow?: () => void;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [navigating, startNavigating] = useTransition();
  const [term, setTerm] = useState(search);

  const href = (nextSearch: string, nextFilter?: string) => {
    const params = new URLSearchParams();
    if (nextSearch.trim()) params.set("q", nextSearch.trim());
    if (filterKey && nextFilter && nextFilter !== filterAll)
      params.set(filterKey, nextFilter);
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  };

  const go = (nextSearch: string, nextFilter?: string) =>
    startNavigating(() => {
      onNarrow?.();
      router.replace(href(nextSearch, nextFilter), { scroll: false });
    });

  useEffect(() => {
    if (term.trim() === search) return;

    const timer = setTimeout(() => go(term, filter), TYPING_PAUSE);
    return () => clearTimeout(timer);
    // `go` closes over this render's props; listing them is what re-arms the
    // timer when the reader keeps typing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term, search, filter, pathname]);

  return {
    /** The field's value, which is local until the reader pauses. */
    term,
    setTerm,
    /** Hand this to the filter control's `onValueChange`. */
    onFilter: (value: string) => go(term, value),
    /** True while the page is fetching the narrowed rows. */
    navigating,
  };
};
