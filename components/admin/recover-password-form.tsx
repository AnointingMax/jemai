"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { requestPasswordResetAction } from "@/app/admin/(auth)/actions";
import { AuthField } from "@/components/admin/auth-field";
import { AuthSubmit } from "@/components/admin/auth-submit";

/**
 * Step one of recovery. A success reports the same way for an address with an
 * account and one without — the action deliberately cannot tell the caller
 * which it was, so this only ever forwards to the "check your email" frame.
 */
export const RecoverPasswordForm = () => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const { register, handleSubmit } = useForm<{ email: string }>({
    defaultValues: { email: "" },
  });

  const onSubmit = handleSubmit((values) =>
    startTransition(async () => {
      const result = await requestPasswordResetAction(values);

      if (result.error) {
        toast.error(result.message);
        return;
      }

      router.push(
        `/admin/recover-password/check-email?email=${encodeURIComponent(result.data.email)}`,
      );
    }),
  );

  return (
    <form onSubmit={onSubmit} noValidate className="mt-8.25 flex flex-col gap-6">
      <AuthField
        id="email"
        type="email"
        autoComplete="email"
        placeholder="Enter your email"
        label="Email"
        disabled={pending}
        {...register("email")}
      />
      <AuthSubmit type="submit" disabled={pending}>
        {pending ? "Sending…" : "Continue"}
      </AuthSubmit>
    </form>
  );
};
