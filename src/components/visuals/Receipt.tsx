// The signature motif: a printed "usage receipt" rendering the real per-generation
// economics. Pure CSS/SVG, monospace, perforated edges. Honest numbers (from pricing).
import { revenuePerGenerationUsd, CREDITS } from "@/lib/pricing";

const REAL_COST = 0.0001; // typical short-generation cost; real value varies, labelled below
const pays = revenuePerGenerationUsd();
const margin = pays - REAL_COST;

function Barcode() {
  const widths = [2, 1, 3, 1, 2, 1, 1, 3, 2, 1, 2, 3, 1, 1, 2, 1, 3, 2, 1, 2, 1, 3, 1, 2];
  let x = 0;
  return (
    <svg viewBox="0 0 80 22" className="mt-3 h-6 w-full" aria-hidden preserveAspectRatio="none">
      {widths.map((w, i) => {
        const el = i % 2 === 0 ? <rect key={i} x={x} y={0} width={w} height={22} fill="var(--color-ink)" /> : null;
        x += w + 0.6;
        return el;
      })}
    </svg>
  );
}

export function Receipt({ className = "", user = "founder@demo" }: { className?: string; user?: string }) {
  return (
    <div className={`relative ${className}`} style={{ rotate: "1.4deg" }}>
      <div className="perf" />
      <div className="border-x border-border px-7 py-6 shadow-[0_30px_70px_-28px_rgba(40,20,10,0.45)]"
        style={{ background: "oklch(99.5% 0.005 85)" }}>
        <div className="text-center">
          <div className="display text-3xl">Tollgate</div>
          <div className="eyebrow mt-1">usage receipt</div>
        </div>
        <Row label="account" value={user} />
        <Row label="date" value="today" />
        <Dashed />
        <Row label="1 generation" value={`${CREDITS.COST_PER_GENERATION} cr`} />
        <Row label="user pays" value={`$${pays.toFixed(2)}`} />
        <Row label="real AI cost" value={`-$${REAL_COST.toFixed(4)}`} tone="negative" />
        <Dashed />
        <Row label="MARGIN" value={`+$${margin.toFixed(4)}`} tone="positive" strong />
        <Row label="margin" value={`${((margin / pays) * 100).toFixed(1)}%`} tone="positive" />
        <Dashed />
        <div className="eyebrow mt-3 text-center">recognized on usage · logged to ledger</div>
        <Barcode />
        <div className="eyebrow mt-1 text-center tracking-[0.3em]">tg-0001</div>
      </div>
      <div className="perf rotate-180" />
    </div>
  );
}

function Row({ label, value, tone, strong }: {
  label: string; value: string; tone?: "positive" | "negative"; strong?: boolean;
}) {
  const color = tone === "positive" ? "text-positive" : tone === "negative" ? "text-negative" : "text-ink-soft";
  return (
    <div className="mt-2 flex items-baseline justify-between gap-4 font-mono text-[0.82rem]">
      <span className={`${strong ? "font-semibold text-foreground" : "text-muted"} tracking-wide`}>{label}</span>
      <span className={`tnum ${strong ? "text-base font-semibold" : ""} ${color}`}>{value}</span>
    </div>
  );
}

function Dashed() {
  return <div className="my-3 border-t border-dashed border-border" />;
}
