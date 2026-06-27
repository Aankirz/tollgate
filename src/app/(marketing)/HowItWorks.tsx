"use client";
import { useState } from "react";

type Step = { n: string; title: string; body: string; metric: string; metricLabel: string };

const STEPS: Step[] = [
  { n: "01", title: "Sign in", metric: "+50", metricLabel: "signup credits",
    body: "Your user gets a wallet and a signup bonus the moment they land — no setup, no card. Activation before they spend a cent." },
  { n: "02", title: "Generate", metric: "atomic", metricLabel: "debit per call",
    body: "Every AI call is metered: balance checked, model run, real token cost logged, credits debited — in one transaction on an append-only ledger." },
  { n: "03", title: "Top up", metric: "$5 → 500", metricLabel: "credits / pack",
    body: "Users buy credit packs through Stripe. You set the price, you keep the markup. Revenue is recognized as credits are consumed." },
  { n: "04", title: "Refer", metric: "+100 ×2", metricLabel: "both sides",
    body: "Share a link. When a friend joins, both sides get credits — exactly once, idempotent. The app grows itself." },
];

export function HowItWorks() {
  const [active, setActive] = useState(0);
  const step = STEPS[active];
  return (
    <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
      <ul className="flex flex-col">
        {STEPS.map((s, i) => {
          const on = i === active;
          return (
            <li key={s.n}>
              <button
                onClick={() => setActive(i)}
                className="group flex w-full items-center gap-4 border-t border-border py-5 text-left transition-colors hover:bg-paper-3 focus-visible:outline-2 focus-visible:outline-accent"
              >
                <span className={`tnum text-xs ${on ? "text-accent" : "text-muted"}`}>{s.n}</span>
                <span className={`text-lg font-medium tracking-tight transition-colors ${on ? "text-foreground" : "text-muted group-hover:text-foreground"}`}>
                  {s.title}
                </span>
                <span className={`ml-auto h-2 w-2 rounded-[2px] transition-all ${on ? "bg-accent scale-100" : "scale-0"}`} />
              </button>
            </li>
          );
        })}
        <li className="border-t border-border" />
      </ul>

      <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface p-8">
        <div className="eyebrow">{step.n} · {step.title}</div>
        <p className="mt-4 max-w-md text-[1.05rem] leading-relaxed text-foreground">{step.body}</p>
        <div className="mt-8 flex items-baseline gap-3">
          <span className="tnum text-4xl font-semibold text-accent">{step.metric}</span>
          <span className="text-sm text-muted">{step.metricLabel}</span>
        </div>
      </div>
    </div>
  );
}
