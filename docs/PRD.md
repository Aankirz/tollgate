# Tollgate — PRD

**One-liner:** Stripe + Clerk for AI apps — a drop-in layer giving any AI app a credit wallet, per-call usage metering tied to real LLM cost, and referral-driven virality, so it earns revenue and grows on day one.

**Date:** 2026-06-28 · **Owner:** Aankirz · **Status:** MVP build

## 1. Problem
Every AI app pays real money per call (tokens/images/seconds). Generic auth (Clerk, Auth0) tells you *who* a user is but not *how much they cost*. Builders hand-roll Stripe + a credits column + usage tables — 2–3 weeks of brittle plumbing. They cannot see margin per user, and they have no built-in growth loop.

Market signal (Google Trends, US, 12mo): `ai saas` is high and rising; the precise category terms (`monetize ai`, `usage based billing`) have near-zero volume. → Demand is pre-search; discovery comes from AEO + virality, not head SEO. The product must ship its own growth loop.

## 2. Goals (MVP)
- A user can sign in, receive a signup credit bonus, and spend credits on AI generations.
- Each generation debits credits and records the **real AI cost** (token-based).
- A user can top up credits (Stripe **test mode**).
- A referral link grants credits to both sides.
- A builder dashboard shows **revenue, AI cost, and margin per user** — the headline metric.

## 3. Non-goals (YAGNI for MVP)
Teams/orgs · BYO-API-key · watermark-removal loop · multi-model routing · rate-limit tiers · real payouts · production auth (magic-link/OAuth). All deferred until a user asks.

## 4. Users
- **End-user** of the demo AI app: signs in, spends credits, refers friends.
- **Builder** (dashboard viewer): sees aggregate economics and per-user margin.

## 5. Core flows
1. **Sign in** (demo: email-only credentials) → user + wallet + 50-credit signup bonus.
2. **Generate** → `meter()` checks balance → calls Claude (or offline mock) → computes real cost → atomic debit of 10 credits → returns output + new balance.
3. **Top up** → Stripe test checkout → webhook → `wallet.topup()` (idempotent) credits the wallet.
4. **Refer** → share `?ref=<userId>` link → new signup grants 100 credits to each side (idempotent).
5. **Dashboard** → table of users with revenue/cost/margin/generations + totals.

## 6. Success criteria
- Invariant holds: cached `wallets.balance_credits` == `SUM(ledger.credits_delta)` for every user (see `scripts/invariant.sql`).
- No double-credit on Stripe webhook retry or referral re-trigger (idempotency keys).
- Insufficient balance is rejected **before** the model call.
- Dashboard margin = `SUM(revenue_usd) - SUM(real_cost_usd)`, matching the ledger.

## 7. Metrics that matter
Margin per user · activation (first generation) · K-factor (referrals/user) · credits burned per active user.

## 8. Risks
- **Ledger correctness under concurrency/retries** → append-only ledger + row-lock debit + idempotency keys.
- Adoption: builders routing money through a new vendor → MVP is a demo/proof (test mode), not real funds.
- Discovery: thin keyword demand → AEO + virality + long-tail content (out of build scope).
