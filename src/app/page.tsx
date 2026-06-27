import Link from "next/link";
import { CREDITS, CREDIT_PACKS } from "@/lib/pricing";

const STEPS = [
  {
    n: "01",
    title: "Sign in",
    body: `New builders land ${CREDITS.SIGNUP_BONUS} free credits — no card, no friction.`,
  },
  {
    n: "02",
    title: "Generate",
    body: "Every AI call runs through the meter. Real token cost is captured per call.",
  },
  {
    n: "03",
    title: "Top up",
    body: "Credits run low, the wallet buys more. Stripe handles the money.",
  },
  {
    n: "04",
    title: "Refer",
    body: `Share a link. Both sides get ${CREDITS.REFERRAL_GRANT} credits. Growth compounds.`,
  },
] as const;

const FEATURES = [
  {
    tag: "Wallet",
    title: "A credit balance that just works",
    body: "An append-only ledger is the source of truth. Cached balances stay atomic under concurrent spend. Top-ups are idempotent against Stripe retries.",
  },
  {
    tag: "Metering",
    title: "Charge users, see real cost",
    body: "Wrap any LLM call in meter(). It gates on balance, runs the model, records the real per-token cost, and debits in one transaction.",
  },
  {
    tag: "Virality",
    title: "Referrals wired into the wallet",
    body: "Every user gets a referral link. Credits land for both sides exactly once. Acquisition cost paid in credits, not cash.",
  },
] as const;

export default function LandingPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteNav />

      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <FeatureTrio />
        <ClosingCta />
      </main>

      <SiteFooter />
    </div>
  );
}

function SiteNav() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6"
      >
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid size-6 place-items-center rounded-md bg-accent text-accent-foreground text-xs font-bold">
            T
          </span>
          <span className="text-foreground">Tollgate</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/app"
            className="rounded-[var(--radius-card)] px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            Demo
          </Link>
          <Link
            href="/dashboard"
            className="rounded-[var(--radius-card)] px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            Dashboard
          </Link>
          <Link
            href="/signin"
            className="ml-1 rounded-[var(--radius-card)] bg-foreground px-4 py-1.5 text-sm font-medium text-background transition-colors hover:bg-foreground/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Sign in
          </Link>
        </div>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="border-b border-border">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-20 sm:py-28 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted">
            <span className="size-1.5 rounded-full bg-accent" />
            Stripe + Clerk, but for AI apps
          </span>

          <h1
            id="hero-heading"
            className="mt-6 text-balance text-5xl font-semibold leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl"
          >
            Credits in.
            <br />
            Tokens out.
            <br />
            <span className="text-accent">Margin per user.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Tollgate is a credit wallet and per-call usage meter for AI apps. Charge
            users in credits, debit the real LLM cost on every call, and finally see
            exactly what each user earns you — not just what they spend.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/app"
              className="rounded-[var(--radius-card)] bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Try the live demo
            </Link>
            <Link
              href="/dashboard"
              className="rounded-[var(--radius-card)] border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-foreground/30"
            >
              See the margin dashboard
            </Link>
          </div>
        </div>

        <MarginCard />
      </div>
    </section>
  );
}

// A small editorial "receipt" that makes the value concrete instead of decorative.
function MarginCard() {
  const rows = [
    { label: "User pays (1 credit)", value: "+$0.0100", tone: "text-positive" },
    { label: "Real AI cost", value: "-$0.0021", tone: "text-negative" },
  ] as const;

  return (
    <aside className="relative rounded-[calc(var(--radius-card)+4px)] border border-border bg-surface p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted">
          Per generation
        </span>
        <span className="tnum text-xs text-muted">user_8fa2</span>
      </div>

      <dl className="mt-5 space-y-3">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between">
            <dt className="text-sm text-muted">{r.label}</dt>
            <dd className={`tnum text-sm font-medium ${r.tone}`}>{r.value}</dd>
          </div>
        ))}
        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <dt className="text-sm font-semibold text-foreground">Margin</dt>
          <dd className="tnum text-base font-semibold text-positive">+$0.0079</dd>
        </div>
      </dl>

      <p className="mt-5 text-xs leading-relaxed text-muted">
        Every call is logged to an append-only ledger. Revenue minus real token cost,
        per user, in real time.
      </p>
    </aside>
  );
}

function HowItWorks() {
  return (
    <section aria-labelledby="how-heading" className="border-b border-border">
      <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="how-heading" className="text-2xl font-semibold tracking-tight sm:text-3xl">
            How it works
          </h2>
          <p className="text-sm text-muted">Four moves from signup to compounding growth.</p>
        </div>

        <ol className="mt-10 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <li key={step.n} className="bg-surface p-6">
              <span className="tnum text-sm font-semibold text-accent">{step.n}</span>
              <h3 className="mt-3 text-lg font-semibold tracking-tight">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function FeatureTrio() {
  return (
    <section aria-labelledby="features-heading" className="border-b border-border">
      <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
        <h2 id="features-heading" className="max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">
          The three primitives an AI product actually needs
        </h2>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <article
              key={f.tag}
              className="group rounded-[var(--radius-card)] border border-border bg-surface p-6 transition-colors hover:border-foreground/20"
            >
              <span className="inline-block rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent">
                {f.tag}
              </span>
              <h3 className="mt-4 text-lg font-semibold leading-snug tracking-tight">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ClosingCta() {
  const cheapest = CREDIT_PACKS[0];
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-24">
      <div className="rounded-[calc(var(--radius-card)+4px)] border border-border bg-foreground px-8 py-12 text-background sm:px-12">
        <h2 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
          Ship the AI app. Tollgate handles the money.
        </h2>
        <p className="mt-4 max-w-xl text-base text-background/70">
          Start with {CREDITS.SIGNUP_BONUS} free credits. Top up from $
          {cheapest.priceUsd} for {cheapest.credits.toLocaleString()} credits when
          you&rsquo;re ready.
        </p>
        <Link
          href="/app"
          className="mt-8 inline-block rounded-[var(--radius-card)] bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
        >
          Open the demo app
        </Link>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          <span className="font-semibold text-foreground">Tollgate</span> — the credit
          layer for AI apps.
        </p>
        <p className="tnum">© {new Date().getFullYear()} Tollgate</p>
      </div>
    </footer>
  );
}
