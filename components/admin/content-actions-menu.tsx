"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { MoreHorizontal, SquarePen, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/lib/action-result";
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
  deletedHref,
  onDelete,
}: {
  editHref: string;
  name: string;
  deleteLabel?: string;
  deletedHref?: string;
  onDelete: () => Promise<ActionResult<string> | void>;
}) => {
  const router = useRouter();
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
              const result = await onDelete();
              if (!result) return;

              if (result.error) {
                toast.error(result.message);
                return;
              }

              toast.success(result.data);
              if (deletedHref) {
                router.refresh();
                router.push(deletedHref);
              }
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
