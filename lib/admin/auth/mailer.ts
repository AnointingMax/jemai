import env from "@/lib/env";

/**
 * Delivery for the reset link. There is no mail provider wired into the project
 * yet, so this is the single seam where one goes: swap the body for the SDK call
 * and every caller keeps working.
 *
 * Until then the link is logged, which is enough to drive the flow locally. In
 * production that log is the only trace, so it is loud about being a stand-in.
 */
export const sendPasswordResetEmail = async (email: string, token: string) => {
  const url = `${env.APP_URL}/admin/reset-password?token=${encodeURIComponent(token)}`;

  if (env.NODE_ENV === "production") {
    console.warn(
      `[mailer] No email provider configured — password reset for ${email} was not delivered.`,
    );
    return;
  }

  console.info(`[mailer] Password reset link for ${email}: ${url}`);
};
