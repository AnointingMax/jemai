"use client";

import { useEffect, useState, useTransition, type ReactNode } from "react";
import { useForm } from "react-hook-form";

import { subscribeToNewsletterAction } from "@/app/(customer)/(site)/actions";
import { FormStatus } from "@/components/shared/form-status";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { SubscriberSource } from "@/lib/admin/newsletter";

/** How long a result banner stays up, in milliseconds. */
const STATUS_TIMEOUT = 10_000;

type SubscribeFormProps = {
  /** Unique per instance — the journal section and the footer both mount one. */
  id: string;
  source: SubscriberSource;
  className?: string;
  /** The input/button row, which is side-by-side in one frame and stacked in the other. */
  fieldClassName?: string;
  inputClassName?: string;
  buttonClassName?: string;
  /** The fine print under the field, which differs between the two frames. */
  children: ReactNode;
};

/**
 * The storefront's sign-up field. The surrounding copy and the layout belong to
 * whichever frame mounts it, so those come in as classes and children — this
 * owns only the address, the submit and the line that comes back.
 *
 * The result is reported inline rather than as a toast: the storefront mounts no
 * Toaster, and a footer sign-up wants its answer where the reader is looking.
 */
export const SubscribeForm = ({
  id,
  source,
  className,
  fieldClassName,
  inputClassName,
  buttonClassName,
  children,
}: SubscribeFormProps) => {
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ error: boolean; message: string; } | null>(null);
  const { register, handleSubmit, reset } = useForm<{ email: string; }>({
    defaultValues: { email: "" },
  });

  // Long enough to read a sentence twice over, then the banner clears itself
  // rather than sitting under the field for the rest of the visit. Each result
  // is a fresh object, so a second submit restarts the ten seconds.
  useEffect(() => {
    if (!status) return;
    const timer = setTimeout(() => setStatus(null), STATUS_TIMEOUT);
    return () => clearTimeout(timer);
  }, [status]);

  const onSubmit = handleSubmit((values) =>
    startTransition(async () => {
      const result = await subscribeToNewsletterAction({ ...values, source });

      if (result.error) {
        setStatus({ error: true, message: result.message });
        return;
      }

      setStatus({ error: false, message: result.data });
      reset();
    }),
  );

  return (
    <form onSubmit={onSubmit} noValidate className={cn("flex flex-col gap-2", className)}>
      <div className={cn("flex flex-col items-stretch gap-2", fieldClassName)}>
        <label htmlFor={id} className="sr-only">
          Your E-mail
        </label>
        <Input
          id={id}
          type="email"
          autoComplete="email"
          placeholder="Your E-mail"
          disabled={pending}
          className={inputClassName}
          {...register("email")}
        />
        <Button type="submit" size="cta" disabled={pending} className={buttonClassName}>
          {pending ? "Subscribing…" : "Subscribe"}
        </Button>
      </div>

      {status ? <FormStatus error={status.error}>{status.message}</FormStatus> : null}

      {children}
    </form>
  );
};
