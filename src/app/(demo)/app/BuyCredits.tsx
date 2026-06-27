"use client";

import { useState } from "react";
import { CREDIT_PACKS } from "@/lib/pricing";

export default function BuyCredits() {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function buy(packId: string) {
    setError(null);
    setPendingId(packId);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packId }),
      });
      if (!res.ok) throw new Error(`Checkout failed (${res.status})`);
      const { url } = (await res.json()) as { url?: string };
      if (!url) throw new Error("No checkout URL returned");
      window.location.href = url;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Checkout failed");
      setPendingId(null);
    }
  }

  return (
    <section
      id="buy-credits"
      className="scroll-mt-24 rounded-[var(--radius-card)] border border-border bg-surface p-6"
    >
      <h2 className="text-lg font-semibold tracking-tight">Buy credits</h2>
      <p className="mt-1 text-sm text-muted">Top up your wallet. Secured by Stripe.</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {CREDIT_PACKS.map((pack) => {
          const isPending = pendingId === pack.id;
          return (
            <div
              key={pack.id}
              className="flex flex-col justify-between rounded-[var(--radius-card)] border border-border bg-background p-4"
            >
              <div>
                <p className="tnum text-2xl font-semibold tracking-tight">
                  {pack.credits.toLocaleString()}
                </p>
                <p className="text-sm text-muted">credits</p>
              </div>
              <button
                type="button"
                onClick={() => buy(pack.id)}
                disabled={pendingId !== null}
                className="mt-4 w-full rounded-[var(--radius-card)] bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? "Redirecting…" : `Buy · $${pack.priceUsd}`}
              </button>
            </div>
          );
        })}
      </div>

      {error && <p className="mt-3 text-sm text-negative">{error}</p>}
    </section>
  );
}
