import Link from "next/link";
import { Wordmark } from "@/components/visuals/Wordmark";
import { Receipt } from "@/components/visuals/Receipt";
import { Reveal } from "@/components/visuals/Reveal";
import { CountUp } from "@/components/visuals/CountUp";
import { CREDITS, CREDIT_PACKS, revenuePerGenerationUsd } from "@/lib/pricing";

const pays = revenuePerGenerationUsd();
const pack = CREDIT_PACKS[0];

const ACTS = [
  { n: "I", title: "Someone signs up.",
    body: "Their wallet opens the moment they arrive — no card, no setup. A signup bonus lands so they can feel the product before they ever pay.",
    stat: `+${CREDITS.SIGNUP_BONUS}`, statLabel: "signup credits" },
  { n: "II", title: "They generate.",
    body: "Every call is metered: balance gated first, model run, the real token cost computed, then credits debited — in one transaction on an append-only ledger.",
    stat: `-${CREDITS.COST_PER_GENERATION} cr`, statLabel: "real cost logged" },
  { n: "III", title: "They run low, they top up.",
    body: `Credits run down, so they buy a pack through Stripe — $${pack.priceUsd} for ${pack.credits}. You set the price, you keep the markup. Revenue is recognized as it's used, not when it's paid.`,
    stat: `+$${pack.priceUsd}.00`, statLabel: "to the wallet" },
  { n: "IV", title: "They bring a friend.",
    body: "One shared link. When the friend joins, both sides get credits — exactly once, idempotent. The output was the ad, and the app starts compounding.",
    stat: `+${CREDITS.REFERRAL_GRANT} ×2`, statLabel: "both sides" },
];

const TICKER = ["append-only ledger", "real token cost", "atomic debit", "stripe top-ups", "referral credits", "margin per user", "no double-spend"];

export default function Landing() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      {/* NAV — editorial */}
      <header className="border-b border-border">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <Wordmark />
          <div className="hidden items-center gap-7 font-mono text-xs uppercase tracking-widest text-muted md:flex">
            <a href="#story" className="transition-colors hover:text-foreground">Story</a>
            <Link href="/app" className="transition-colors hover:text-foreground">Demo</Link>
            <Link href="/dashboard" className="transition-colors hover:text-foreground">Dashboard</Link>
            <Link href="/signin" className="transition-colors hover:text-foreground">Sign in</Link>
          </div>
          <Link href="/signin"
            className="group inline-flex items-center gap-2 border border-foreground bg-foreground px-4 py-2 text-sm text-background transition-colors hover:bg-accent hover:border-accent">
            Start building
            <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </nav>
      </header>

      {/* HERO */}
      <section className="mx-auto grid max-w-5xl items-center gap-12 px-6 py-20 md:grid-cols-[1.1fr_0.9fr] md:py-28">
        <div>
          <span className="eyebrow">The money layer for AI apps</span>
          <h1 className="display mt-5 text-[clamp(3rem,1.6rem+6vw,6rem)]" style={{ overflowWrap: "anywhere" }}>
            Charge in credits.<br />Keep the <em className="text-accent">margin</em>.
          </h1>
          <p className="mt-7 max-w-md text-lg leading-relaxed text-muted">
            A drop-in wallet and per-call meter for AI apps. Debit the real LLM cost
            on every generation, and finally see what each user actually earns you,
            not just what they spend.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-5">
            <Link href="/signin"
              className="group inline-flex items-center gap-2 bg-accent px-5 py-3 text-sm text-accent-foreground transition-colors hover:bg-accent-strong">
              Try the live demo
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
            <Link href="/dashboard" className="border-b border-foreground/40 pb-0.5 text-sm transition-colors hover:border-accent hover:text-accent">
              See the margin dashboard
            </Link>
          </div>
          <code className="mt-7 block font-mono text-sm text-muted">
            <span className="text-accent">$</span> npm i tollgate
          </code>
        </div>
        <div className="md:pl-6">
          <Receipt />
        </div>
      </section>

      {/* TICKER */}
      <div className="overflow-hidden border-y border-border bg-paper-3/60 py-3">
        <div className="flex w-max gap-8 whitespace-nowrap" style={{ animation: "ticker 26s linear infinite" }}>
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i} className="eyebrow flex items-center gap-8">{t}<span className="text-accent">✦</span></span>
          ))}
        </div>
      </div>

      {/* USER STORY */}
      <section id="story" className="mx-auto max-w-5xl px-6 py-24">
        <Reveal>
          <span className="eyebrow">A user story</span>
          <h2 className="display mt-4 max-w-2xl text-[clamp(2rem,1.2rem+3vw,3.4rem)]">
            A day in the life of an AI app.
          </h2>
        </Reveal>

        <div className="mt-16 flex flex-col">
          {ACTS.map((a, i) => (
            <Reveal key={a.n} delay={i * 80}>
              <article className="grid gap-6 border-t border-border py-12 md:grid-cols-[auto_1fr_auto] md:items-baseline md:gap-12">
                <div className="display text-6xl text-accent md:text-7xl">{a.n}</div>
                <div>
                  <h3 className="display text-2xl md:text-3xl">{a.title}</h3>
                  <p className="mt-3 max-w-md leading-relaxed text-muted">{a.body}</p>
                </div>
                <div className="md:text-right">
                  <div className="tnum text-3xl font-semibold text-foreground">{a.stat}</div>
                  <div className="eyebrow mt-1">{a.statLabel}</div>
                </div>
              </article>
            </Reveal>
          ))}
          <div className="border-t border-border" />
        </div>
      </section>

      {/* MARGIN TEASER */}
      <section className="border-y border-border bg-paper-3/40">
        <div className="mx-auto grid max-w-5xl items-center gap-12 px-6 py-24 md:grid-cols-[1.2fr_0.8fr]">
          <Reveal>
            <span className="eyebrow">The number nobody else shows you</span>
            <h2 className="display mt-4 text-[clamp(2.2rem,1.2rem+3.4vw,4rem)]">
              Margin. <em className="text-positive">Per user.</em> In real time.
            </h2>
            <p className="mt-5 max-w-md leading-relaxed text-muted">
              Revenue recognized on usage, minus the real AI cost, straight off the
              append-only ledger. The one figure generic auth and billing will never give you.
            </p>
          </Reveal>
          <Reveal delay={120} className="border border-border bg-surface p-10 text-center">
            <div className="eyebrow">net margin on AI usage</div>
            <CountUp to={99.9} suffix="%" decimals={1}
              className="display mt-3 block text-7xl text-positive" />
            <div className="mt-4 flex justify-between font-mono text-xs text-muted">
              <span>pays ${pays.toFixed(2)}</span>
              <span className="text-negative">cost ~$0.0001</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA — inverted ink band */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <Reveal className="bg-panel px-8 py-20 text-center" >
          <h2 className="display mx-auto max-w-2xl text-[clamp(2.2rem,1.2rem+4vw,4.4rem)]"
            style={{ color: "var(--color-panel-foreground)" }}>
            Ship an AI app that makes money on day one.
          </h2>
          <div className="mt-10 flex justify-center">
            <Link href="/signin"
              className="group inline-flex items-center gap-2 bg-accent px-6 py-3 text-sm text-accent-foreground transition-colors hover:bg-accent-strong">
              Start building
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
          </div>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12 md:flex-row md:items-center md:justify-between">
          <Wordmark />
          <p className="max-w-xs text-sm text-muted">The money layer for AI apps. Wallet, metering, and virality in one drop-in.</p>
          <div className="flex gap-6 font-mono text-xs uppercase tracking-widest text-muted">
            <Link href="/app" className="hover:text-foreground">Demo</Link>
            <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
            <Link href="/signin" className="hover:text-foreground">Sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
