import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "@/components/admin/auth-card";
import { RecoverPasswordForm } from "@/components/admin/recover-password-form";

export const metadata: Metadata = {
  title: "Password recovery — JEMAI Admin",
};

const RecoverPasswordPage = () => (
  <AuthCard
    title="Password Recovery"
    description="Enter the email address associated with your account and we'll send you a link to reset your password."
  >
    <RecoverPasswordForm />
    <p className="text-text-secondary text-body mt-6 text-center">
      Nevermind,{" "}
      <Link
        href="/admin/login"
        className="text-action-link font-semibold hover:underline"
      >
        Go back to login
      </Link>
    </p>
  </AuthCard>
);

export default RecoverPasswordPage;
