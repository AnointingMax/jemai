import type { Metadata } from "next";
import { AuthCard } from "@/components/admin/auth-card";
import { AuthSubmit } from "@/components/admin/auth-submit";

export const metadata: Metadata = {
  title: "Password reset — JEMAI Admin",
};

const ResetPasswordSuccessPage = () => (
  <AuthCard
    title="Password reset"
    description={
      <>
        Your password has been successfully reset.
        <br />
        Click below to log in.
      </>
    }
  >
    <div className="mt-8.25">
      <AuthSubmit asChild>
        <a href="/admin/login">Continue</a>
      </AuthSubmit>
    </div>
  </AuthCard>
);

export default ResetPasswordSuccessPage;
