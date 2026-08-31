import { createHmac, timingSafeEqual } from "node:crypto";

import { PaystackSDK } from "@roarexclamation/paystack-ts-sdk";
import env from "@/lib/env";

/** Paystack quotes in the currency's smallest denomination. */
export const toKobo = (naira: number) => Math.round(naira * 100);

export const toNaira = (kobo: number) => Math.round(kobo / 100);

const client = () => {
  if (!env.PAYSTACK_SECRET_KEY)
    throw new Error("PAYSTACK_SECRET_KEY is not set — payments are not configured");

  return new PaystackSDK({ secretKey: env.PAYSTACK_SECRET_KEY });
};

export const paymentReference = (prefix: string) =>
  `${prefix}-${crypto.randomUUID().replaceAll("-", "").slice(0, 20).toUpperCase()}`;

export type PaymentRequest = {
  email: string;
  amount: number;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
};

export const initializePayment = async ({
  email,
  amount,
  reference,
  callbackUrl,
  metadata,
}: PaymentRequest) => {
  const response = await client().transactions.transactionInitialize({
    transactionInitialize: {
      email,
      amount: toKobo(amount),
      currency: "NGN",
      reference,
      callbackUrl,
      metadata,
    },
  });

  if (!response.status || !response.data?.authorizationUrl)
    throw new Error(`Paystack declined to open the transaction: ${response.message}`);

  return { authorizationUrl: response.data.authorizationUrl, reference };
};

export type PaymentVerification = {
  status: string;
  paid: boolean;
  amount: number;
  currency: string;
  paidAt: Date | null;
};

export const verifyPayment = async (reference: string): Promise<PaymentVerification> => {
  const response = await client().transactions.transactionVerify({ reference });
  const data = response.data;

  return {
    status: data.status,
    paid: response.status && data.status === "success",
    amount: toNaira(data.amount),
    currency: data.currency,
    paidAt: data.paidAt ? new Date(data.paidAt) : null,
  };
};

export const isPaystackSignature = (rawBody: string, signature: string | null) => {
  if (!signature || !env.PAYSTACK_SECRET_KEY) return false;

  const expected = createHmac("sha512", env.PAYSTACK_SECRET_KEY)
    .update(rawBody)
    .digest("hex");

  if (expected.length !== signature.length) return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
};
