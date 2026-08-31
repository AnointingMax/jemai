import env from "@/lib/env";
import { renderEmail } from "@/lib/mail/render";
import { sendMail } from "@/lib/mail/send";

/**
 * The reset link, delivered. The token is only ever put in front of the address
 * it was minted for, so the copy says plainly what to do when the mail was not
 * asked for: nothing. Ignoring it leaves the password where it is.
 *
 * Throws when the provider refuses; `requestPasswordResetAction` catches that
 * and shows the reader one generic line, so nothing about the account leaks
 * through a failure either.
 */
export const sendPasswordResetEmail = async (email: string, token: string) => {
  const url = `${env.APP_URL}/admin/reset-password?token=${encodeURIComponent(token)}`;

  const { html, text } = renderEmail({
    preview: "Reset the password on your JEMAI admin account.",
    heading: "Reset your password",
    paragraphs: [
      "Someone asked to reset the password on the JEMAI admin account registered to this address. Use the link below to choose a new one.",
      "The link is good for one hour, and only until it has been used once.",
    ],
    action: { label: "Choose a new password", url },
    footnotes: [
      "If this was not you, ignore this message — the password stays as it is, and the link expires on its own.",
    ],
  });

  await sendMail({ to: email, subject: "Reset your JEMAI admin password", html, text });
};
