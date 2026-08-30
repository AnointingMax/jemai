import { NextResponse } from "next/server";

import { settleOrder } from "@/lib/admin/orders";
import { settleRegistration } from "@/lib/admin/registrations";
import { isPaystackSignature } from "@/lib/paystack";

const settlers = [
  { prefix: "JEM-EXH-", settle: settleRegistration },
  { prefix: "JEM-ORD-", settle: settleOrder },
];

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
  if (event.event !== "charge.success" || !reference)
    return NextResponse.json({ received: true });

  const settler = settlers.find((entry) => reference.startsWith(entry.prefix));
  if (!settler) return NextResponse.json({ received: true });

  try {
    await settler.settle(reference);
  } catch (error) {
    console.error("Could not settle the payment this webhook named", error);
    return NextResponse.json({ error: "Could not settle" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
};
