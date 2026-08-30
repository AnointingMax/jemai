"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/lib/action-result";

/**
 * The trash button beside a single-image card on a detail screen. Clearing a
 * slot is a one-field edit, so it fires its action directly rather than sending
 * the reader back through the form — the same `ActionResult` handling as the
 * overflow menu, and a refresh so the card redraws from the row just written.
 */
export const ClearImageButton = ({
  label,
  disabled,
  onClear,
}: {
  /** What is being removed, lowercase — "thumbnail", "artist profile". */
  label: string;
  disabled?: boolean;
  onClear: () => Promise<ActionResult<string>>;
}) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      disabled={disabled || pending}
      aria-label={`Remove ${label}`}
      className="border-border-default text-text-secondary hover:text-[#e11d48] size-9"
      onClick={() =>
        startTransition(async () => {
          const result = await onClear();

          if (result.error) {
            toast.error(result.message);
            return;
          }

          toast.success(result.data);
          router.refresh();
        })
      }
    >
      <Trash2 />
    </Button>
  );
};
