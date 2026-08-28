import type { Metadata } from "next";
import { AuthCard } from "@/components/admin/auth-card";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = {
  title: "Sign in — JEMAI Admin",
};

const AdminLoginPage = () => (
  <AuthCard title="Admin Portal" description="Sign in to the console" size="sm">
    <LoginForm />
  </AuthCard>
);

export default AdminLoginPage;
