import type { Metadata } from "next";
import { AuthCard } from "@/components/admin/auth-card";
import { AuthSubmit } from "@/components/admin/auth-submit";

export const metadata: Metadata = {
  title: "Check your email — JEMAI Admin",
};

/** Step two of recovery. The address is a placeholder until auth is wired up. */
const CheckEmailPage = () => (
  <AuthCard
    title="Check your email"
    description={
      <>
        We sent a password reset link to
        <br />
        <span className="text-text-primary font-semibold">admin@jemai.com</span>
      </>
    }
  >
    <div className="mt-8.25 flex flex-col">
      <AuthSubmit asChild>
        <a href="mailto:">Open Email app</a>
      </AuthSubmit>
      <p className="text-text-secondary text-body mt-6 text-center">
        Didn&rsquo;t receive the email?{" "}
        <button
          type="button"
          className="text-action-link cursor-pointer font-semibold hover:underline"
        >
          Click to resend
        </button>
      </p>
    </div>
  </AuthCard>
);

export default CheckEmailPage;
