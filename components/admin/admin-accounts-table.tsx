"use client";

import { useMemo, useState, useTransition } from "react";
import { MoreHorizontal, Search } from "lucide-react";
import { toast } from "sonner";

import { setAdminActiveAction } from "@/app/admin/(dashboard)/admins/actions";
import { adminPermissionLabels } from "@/components/admin/nav";
import { SortableHead, nextSort, type SortState } from "@/components/admin/sortable-head";
import { TablePager } from "@/components/admin/table-pager";
import { useTableQuery } from "@/components/admin/use-table-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AdminAccount } from "@/lib/admin/admins";

type RowKey = "name" | "email" | "createdAt";

const PAGE_SIZE = 10;

/** The pill the Status column draws. There are only two states to tell apart. */
const AccessBadge = ({ active }: { active: boolean; }) => (
  <Badge
    variant="outline"
    className="border-border-default text-text-primary h-7 gap-1.5 rounded-md px-2 text-xs font-medium"
  >
    <span
      aria-hidden
      className={`size-1.5 rounded-full ${active ? "bg-[#34c759]" : "bg-[#828f9d]"}`}
    />
    {active ? "Active" : "Suspended"}
  </Badge>
);

/** What the index draws off an account, with its Added column pre-formatted. */
export type AdminAccountRow = AdminAccount & { added: string; };

export const AdminAccountsTable = ({
  rows,
  search,
  currentAdminId,
}: {
  rows: AdminAccountRow[];
  search: string;
  currentAdminId: string;
}) => {
  const [sort, setSort] = useState<SortState<RowKey>>({ key: "createdAt", direction: "desc" });
  const [page, setPage] = useState(1);
  const [pending, startTransition] = useTransition();

  const { term, setTerm, navigating } = useTableQuery({
    search,
    onNarrow: () => setPage(1),
  });

  const sorted = useMemo(() => {
    const ordered = [...rows].sort((a, b) => a[sort.key].localeCompare(b[sort.key]));
    return sort.direction === "asc" ? ordered : ordered.reverse();
  }, [rows, sort]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const visible = sorted.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const goTo = (next: number) => setPage(Math.min(Math.max(next, 1), pageCount));

  const onSort = (key: RowKey) => {
    setSort(nextSort(sort, key));
    setPage(1);
  };

  const setActive = (row: AdminAccountRow, isActive: boolean) => {
    if (
      !isActive &&
      !window.confirm(`Suspend ${row.name}? They will not be able to sign in.`)
    )
      return;

    startTransition(async () => {
      const result = await setAdminActiveAction({ id: row.id, isActive });
      if (result.error) {
        toast.error(result.message);
        return;
      }
      toast.success(result.data);
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="border-border-default rounded-xl border p-3">
        <div className="relative w-full">
          <Search
            aria-hidden
            className="text-text-secondary pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
          />
          <Input
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Search name or email"
            aria-label="Search name or email"
            className="border-border-default bg-background h-10 pl-9 text-sm md:text-sm"
          />
        </div>
      </div>

      <div
        className={`border-border-default overflow-hidden rounded-xl border transition-opacity ${navigating ? "opacity-60" : ""
          }`}
      >
        {visible.length === 0 ? (
          <Empty className="py-16">
            <EmptyHeader>
              <EmptyTitle>No administrators match</EmptyTitle>
              <EmptyDescription>
                Try a different name or address, or clear the search.
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
                    Email address
                  </SortableHead>
                  <TableHead className="h-11">Sections</TableHead>
                  <TableHead className="h-11">Status</TableHead>
                  <SortableHead sortKey="createdAt" sort={sort} onSort={onSort} className="h-11">
                    Added
                  </SortableHead>
                  <TableHead className="h-11 pr-6">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((row) => {
                  const self = row.id === currentAdminId;

                  return (
                    <TableRow key={row.id} className="border-border-default">
                      <TableCell className="text-text-primary px-6 py-5.5 text-sm">
                        {row.name}
                        {self ? (
                          <span className="text-text-secondary ml-2 text-xs">(you)</span>
                        ) : null}
                      </TableCell>
                      <TableCell className="text-text-secondary py-5.5 pr-6 pl-0 text-sm">
                        {row.email}
                      </TableCell>
                      <TableCell className="py-5.5 pr-6 pl-0">
                        <div className="flex flex-wrap gap-1.5">
                          {row.permissions.map((permission) => (
                            <Badge
                              key={permission}
                              variant="outline"
                              className="border-border-default text-text-secondary rounded-md px-2 text-xs font-normal"
                            >
                              {adminPermissionLabels[permission]}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="py-5.5 pr-6 pl-0">
                        <AccessBadge active={row.isActive} />
                      </TableCell>
                      <TableCell className="text-text-secondary py-5.5 pr-6 pl-0 text-sm">
                        {row.added}
                      </TableCell>
                      <TableCell className="py-5.5 pr-6 pl-0 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              aria-label={`Actions for ${row.name}`}
                              className="border-border-default"
                            >
                              <MoreHorizontal />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="admin-surface w-48">
                            {row.isActive ? (
                              <DropdownMenuItem
                                variant="destructive"
                                disabled={pending || self}
                                onSelect={(event) => {
                                  event.preventDefault();
                                  setActive(row, false);
                                }}
                              >
                                Suspend access
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                disabled={pending}
                                onSelect={(event) => {
                                  event.preventDefault();
                                  setActive(row, true);
                                }}
                              >
                                Restore access
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}

        <TablePager current={current} pageCount={pageCount} onGoTo={goTo} />
      </div>
    </div>
  );
};
