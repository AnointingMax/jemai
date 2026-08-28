"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { resetPasswordAction } from "@/app/admin/(auth)/actions";
import { AuthField } from "@/components/admin/auth-field";
import { AuthSubmit } from "@/components/admin/auth-submit";

type ResetPasswordFormValues = {
  token: string;
  password: string;
  confirmPassword: string;
};

/**
 * Step three of recovery. The token rides in from the link's query string as a
 * hidden value, so a tampered or missing one fails the same schema every other
 * field does rather than needing its own branch.
 */
export const ResetPasswordForm = ({ token }: { token: string }) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const { register, handleSubmit } = useForm<ResetPasswordFormValues>({
    defaultValues: { token, password: "", confirmPassword: "" },
  });

  const onSubmit = handleSubmit((values) =>
    startTransition(async () => {
      const result = await resetPasswordAction(values);

      if (result.error) {
        toast.error(result.message);
        return;
      }

      toast.success(result.data);
      router.replace("/admin/reset-password/success");
    }),
  );

  return (
    <form onSubmit={onSubmit} noValidate className="mt-8.5 flex flex-col gap-5">
      <input type="hidden" {...register("token")} />
      <AuthField
        id="password"
        type="password"
        autoComplete="new-password"
        minLength={8}
        placeholder="Choose a strong password"
        aria-label="New password"
        disabled={pending}
        {...register("password")}
      />
      <AuthField
        id="confirm-password"
        type="password"
        autoComplete="new-password"
        minLength={8}
        placeholder="Confirm password"
        aria-label="Confirm password"
        disabled={pending}
        {...register("confirmPassword")}
      />
      <AuthSubmit type="submit" className="mt-1" disabled={pending}>
        {pending ? "Resetting…" : "Reset Password"}
      </AuthSubmit>
    </form>
  );
};
