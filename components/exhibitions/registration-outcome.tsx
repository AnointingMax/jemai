"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { confirmRegistrationAction } from "@/app/(customer)/(site)/exhibitions/actions";
import { FormStatus } from "@/components/shared/form-status";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

type Outcome = { reference: string; message: string; failed: boolean; };

/**
 * Where a payer lands coming back from Paystack. The reference in the URL is
 * only a prompt: the action verifies it against Paystack and answers from the
 * registration it settled, so a hand-typed `?reference=` confirms nothing.
 *
 * Closing drops the query, so a reload does not re-open the panel — and the
 * webhook has settled the same row regardless of whether anyone came back here
 * at all.
 */
export const RegistrationOutcome = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");

  const [outcome, setOutcome] = useState<Outcome | null>(null);

  useEffect(() => {
    if (!reference) return;

    let cancelled = false;
    confirmRegistrationAction(reference).then((result) => {
      if (cancelled) return;
      setOutcome({
        reference,
        message: result.error ? result.message : result.data.message,
        failed: result.error || result.data.status !== "Confirmed",
      });
    });

    return () => {
      cancelled = true;
    };
  }, [reference]);

  if (!reference) return null;

  /* The verification is a round trip through Paystack, so the panel opens on
     the waiting line rather than after it — coming back to a blank page is the
     one thing a payer should never see. */
  const settled = outcome?.reference === reference ? outcome : null;

  return (
    <Dialog
      open
      onOpenChange={(next) => {
        if (!next) router.replace(`${window.location.pathname}`);
      }}
    >
      <DialogContent className="w-[min(520px,calc(100vw-2rem))] max-w-none p-8 bg-background">
        <DialogTitle className="text-h4">Your registration</DialogTitle>
        <DialogDescription className="sr-only">
          The outcome of the payment you were just returned from.
        </DialogDescription>

        {settled ? (
          <FormStatus error={settled.failed} className="mt-4">
            {settled.message}
          </FormStatus>
        ) : (
          <p role="status" className="text-body-sm text-text-secondary mt-4">
            Confirming your payment with Paystack…
          </p>
        )}

        <p className="text-body-xs text-text-secondary mt-4">
          Reference {reference}
        </p>

        <Button
          type="button"
          variant="jemai"
          size="cta"
          disabled={!settled}
          onClick={() => router.replace(window.location.pathname)}
          className="mt-6 self-start px-6"
        >
          Done
        </Button>
      </DialogContent>
    </Dialog>
  );
};
