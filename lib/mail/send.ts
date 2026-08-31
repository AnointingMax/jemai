import env from "@/lib/env";

/**
 * The one place an email leaves this project. Resend is the provider, spoken to
 * over its HTTP API rather than its SDK — one POST, no dependency to keep in
 * step with the runtime.
 *
 * Swapping providers is this file and nothing else: every caller hands over the
 * same `Message` and gets back the same promise.
 */
const ENDPOINT = "https://api.resend.com/emails";

export type Message = {
  to: string;
  subject: string;
  /** The rendered email. Build it with `renderEmail` so every message shares a shell. */
  html: string;
  /** The plain-text alternative. Never optional — a mail client may only show this. */
  text: string;
  /** Where a reply should land. Defaults to `MAIL_REPLY_TO`, then the sender. */
  replyTo?: string;
};

const configured = () => Boolean(env.RESEND_API_KEY && env.MAIL_FROM);

/**
 * Sends `message`, or throws with a line meant for the server log. Callers sit
 * inside an action's try/catch, which turns any failure into the one sentence
 * the reader is allowed to see — a provider's error text never reaches a toast.
 *
 * With no provider configured a development run logs the message and carries
 * on, which is enough to walk a flow locally. Production throws instead: a mail
 * that silently goes nowhere is worse than a screen that says it failed.
 */
export const sendMail = async ({ to, subject, html, text, replyTo }: Message) => {
  if (!configured()) {
    if (env.NODE_ENV === "production")
      throw new Error("Mail is not configured — set RESEND_API_KEY and MAIL_FROM");

    console.info(`[mail] To ${to} — ${subject}\n${text}`);
    return;
  }

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.MAIL_FROM,
      to: [to],
      subject,
      html,
      text,
      reply_to: replyTo ?? env.MAIL_REPLY_TO ?? undefined,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `Resend refused the message to ${to} (${response.status}): ${detail || "no detail"}`,
    );
  }
};

/**
 * The same send, for mail that is a courtesy rather than the point of the call.
 *
 * An order that Paystack has settled is settled whether or not its receipt got
 * out, and a buyer must not see "could not confirm that payment" because the
 * mail provider was down. So these failures are logged with enough to resend by
 * hand — the address and the subject — and the caller carries on.
 */
export const notify = async (message: Message) => {
  try {
    await sendMail(message);
  } catch (error) {
    console.error(`[mail] Could not deliver "${message.subject}" to ${message.to}`, error);
  }
};
