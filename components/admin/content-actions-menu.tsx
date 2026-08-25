"use client";

import Link from "next/link";
import { useTransition } from "react";
import { MoreHorizontal, SquarePen, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * The overflow menu every detail screen carries. Deleting is destructive and
 * irreversible, so it confirms before firing the action rather than on the way
 * back — there is no undo behind it.
 */
export const ContentActionsMenu = ({
  editHref,
  name,
  deleteLabel = "Delete",
  onDelete,
}: {
  editHref: string;
  name: string;
  /** "Delete exhibition" where the frame names the record type; plain "Delete" otherwise. */
  deleteLabel?: string;
  onDelete: () => Promise<void>;
}) => {
  const [pending, startTransition] = useTransition();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon-lg"
          aria-label={`Actions for ${name}`}
          className="border-border-default"
        >
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem asChild>
          <Link href={editHref}>
            <SquarePen />
            Edit general info
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          disabled={pending}
          onSelect={(event) => {
            event.preventDefault();
            if (!window.confirm(`Delete “${name}”? This cannot be undone.`)) return;
            startTransition(async () => {
              await onDelete();
            });
          }}
        >
          <Trash2 />
          {deleteLabel}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
