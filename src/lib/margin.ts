// Dashboard margin math — read-only aggregation over the append-only ledger.
// Revenue (topups) minus real AI cost (debits) per user = the builder's margin.

import { sql } from "drizzle-orm";
import { db } from "@/db";
import type { MarginRow } from "@/lib/contracts";

type MarginRowRaw = {
  user_id: string;
  email: string;
  revenue_usd: string | number | null;
  cost_usd: string | number | null;
  margin_usd: string | number | null;
  generations: string | number | null;
};

function toNumber(value: string | number | null): number {
  return value == null ? 0 : Number(value);
}

/**
 * One row per user: total revenue collected, total real AI cost, the resulting
 * margin, and the number of billed generations (debit ledger entries).
 * Ordered by most profitable user first.
 */
export async function getMarginRows(): Promise<MarginRow[]> {
  const result = await db.execute(sql`
    SELECT
      u.id AS user_id,
      u.email AS email,
      -- Revenue is RECOGNIZED on usage, not on top-up (a top-up is deferred
      -- revenue / a liability). So only debit rows contribute revenue.
      COALESCE(SUM(l.revenue_usd) FILTER (WHERE l.type = 'debit'), 0) AS revenue_usd,
      COALESCE(SUM(l.real_cost_usd), 0) AS cost_usd,
      COALESCE(SUM(l.revenue_usd) FILTER (WHERE l.type = 'debit') - SUM(l.real_cost_usd), 0) AS margin_usd,
      COUNT(*) FILTER (WHERE l.type = 'debit') AS generations
    FROM users u
    LEFT JOIN ledger l ON l.user_id = u.id
    GROUP BY u.id, u.email
    HAVING COUNT(l.id) > 0
    ORDER BY margin_usd DESC
  `);

  const rows = (result as unknown as { rows: MarginRowRaw[] }).rows ?? [];

  return rows.map((row) => ({
    userId: row.user_id,
    email: row.email,
    revenueUsd: toNumber(row.revenue_usd),
    costUsd: toNumber(row.cost_usd),
    marginUsd: toNumber(row.margin_usd),
    generations: toNumber(row.generations),
  }));
}

export type MarginTotals = {
  revenueUsd: number;
  costUsd: number;
  marginUsd: number;
  marginPct: number;
  users: number;
  generations: number;
};

/**
 * Headline figures across every user: total revenue, cost, margin, margin %,
 * active user count, and total generations.
 */
export async function getTotals(): Promise<MarginTotals> {
  const rows = await getMarginRows();

  const totals = rows.reduce(
    (acc, row) => ({
      revenueUsd: acc.revenueUsd + row.revenueUsd,
      costUsd: acc.costUsd + row.costUsd,
      marginUsd: acc.marginUsd + row.marginUsd,
      generations: acc.generations + row.generations,
    }),
    { revenueUsd: 0, costUsd: 0, marginUsd: 0, generations: 0 },
  );

  const marginPct =
    totals.revenueUsd > 0 ? (totals.marginUsd / totals.revenueUsd) * 100 : 0;

  return {
    ...totals,
    marginPct,
    users: rows.length,
  };
}
