// Tollgate pricing config — the only place credit economics live.
// ponytail: plain constants. Becomes per-app DB config when multi-tenant.

export const CREDITS = {
  SIGNUP_BONUS: 50,
  REFERRAL_GRANT: 100, // each side (referrer + referred)
  COST_PER_GENERATION: 10, // credits a builder charges the end-user per AI call
} as const;

// What the end-user pays. (Stripe test mode.)
export const CREDIT_PACKS = [
  { id: "pack_starter", credits: 500, priceUsd: 5 },
  { id: "pack_pro", credits: 2000, priceUsd: 18 },
] as const;

export type CreditPack = (typeof CREDIT_PACKS)[number];

// Anthropic Claude Haiku pricing (USD per token) — used to compute REAL AI cost.
// Source of truth for margin math. Update if the model/price changes.
export const MODEL_PRICE = {
  model: "claude-haiku-4-5-20251001",
  inputPerToken: 1.0 / 1_000_000, // $1.00 / Mtok
  outputPerToken: 5.0 / 1_000_000, // $5.00 / Mtok
} as const;

export function aiCostUsd(inputTokens: number, outputTokens: number): number {
  return (
    inputTokens * MODEL_PRICE.inputPerToken +
    outputTokens * MODEL_PRICE.outputPerToken
  );
}

// Revenue attributed to a single generation = price the builder charges,
// derived from the cheapest pack's per-credit price.
export function revenuePerGenerationUsd(): number {
  const pack = CREDIT_PACKS[0];
  return (pack.priceUsd / pack.credits) * CREDITS.COST_PER_GENERATION;
}
