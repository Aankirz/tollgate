import Link from "next/link";
import { Wordmark } from "@/components/visuals/Wordmark";
import { CountUp } from "@/components/visuals/CountUp";
import { getMarginRows, getTotals } from "@/lib/margin";

export const dynamic = "force-dynamic";

// Money formatter: cents for normal amounts, 4 decimals for sub-$0.10 AI costs
// so tiny per-generation costs (e.g. $0.0001) stay legible.
function usd(value: number): string {
  const safe = value === 0 ? 0 : value; // normalize -0
  const abs = Math.abs(safe);
  const decimals = abs > 0 && abs < 0.1 ? 4 : 2;
  return safe.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

// Decimal places the headline CountUp should animate to — matches usd().
function moneyDecimals(value: number): number {
  const abs = Math.abs(value);
  return abs > 0 && abs < 0.1 ? 4 : 2;
}

function signedClass(value: number): string {
  return value >= 0 ? "text-positive" : "text-negative";
}

export default async function DashboardPage() {
  const [rows, totals] = await Promise.all([getMarginRows(), getTotals()]);
  const hasData = rows.length > 0;

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto w-full max-w-5xl px-6 py-12 sm:py-16">
        <Header />
        {hasData ? (
          <>
            <Statement totals={totals} />
            <Ledger rows={rows} totals={totals} />
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="flex items-baseline justify-between border-b border-border pb-5">
      <div className="flex items-baseline gap-3">
        <Wordmark />
        <span className="h-3.5 w-px bg-border" aria-hidden />
        <span className="eyebrow">Builder dashboard</span>
      </div>
      <span className="eyebrow hidden sm:inline">Margin statement</span>
    </header>
  );
}

interface StatementProps {
  totals: Awaited<ReturnType<typeof getTotals>>;
}

// The headline: total margin printed as a large serif figure, with revenue and
// brick-red AI cost ruled alongside it — like the summary line of a statement.
function Statement({ totals }: StatementProps) {
  return (
    <section
      aria-label="Headline metrics"
      className="grid gap-x-12 gap-y-10 py-14 md:grid-cols-[1.3fr_0.7fr] md:items-end"
    >
      <div>
        <span className="eyebrow">Net margin on AI usage</span>
        <CountUp
          to={totals.marginUsd}
          prefix="$"
          decimals={moneyDecimals(totals.marginUsd)}
          className={`display mt-4 block text-[clamp(3.5rem,2rem+8vw,7rem)] ${signedClass(
            totals.marginUsd,
          )}`}
        />
        <p className="mt-5 max-w-md leading-relaxed text-muted">
          Revenue recognized on usage, minus the real AI cost, across{" "}
          <span className="text-foreground">
            {totals.users} {totals.users === 1 ? "user" : "users"}
          </span>{" "}
          and{" "}
          <span className="text-foreground tnum">
            {totals.generations.toLocaleString("en-US")}
          </span>{" "}
          generations.
        </p>
      </div>

      <dl className="flex flex-col">
        <SummaryRow label="Revenue collected" value={usd(totals.revenueUsd)} />
        <SummaryRow
          label="Real AI cost"
          value={usd(-totals.costUsd)}
          tone="negative"
        />
        <SummaryRow
          label="Margin"
          value={`${totals.marginPct.toFixed(1)}%`}
          tone={totals.marginUsd >= 0 ? "positive" : "negative"}
          strong
        />
      </dl>
    </section>
  );
}

interface SummaryRowProps {
  label: string;
  value: string;
  tone?: "neutral" | "positive" | "negative";
  strong?: boolean;
}

function SummaryRow({ label, value, tone = "neutral", strong }: SummaryRowProps) {
  const valueClass =
    tone === "positive"
      ? "text-positive"
      : tone === "negative"
        ? "text-negative"
        : "text-foreground";
  return (
    <div
      className={`flex items-baseline justify-between gap-6 border-t border-border py-3.5 ${
        strong ? "border-foreground" : ""
      }`}
    >
      <dt className="eyebrow">{label}</dt>
      <dd
        className={`tnum ${strong ? "text-xl font-semibold" : "text-lg"} ${valueClass}`}
      >
        {value}
      </dd>
    </div>
  );
}

interface LedgerProps {
  rows: Awaited<ReturnType<typeof getMarginRows>>;
  totals: Awaited<ReturnType<typeof getTotals>>;
}

// A clean, hairline-ruled ledger — one printed line per user.
function Ledger({ rows, totals }: LedgerProps) {
  return (
    <section aria-label="Per-user margin" className="pb-12">
      <div className="flex items-baseline justify-between border-b border-foreground pb-3">
        <h2 className="display text-2xl">Per-user ledger</h2>
        <span className="eyebrow">{rows.length} entries</span>
      </div>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border">
            <Th className="text-left">User</Th>
            <Th className="text-right">Generations</Th>
            <Th className="text-right">Revenue</Th>
            <Th className="text-right">AI cost</Th>
            <Th className="text-right">Margin</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.userId}
              className="border-b border-border/70 transition-colors hover:bg-paper-3/60"
            >
              <td className="py-4 pr-4 align-baseline text-foreground">
                {row.email}
              </td>
              <td className="tnum py-4 pl-4 text-right align-baseline text-muted">
                {row.generations.toLocaleString("en-US")}
              </td>
              <td className="tnum py-4 pl-4 text-right align-baseline text-foreground">
                {usd(row.revenueUsd)}
              </td>
              <td className="tnum py-4 pl-4 text-right align-baseline text-negative">
                {usd(-row.costUsd)}
              </td>
              <td
                className={`tnum py-4 pl-4 text-right align-baseline font-semibold ${signedClass(
                  row.marginUsd,
                )}`}
              >
                {usd(row.marginUsd)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-foreground">
            <td className="eyebrow py-4 pr-4 align-baseline">Total</td>
            <td className="tnum py-4 pl-4 text-right align-baseline text-muted">
              {totals.generations.toLocaleString("en-US")}
            </td>
            <td className="tnum py-4 pl-4 text-right align-baseline text-foreground">
              {usd(totals.revenueUsd)}
            </td>
            <td className="tnum py-4 pl-4 text-right align-baseline text-negative">
              {usd(-totals.costUsd)}
            </td>
            <td
              className={`tnum py-4 pl-4 text-right align-baseline font-semibold ${signedClass(
                totals.marginUsd,
              )}`}
            >
              {usd(totals.marginUsd)}
            </td>
          </tr>
        </tfoot>
      </table>
    </section>
  );
}

function Th({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th className={`eyebrow py-3 font-normal ${className}`}>{children}</th>
  );
}

function EmptyState() {
  return (
    <div className="border-t border-border py-24 text-center">
      <span className="eyebrow">Nothing on the ledger yet</span>
      <h2 className="display mx-auto mt-4 max-w-md text-[clamp(2rem,1.4rem+3vw,3.2rem)]">
        No usage to <em className="text-accent">account</em> for.
      </h2>
      <p className="mx-auto mt-5 max-w-sm leading-relaxed text-muted">
        Run a few generations in the demo and your revenue, real AI cost, and
        margin per user will print here — straight off the append-only ledger.
      </p>
      <Link
        href="/app"
        className="group mt-9 inline-flex items-center gap-2 bg-accent px-5 py-3 text-sm text-accent-foreground transition-colors hover:bg-accent-strong"
      >
        Open the demo app
        <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
          →
        </span>
      </Link>
    </div>
  );
}
