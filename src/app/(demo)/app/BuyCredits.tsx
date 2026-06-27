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
    <section id="buy-credits" className="scroll-mt-24">
      <span className="eyebrow">Secured by Stripe</span>
      <h2 className="display mt-3 text-3xl">Top up.</h2>

      <div className="mt-6 grid gap-px border border-border bg-border sm:grid-cols-2">
        {CREDIT_PACKS.map((pack) => {
          const isPending = pendingId === pack.id;
          return (
            <div
              key={pack.id}
              className="flex flex-col justify-between gap-5 bg-surface p-5"
            >
              <div>
                <p className="tnum text-4xl text-foreground">
                  {pack.credits.toLocaleString()}
                </p>
                <p className="eyebrow mt-1">credits</p>
              </div>
              <button
                type="button"
                onClick={() => buy(pack.id)}
                disabled={pendingId !== null}
                className="group inline-flex w-full items-center justify-between gap-2 border border-foreground px-4 py-2.5 text-sm text-foreground transition-colors hover:border-accent hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span>{isPending ? "Redirecting…" : "Buy"}</span>
                <span className="tnum">${pack.priceUsd}</span>
              </button>
            </div>
          );
        })}
      </div>

      {error && (
        <p className="mt-3 font-mono text-sm text-negative">{error}</p>
      )}
    </section>
  );
}
