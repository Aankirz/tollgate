import Link from "next/link";
import { Wordmark } from "@/components/visuals/Wordmark";
import { DotGrid } from "@/components/visuals/DotGrid";
import { FlowMeter } from "@/components/visuals/FlowMeter";
import { GrainPanel } from "@/components/visuals/GrainPanel";
import { IsometricLedger } from "@/components/visuals/IsometricLedger";
import { CountUp } from "@/components/visuals/CountUp";
import { HowItWorks } from "./(marketing)/HowItWorks";
import { revenuePerGenerationUsd } from "@/lib/pricing";

const perGen = revenuePerGenerationUsd(); // honest: derived from pricing constants

export default function Landing() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      {/* NAV — N1b */}
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/80 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Wordmark />
          <div className="hidden items-center gap-8 text-sm text-muted md:flex">
            <a href="#how" className="transition-colors hover:text-foreground">How it works</a>
            <Link href="/app" className="transition-colors hover:text-foreground">Demo</Link>
            <Link href="/dashboard" className="transition-colors hover:text-foreground">Dashboard</Link>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/signin" className="hidden rounded-[var(--radius)] px-3 py-2 text-sm text-muted transition-colors hover:text-foreground sm:block">Sign in</Link>
            <Link href="/signin"
              className="group inline-flex items-center gap-2 rounded-[var(--radius)] bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-strong">
              Start building
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
          </div>
        </nav>
      </header>

      {/* HERO — Marquee, 2-col over dot grid */}
      <section className="relative overflow-hidden border-b border-border">
        <DotGrid />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-6 py-20 md:grid-cols-[1.05fr_0.95fr] md:py-28">
          <div>
            <span className="eyebrow">The money layer for AI apps</span>
            <h1 className="mt-5 text-[clamp(2.6rem,1.5rem+4vw,4.6rem)] font-semibold leading-[0.98] tracking-tight"
              style={{ overflowWrap: "anywhere" }}>
              Credits in. Tokens out.<br />
              <span className="text-accent">Margin</span> <span className="text-warm-ink">per user.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
              Tollgate is a drop-in credit wallet + per-call usage meter for AI apps.
              Charge in credits, debit the real LLM cost on every call, and finally see
              exactly what each user earns you — not just what they spend.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/signin"
                className="group inline-flex items-center gap-2 rounded-[var(--radius)] bg-accent px-5 py-3 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-strong">
                Try the live demo
                <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
              </Link>
              <Link href="/dashboard"
                className="rounded-[var(--radius)] border border-border bg-surface px-5 py-3 text-sm font-medium transition-colors hover:bg-paper-3">
                See the margin dashboard
              </Link>
            </div>
            <code className="mt-6 inline-flex items-center gap-3 rounded-[var(--radius)] border border-border bg-surface px-4 py-2.5 font-mono text-sm text-muted">
              <span className="text-accent">$</span> npm i tollgate
            </code>
          </div>

          <div className="rounded-[var(--radius-card)] border border-border bg-surface/70 p-6">
            <FlowMeter />
          </div>
        </div>
      </section>

      {/* RECEIPT STRIP — honest math from pricing constants */}
      <section className="border-b border-border bg-paper-3/60">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-6 py-7">
          <span className="eyebrow">Per generation</span>
          <Stat label="user pays" value={`$${perGen.toFixed(2)}`} tone="ink" />
          <Stat label="real AI cost" value="~$0.0001" tone="negative" sign="-" />
          <Stat label="your margin" value={`$${(perGen - 0.0001).toFixed(4)}`} tone="positive" sign="+" />
          <span className="max-w-[14rem] text-xs text-muted">Real per-call cost varies with tokens — Tollgate logs the exact figure.</span>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-12 flex flex-col gap-3">
          <span className="eyebrow">How it works</span>
          <h2 className="max-w-2xl text-[clamp(1.8rem,1rem+2.4vw,2.8rem)] font-semibold tracking-tight">
            Four moves from signup to <span className="text-accent">compounding growth.</span>
          </h2>
        </div>
        <HowItWorks />
      </section>

      {/* FEATURE TRIO */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-3">
          <Feature title="Wallet" body="A credit balance per user, backed by an append-only ledger. Top-ups via Stripe; signup & referral bonuses built in.">
            <MiniIcon kind="wallet" />
          </Feature>
          <Feature title="Metering" body="Wrap any model call. Balance gated before the call, real token cost computed after, debited atomically. No double-spend.">
            <MiniIcon kind="meter" />
          </Feature>
          <GrainPanel className="p-7">
            <div className="eyebrow" style={{ color: "var(--color-panel-foreground)", opacity: 0.7 }}>Virality</div>
            <h3 className="mt-3 text-xl font-semibold">It grows itself</h3>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--color-panel-foreground)", opacity: 0.82 }}>
              Referral links grant credits to both sides — recorded once. The output is the ad.
            </p>
            <div className="mt-2"><IsometricLedger /></div>
          </GrainPanel>
        </div>
      </section>

      {/* MARGIN TEASER */}
      <section className="border-y border-border bg-paper-3/50">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-6 py-20 md:grid-cols-[1fr_auto]">
          <div>
            <span className="eyebrow">The number nobody else shows you</span>
            <h2 className="mt-4 max-w-xl text-[clamp(1.8rem,1rem+2.4vw,2.8rem)] font-semibold tracking-tight">
              Stop guessing. See <span className="text-positive">margin per user</span> in real time.
            </h2>
            <p className="mt-4 max-w-md text-muted">
              Revenue recognized on usage, minus the real AI cost — straight off the ledger.
            </p>
          </div>
          <div className="rounded-[var(--radius-card)] border border-border bg-surface p-8 text-center">
            <div className="eyebrow">net margin</div>
            <CountUp to={99.9} suffix="%" decimals={1}
              className="mt-2 block text-6xl font-semibold text-positive" />
            <div className="mt-2 text-sm text-muted">on metered AI usage</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <GrainPanel className="px-8 py-16 text-center">
          <h2 className="mx-auto max-w-2xl text-[clamp(2rem,1rem+3vw,3.4rem)] font-semibold leading-[1.02] tracking-tight">
            Ship an AI app that makes money on day one.
          </h2>
          <div className="mt-8 flex justify-center">
            <Link href="/signin"
              className="group inline-flex items-center gap-2 rounded-[var(--radius)] bg-warm px-6 py-3 text-sm font-semibold text-warm-ink transition-transform hover:-translate-y-0.5">
              Start building
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
          </div>
        </GrainPanel>
      </section>

      {/* FOOTER — Ft5 statement */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12 md:flex-row md:items-center md:justify-between">
          <Wordmark />
          <p className="max-w-sm text-sm text-muted">The money layer for AI apps — wallet, metering, and virality in one drop-in.</p>
          <div className="flex gap-6 text-sm text-muted">
            <Link href="/app" className="hover:text-foreground">Demo</Link>
            <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
            <Link href="/signin" className="hover:text-foreground">Sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Stat({ label, value, tone, sign = "" }: {
  label: string; value: string; tone: "ink" | "positive" | "negative"; sign?: string;
}) {
  const color = tone === "positive" ? "text-positive" : tone === "negative" ? "text-negative" : "text-foreground";
  return (
    <div className="flex flex-col">
      <span className="eyebrow">{label}</span>
      <span className={`tnum mt-1 text-xl font-semibold ${color}`}>{sign}{value}</span>
    </div>
  );
}

function Feature({ title, body, children }: { title: string; body: string; children: React.ReactNode }) {
  return (
    <div className="group rounded-[var(--radius-card)] border border-border bg-surface p-7 transition-colors hover:border-accent/40">
      <div className="text-accent">{children}</div>
      <h3 className="mt-5 text-xl font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
    </div>
  );
}

function MiniIcon({ kind }: { kind: "wallet" | "meter" }) {
  if (kind === "wallet") {
    return (
      <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden>
        <rect x="4" y="8" width="26" height="18" rx="4" stroke="currentColor" strokeWidth="2" />
        <path d="M4 13h26" stroke="currentColor" strokeWidth="2" />
        <circle cx="24" cy="19.5" r="2.2" fill="var(--color-warm)" />
      </svg>
    );
  }
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden>
      <circle cx="17" cy="18" r="11" stroke="currentColor" strokeWidth="2" />
      <path d="M17 18l6-5" stroke="var(--color-warm-ink)" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M9 22a9 9 0 0116 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
