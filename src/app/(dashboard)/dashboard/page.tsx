import Link from "next/link";
import { getMarginRows, getTotals } from "@/lib/margin";

export const dynamic = "force-dynamic";

// Money formatter: cents for normal amounts, 4 decimals for sub-cent AI costs
// so tiny per-generation costs (e.g. $0.0123) stay legible.
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

function signedClass(value: number): string {
  return value >= 0 ? "text-positive" : "text-negative";
}

export default async function DashboardPage() {
  const [rows, totals] = await Promise.all([getMarginRows(), getTotals()]);
  const hasData = rows.length > 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-10 sm:py-16">
        <Header />

        {hasData ? (
          <>
            <HeroStats totals={totals} />
            <UserTable rows={rows} />
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
    <header className="mb-12 flex items-baseline justify-between border-b border-border pb-6">
      <div className="flex items-baseline gap-3">
        <span className="text-xl font-semibold tracking-tight">Tollgate</span>
        <span className="h-4 w-px bg-border" aria-hidden />
        <span className="text-sm font-medium text-muted">Builder dashboard</span>
      </div>
      <span className="hidden text-xs uppercase tracking-widest text-muted sm:inline">
        Revenue · Cost · Margin
      </span>
    </header>
  );
}

interface HeroStatsProps {
  totals: Awaited<ReturnType<typeof getTotals>>;
}

function HeroStats({ totals }: HeroStatsProps) {
  return (
    <section
      aria-label="Headline metrics"
      className="mb-14 grid grid-cols-1 gap-px overflow-hidden rounded-card border border-border bg-border sm:grid-cols-2 lg:grid-cols-4"
    >
      {/* Margin — the headline. Spans wide, scaled up, electric-on-paper. */}
      <div className="flex flex-col justify-between bg-surface p-7 sm:col-span-2 lg:col-span-2 lg:row-span-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted">
            Total margin
          </span>
          <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
            {totals.marginPct.toFixed(1)}% net
          </span>
        </div>
        <div
          className={`tnum mt-6 text-6xl font-semibold leading-none tracking-tight sm:text-7xl ${signedClass(
            totals.marginUsd,
          )}`}
        >
          {usd(totals.marginUsd)}
        </div>
        <p className="mt-4 text-sm text-muted">
          Across {totals.users} {totals.users === 1 ? "user" : "users"} and{" "}
          {totals.generations.toLocaleString("en-US")} generations.
        </p>
      </div>

      <StatCard label="Revenue" value={usd(totals.revenueUsd)} tone="neutral" />
      <StatCard label="AI cost" value={usd(-totals.costUsd)} tone="negative" />
    </section>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  tone: "neutral" | "negative";
}

function StatCard({ label, value, tone }: StatCardProps) {
  const valueClass = tone === "negative" ? "text-negative" : "text-foreground";
  return (
    <div className="flex flex-col justify-between bg-surface p-7">
      <span className="text-xs font-semibold uppercase tracking-widest text-muted">
        {label}
      </span>
      <div className={`tnum mt-6 text-3xl font-semibold tracking-tight ${valueClass}`}>
        {value}
      </div>
    </div>
  );
}

interface UserTableProps {
  rows: Awaited<ReturnType<typeof getMarginRows>>;
}

function UserTable({ rows }: UserTableProps) {
  return (
    <section aria-label="Per-user margin">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted">
        Per-user breakdown
      </h2>
      <div className="overflow-hidden rounded-card border border-border bg-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wider text-muted">
              <th className="px-6 py-4 text-left font-medium">User</th>
              <th className="px-6 py-4 text-right font-medium">Generations</th>
              <th className="px-6 py-4 text-right font-medium">Revenue</th>
              <th className="px-6 py-4 text-right font-medium">AI cost</th>
              <th className="px-6 py-4 text-right font-medium">Margin</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.userId}
                className="border-b border-border/60 transition-colors last:border-0 hover:bg-background"
              >
                <td className="px-6 py-4 font-medium text-foreground">{row.email}</td>
                <td className="tnum px-6 py-4 text-right text-muted">
                  {row.generations.toLocaleString("en-US")}
                </td>
                <td className="tnum px-6 py-4 text-right text-foreground">
                  {usd(row.revenueUsd)}
                </td>
                <td className="tnum px-6 py-4 text-right text-negative">
                  {usd(-row.costUsd)}
                </td>
                <td
                  className={`tnum px-6 py-4 text-right font-semibold ${signedClass(
                    row.marginUsd,
                  )}`}
                >
                  {usd(row.marginUsd)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-border bg-surface px-6 py-24 text-center">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-2xl text-accent">
        ✦
      </div>
      <h2 className="text-lg font-semibold tracking-tight">No usage yet</h2>
      <p className="mt-2 max-w-sm text-sm text-muted">
        Run a few generations in the demo app and your revenue, AI cost, and
        margin will show up here.
      </p>
      <Link
        href="/app"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
      >
        Open the demo app →
      </Link>
    </div>
  );
}
