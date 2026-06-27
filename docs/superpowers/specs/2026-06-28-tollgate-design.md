# Tollgate — Design Spec (2026-06-28)

## Architecture
Single Next.js 15 (App Router, TS) app deployed to Vercel. No microservices.
- **DB:** Neon Postgres + Drizzle ORM (runtime). Schema applied via raw SQL (`migrations/0001_init.sql`).
- **Auth:** Auth.js v5, demo email-only Credentials provider, JWT session. (Upgrade path: magic-link/OAuth.)
- **Payments:** Stripe test mode — credit-pack Checkout + signed webhook.
- **AI:** Anthropic Claude Haiku (`claude-haiku-4-5-20251001`); offline mock when no key.
- **UI:** Tailwind v4 + shadcn-style components.

## Data model (4 tables)
`users` · `wallets` (cached balance) · `ledger` (append-only, source of truth) · `referrals`.
Balance is a projection of the ledger. Ledger rows are never updated or deleted.

## Module boundaries (frozen contracts in `src/lib/contracts.ts`)
| Module | Path | Owner | Depends on |
|---|---|---|---|
| pricing | `lib/pricing.ts` | core | — |
| wallet | `lib/wallet.ts` | core | db, pricing |
| meter | `lib/meter.ts` | core (moat) | db, wallet, pricing, anthropic |
| users | `lib/users.ts` | core | db, wallet |
| referral | `lib/referral.ts` | agent | db, wallet, contracts |
| auth | `auth.ts`, `app/(auth)/*` | agent | users |
| stripe | `app/api/stripe/*`, `lib/stripe.ts` | agent | wallet, pricing |
| dashboard | `app/(dashboard)/*` | agent | db (read-only) |
| demo + landing | `app/(demo)/*`, `app/page.tsx` | agent | meter, auth |

## Metering algorithm (the only non-trivial path)
1. Pre-check balance (cheap) → reject if `< COST_PER_GENERATION`.
2. Run model, read `usage.input_tokens` / `output_tokens`.
3. `costUsd = aiCost(tokens)`.
4. Transaction: `SELECT ... FOR UPDATE` wallet → re-check → insert debit ledger row → decrement balance.

Idempotency: `ledger.idempotency_key` unique; topups/webhooks/referrals pass a stable key → duplicates are no-ops.

## Error handling
- `InsufficientCreditsError` → 402 in API, friendly UI prompt to top up.
- Stripe webhook: verify signature; ignore unrecognized events; idempotent credit.
- DB transaction failure → throw, no partial debit (atomicity).

## Testing / QA
- SQL invariant (`scripts/invariant.sql`): balance == ledger sum for all users.
- Component-by-component QA via pixelbrowse against `next dev`: landing → sign-in → generate (balance drops) → insufficient-credits → top-up → referral → dashboard margin.

## Build order
1. Core (done in-house): schema, pricing, wallet, meter, users.
2. Parallel agents on disjoint dirs: referral · auth · stripe · dashboard · demo+landing.
3. Wire `app/layout.tsx` + nav (integration pass).
4. QA.
