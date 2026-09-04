"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, MoreHorizontal, Plus, X } from "lucide-react";
import { toast } from "sonner";

import {
  createTermAction,
  deleteTermAction,
  moveTermAction,
  renameTermAction,
} from "@/app/admin/(dashboard)/taxonomy/actions";
import { FieldLabel, fieldChrome } from "@/components/admin/form-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
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
import type { TaxonomyTerm } from "@/lib/admin/taxonomy";
import type { TaxonomyKind } from "@/lib/taxonomy";
import { cn } from "@/lib/utils";

export type TaxonomyPanelProps = {
  kind: TaxonomyKind;
  /** "Furniture categories" — the panel's own heading. */
  title: string;
  description: string;
  terms: TaxonomyTerm[];
  /** What is filed under a term, plural: "products", "artworks". */
  filed: string;
  /** Placeholder for the add field — an example the reader recognises. */
  placeholder: string;
  addLabel: string;
};

/**
 * One vocabulary, managed in place: a short list with an add field above it and
 * the four things that can happen to a term hanging off each row.
 *
 * There is no search, sort or paging here on purpose. These lists are a handful
 * of rows that the storefront menu has to fit, and the order is authored rather
 * than derived — the reader is arranging a menu, not looking something up.
 */
export const TaxonomyPanel = ({
  kind,
  title,
  description,
  terms,
  filed,
  placeholder,
  addLabel,
}: TaxonomyPanelProps) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [adding, setAdding] = useState("");
  /** The term the rename dialog is open on, or null while it is closed. */
  const [renaming, setRenaming] = useState<TaxonomyTerm | null>(null);
  const [renamed, setRenamed] = useState("");

  /**
   * Every write goes through here: one result shape, one toast, and a refresh
   * so the list, its usage counts and the rest of the console agree again.
   */
  const run = (
    write: () => Promise<{ error: true; message: string; } | { error: false; data: string; }>,
    onDone?: () => void,
  ) =>
    startTransition(async () => {
      const result = await write();
      if (result.error) {
        toast.error(result.message);
        return;
      }

      toast.success(result.data);
      onDone?.();
      router.refresh();
    });

  const add = (event: React.FormEvent) => {
    event.preventDefault();
    if (!adding.trim()) return;
    run(() => createTermAction(kind, { name: adding }), () => setAdding(""));
  };

  const rename = (event: React.FormEvent) => {
    event.preventDefault();
    if (!renaming || !renamed.trim()) return;
    run(
      () => renameTermAction(kind, { id: renaming.id, name: renamed }),
      () => setRenaming(null),
    );
  };

  const remove = (term: TaxonomyTerm) => {
    // The store refuses a term still in use, but saying so before the round
    // trip is friendlier than a toast that only explains the refusal.
    if (term.usage) {
      toast.error(`${term.name} still has ${term.usage} ${filed}. Move them first.`);
      return;
    }
    if (!window.confirm(`Delete ${term.name}?`)) return;
    run(() => deleteTermAction(kind, { id: term.id }));
  };

  const move = (term: TaxonomyTerm, direction: "up" | "down") =>
    run(() => moveTermAction(kind, { id: term.id, direction }));

  const addFieldId = `add-${kind}`;

  return (
    <section
      className={cn(
        "border-border-default overflow-hidden rounded-xl border transition-opacity",
        pending && "opacity-60",
      )}
    >
      <header className="border-border-default bg-admin-muted flex flex-col gap-4 border-b p-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-text-primary text-base font-semibold">{title}</h2>
          <p className="text-text-secondary max-w-[70ch] text-sm">{description}</p>
        </div>

        <form onSubmit={add} className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <div className="flex flex-1 flex-col gap-1.5">
            <FieldLabel htmlFor={addFieldId}>{addLabel}</FieldLabel>
            <Input
              id={addFieldId}
              value={adding}
              onChange={(event) => setAdding(event.target.value)}
              placeholder={placeholder}
              autoComplete="off"
              disabled={pending}
              className={cn(fieldChrome, "h-11")}
            />
          </div>
          <Button type="submit" disabled={pending || !adding.trim()} className="h-11 px-5">
            <Plus />
            Add
          </Button>
        </form>
      </header>

      {terms.length === 0 ? (
        <Empty className="py-12">
          <EmptyHeader>
            <EmptyTitle>Nothing in this list yet</EmptyTitle>
            <EmptyDescription>
              Add the first one above. Until then the catalogue form has nothing to
              offer and the storefront menu has nothing to draw.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="overflow-x-auto">
          <Table className="min-w-[520px]">
            <TableHeader>
              <TableRow className="border-border-default hover:bg-transparent">
                <TableHead className="h-11 px-6">Name</TableHead>
                <TableHead className="h-11">In use</TableHead>
                <TableHead className="h-11 pr-6 text-right">Order</TableHead>
                <TableHead className="h-11 w-0 pr-6">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {terms.map((term, index) => (
                <TableRow key={term.id} className="border-border-default">
                  <TableCell className="text-text-primary px-6 py-4 text-sm">
                    {term.name}
                  </TableCell>
                  <TableCell className="py-4 pr-6 pl-0">
                    <Badge
                      variant="outline"
                      className="border-border-default text-text-secondary rounded-md px-2 text-xs font-normal"
                    >
                      {term.usage} {term.usage === 1 ? filed.replace(/s$/, "") : filed}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 pr-6 pl-0">
                    {/* The order the storefront menu draws them in, moved a step
                        at a time — these lists are short enough that a drag
                        handle would be more machinery than it is worth. */}
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        aria-label={`Move ${term.name} up`}
                        disabled={pending || index === 0}
                        onClick={() => move(term, "up")}
                        className="border-border-default size-8"
                      >
                        <ArrowUp />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        aria-label={`Move ${term.name} down`}
                        disabled={pending || index === terms.length - 1}
                        onClick={() => move(term, "down")}
                        className="border-border-default size-8"
                      >
                        <ArrowDown />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 pr-6 pl-0 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          aria-label={`Actions for ${term.name}`}
                          className="border-border-default"
                        >
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="admin-surface w-48">
                        <DropdownMenuItem
                          disabled={pending}
                          onSelect={() => {
                            setRenaming(term);
                            setRenamed(term.name);
                          }}
                        >
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          disabled={pending}
                          onSelect={(event) => {
                            event.preventDefault();
                            remove(term);
                          }}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={renaming !== null} onOpenChange={(next) => next || setRenaming(null)}>
        <DialogContent className="admin-surface bg-background border-border-default w-[min(460px,calc(100vw-2rem))] rounded-xl border p-6 shadow-lg sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <DialogTitle className="text-text-primary font-sans text-xl font-semibold">
                Rename {renaming?.name}
              </DialogTitle>
              <DialogDescription className="text-text-secondary text-sm">
                {renaming?.usage
                  ? `The ${renaming.usage} ${renaming.usage === 1 ? filed.replace(/s$/, "") : filed} filed under it move with the name, here and on the storefront.`
                  : "Nothing is filed under it yet, so only the list itself changes."}
              </DialogDescription>
            </div>
            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Close"
                className="text-text-secondary -mt-1 -mr-2 shrink-0"
              >
                <X className="size-4" />
              </Button>
            </DialogClose>
          </div>

          <form onSubmit={rename} noValidate className="mt-6 flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <FieldLabel htmlFor={`rename-${kind}`} required>
                Name
              </FieldLabel>
              <Input
                id={`rename-${kind}`}
                value={renamed}
                onChange={(event) => setRenamed(event.target.value)}
                autoComplete="off"
                disabled={pending}
                className={cn(fieldChrome, "h-11")}
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setRenaming(null)}
                disabled={pending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={pending || !renamed.trim()}>
                {pending ? "Saving…" : "Save name"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
};
