import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "@/components/admin/auth-card";
import { AuthField } from "@/components/admin/auth-field";
import { AuthSubmit } from "@/components/admin/auth-submit";

export const metadata: Metadata = {
  title: "Sign in — JEMAI Admin",
};

const AdminLoginPage = () => (
  <AuthCard
    title="Admin Portal"
    description="Create your free account"
    size="sm"
  >
    <form className="mt-7.75 flex flex-col gap-5">
      <AuthField
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="Enter your email"
        label="Email"
      />
      <AuthField
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        placeholder="Enter your password"
        label="Password"
      />

      <div className="flex items-center justify-end">
        <Link
          href="/admin/recover-password"
          className="text-text-primary text-sm font-semibold hover:underline"
        >
          Recover Password
        </Link>
      </div>

      <AuthSubmit type="submit" className="mt-1">
        Sign in
      </AuthSubmit>
    </form>
  </AuthCard>
);

export default AdminLoginPage;
