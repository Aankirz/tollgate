import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { topup } from "@/lib/wallet";
import { stripe, isStripeConfigured } from "@/lib/stripe";

// Stripe needs the raw request body to verify the signature, so this route
// must run on the Node runtime (no edge, no JSON pre-parsing).
export const runtime = "nodejs";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request): Promise<Response> {
  if (!isStripeConfigured || !stripe || !webhookSecret) {
    return NextResponse.json({ skipped: true });
  }

  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature ?? "", webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { userId, credits } = session.metadata ?? {};

    if (userId && credits) {
      // idempotencyKey = session.id dedupes Stripe webhook retries.
      await topup({
        userId,
        credits: Number(credits),
        revenueUsd: (session.amount_total ?? 0) / 100,
        type: "topup",
        idempotencyKey: session.id,
        meta: { stripeSession: session.id },
      });
    }
  }

  return NextResponse.json({ received: true });
}
