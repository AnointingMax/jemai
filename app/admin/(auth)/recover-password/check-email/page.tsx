import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthCard } from "@/components/admin/auth-card";
import { AuthSubmit } from "@/components/admin/auth-submit";
import { ResendResetLink } from "@/components/admin/resend-reset-link";

export const metadata: Metadata = {
  title: "Check your email — JEMAI Admin",
};

/**
 * Step two of recovery. The address comes from the query string the previous
 * step redirected with — there is nothing to show without it, so a direct visit
 * goes back and asks.
 */
const CheckEmailPage = async ({
  searchParams,
}: PageProps<"/admin/recover-password/check-email">) => {
  const { email } = await searchParams;
  if (typeof email !== "string" || !email) redirect("/admin/recover-password");

  return (
    <AuthCard
      title="Check your email"
      description={
        <>
          We sent a password reset link to
          <br />
          <span className="text-text-primary font-semibold">{email}</span>
        </>
      }
    >
      <div className="mt-8.25 flex flex-col">
        <AuthSubmit asChild>
          <a href="mailto:">Open Email app</a>
        </AuthSubmit>
        <p className="text-text-secondary text-body mt-6 text-center">
          Didn&rsquo;t receive the email? <ResendResetLink email={email} />
        </p>
      </div>
    </AuthCard>
  );
};

export default CheckEmailPage;
