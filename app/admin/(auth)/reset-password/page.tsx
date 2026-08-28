import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthCard } from "@/components/admin/auth-card";
import { ResetPasswordForm } from "@/components/admin/reset-password-form";

export const metadata: Metadata = {
  title: "Choose a password — JEMAI Admin",
};

/**
 * Step three of recovery. The token is only carried through to the form here —
 * it is verified when the reset is submitted, so a stale link fails once, with
 * a message, rather than dead-ending on this frame.
 */
const ResetPasswordPage = async ({
  searchParams,
}: PageProps<"/admin/reset-password">) => {
  const { token } = await searchParams;
  if (typeof token !== "string" || !token) redirect("/admin/recover-password");

  return (
    <AuthCard
      title="Choose a password"
      description="Must be at least 8 characters."
    >
      <ResetPasswordForm token={token} />
    </AuthCard>
  );
};

export default ResetPasswordPage;
