"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { requestPasswordResetAction } from "@/app/admin/(auth)/actions";

/** "Click to resend" on the check-your-email frame — the same action, again. */
export const ResendResetLink = ({ email }: { email: string }) => {
  const [pending, startTransition] = useTransition();

  const onClick = () =>
    startTransition(async () => {
      const result = await requestPasswordResetAction({ email });

      if (result.error) {
        toast.error(result.message);
        return;
      }

      toast.success(`We sent another link to ${result.data.email}`);
    });

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="text-action-link cursor-pointer font-semibold hover:underline disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Sending…" : "Click to resend"}
    </button>
  );
};
