"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { signInAction } from "@/app/admin/(auth)/actions";
import { AuthField } from "@/components/admin/auth-field";
import { AuthSubmit } from "@/components/admin/auth-submit";

type LoginFormValues = { email: string; password: string };

/**
 * The sign-in frame's form. Validation lives in the action's yup schema rather
 * than being restated here, so the browser, the client and the server can never
 * disagree about what counts as valid — whatever fails comes back as one string
 * and lands in a toast.
 */
export const LoginForm = () => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const { register, handleSubmit } = useForm<LoginFormValues>({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit((values) =>
    startTransition(async () => {
      const result = await signInAction(values);

      if (result.error) {
        toast.error(result.message);
        return;
      }

      toast.success(`Welcome back, ${result.data.name}`);
      // `refresh` first: the layout above reads the session cookie on the
      // server, and without it the console would render from the cache that
      // was built while there was no session.
      router.refresh();
      router.replace("/admin");
    }),
  );

  return (
    <form onSubmit={onSubmit} noValidate className="mt-7.75 flex flex-col gap-5">
      <AuthField
        id="email"
        type="email"
        autoComplete="email"
        placeholder="Enter your email"
        label="Email"
        disabled={pending}
        {...register("email")}
      />
      <AuthField
        id="password"
        type="password"
        autoComplete="current-password"
        placeholder="Enter your password"
        label="Password"
        disabled={pending}
        {...register("password")}
      />

      <div className="flex items-center justify-end">
        <Link
          href="/admin/recover-password"
          className="text-text-primary text-sm font-semibold hover:underline"
        >
          Recover Password
        </Link>
      </div>

      <AuthSubmit type="submit" className="mt-1" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </AuthSubmit>
    </form>
  );
};
