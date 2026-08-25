import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "@/components/admin/auth-card";
import { AuthField } from "@/components/admin/auth-field";
import { AuthSubmit } from "@/components/admin/auth-submit";

export const metadata: Metadata = {
  title: "Password recovery — JEMAI Admin",
};

const RecoverPasswordPage = () => (
  <AuthCard
    title="Password Recovery"
    description="Enter the email address associated with your account and we'll send you a link to reset your password."
  >
    <form className="mt-8.25 flex flex-col gap-6">
      <AuthField
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="Enter your email"
        label="Email"
      />
      <AuthSubmit type="submit">Continue</AuthSubmit>
    </form>
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
