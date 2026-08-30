import { NextResponse } from "next/server";

import { settleRegistration } from "@/lib/admin/registrations";
import { isPaystackSignature } from "@/lib/paystack";

export const POST = async (request: Request) => {
  const raw = await request.text();

  if (!isPaystackSignature(raw, request.headers.get("x-paystack-signature")))
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });

  let event: { event?: string; data?: { reference?: string; }; };
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Malformed payload" }, { status: 400 });
  }

  const reference = event.data?.reference;
  // Anything else on the account — transfers, disputes, subscriptions — is not
  // this route's business, and is acknowledged rather than retried at us.
  if (event.event !== "charge.success" || !reference)
    return NextResponse.json({ received: true });

  try {
    await settleRegistration(reference);
  } catch (error) {
    // A 500 is what asks Paystack to deliver this again, which is the right
    // answer when our own side failed rather than the payment.
    console.error("Could not settle the registration this webhook named", error);
    return NextResponse.json({ error: "Could not settle" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
};
