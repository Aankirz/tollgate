import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { CREDIT_PACKS } from "@/lib/pricing";
import { topup } from "@/lib/wallet";
import { stripe, isStripeConfigured } from "@/lib/stripe";

export const runtime = "nodejs";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function POST(req: Request): Promise<Response> {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as { packId?: string } | null;
  const pack = CREDIT_PACKS.find((p) => p.id === body?.packId);
  if (!pack) {
    return NextResponse.json({ error: "Invalid packId" }, { status: 400 });
  }

  if (isStripeConfigured && stripe) {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: pack.priceUsd * 100,
            product_data: { name: `${pack.credits} Tollgate credits` },
          },
        },
      ],
      metadata: {
        userId: user.id,
        packId: pack.id,
        credits: String(pack.credits),
      },
      success_url: `${APP_URL}/app?topup=success`,
      cancel_url: `${APP_URL}/app`,
    });

    return NextResponse.json({ url: session.url });
  }

  // ponytail: no Stripe keys -> grant credits directly so the app is demoable.
  await topup({
    userId: user.id,
    credits: pack.credits,
    revenueUsd: pack.priceUsd,
    type: "topup",
    idempotencyKey: `stub:${user.id}:${pack.id}:${Date.now()}`,
    meta: { stub: true },
  });

  return NextResponse.json({ url: "/app?topup=stub" });
}
