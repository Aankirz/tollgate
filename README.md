# Tollgate

**Stripe + Clerk for AI apps.** A drop-in layer that gives any AI app a credit wallet, per-call usage metering tied to real LLM cost, and referral-driven virality — so it earns revenue and grows on day one.

> MVP. See [`docs/PRD.md`](docs/PRD.md) and [`docs/superpowers/specs/2026-06-28-tollgate-design.md`](docs/superpowers/specs/2026-06-28-tollgate-design.md).

## What it does
- **Credit wallet** — users hold a balance; spend credits per AI generation.
- **Metering** — each call debits credits and records the *real* token cost.
- **Margin dashboard** — revenue − AI cost = margin, per user. The headline metric.
- **Virality** — referral links grant credits to both sides.
- **Payments** — Stripe (test mode) credit-pack top-ups.

## Stack
Next.js 15 · TypeScript · Neon Postgres + Drizzle · Auth.js · Stripe · Anthropic Claude · Tailwind.

## Run locally
```bash
cp .env.example .env.local   # fill in DATABASE_URL + AUTH_SECRET (ANTHROPIC/STRIPE optional)
psql "$DATABASE_URL" -f migrations/0001_init.sql   # apply schema
pnpm install
pnpm dev
```
Without `ANTHROPIC_API_KEY` the generator runs an offline mock. Without Stripe keys, top-up uses a test stub.

## Correctness
The ledger is append-only; `wallets.balance_credits` is a cached projection. Verify with:
```bash
psql "$DATABASE_URL" -f scripts/invariant.sql   # returns 0 rows when healthy
```
