import type { Metadata } from "next";
import { AuthCard } from "@/components/admin/auth-card";
import { AuthField } from "@/components/admin/auth-field";
import { AuthSubmit } from "@/components/admin/auth-submit";

export const metadata: Metadata = {
  title: "Choose a password — JEMAI Admin",
};

const ResetPasswordPage = () => (
  <AuthCard title="Choose a password" description="Must be at least 8 characters.">
    <form className="mt-8.5 flex flex-col gap-5">
      <AuthField
        id="password"
        name="password"
        type="password"
        autoComplete="new-password"
        minLength={8}
        placeholder="Choose a strong password"
        aria-label="New password"
      />
      <AuthField
        id="confirm-password"
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        minLength={8}
        placeholder="Confirm password"
        aria-label="Confirm password"
      />
      <AuthSubmit type="submit" className="mt-1">
        Reset Password
      </AuthSubmit>
    </form>
  </AuthCard>
);

export default ResetPasswordPage;
