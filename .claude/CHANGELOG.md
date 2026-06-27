
## 2026-06-28 — Add referral module
- Created src/lib/referral.ts implementing ReferralApi.applyReferral: idempotent referral recording + dual-sided credit grants via wallet.topup.

## 2026-06-28 — Auth module (Auth.js v5)
- Added src/auth.ts (Credentials demo provider, JWT session, referral on signup), api/auth/[...nextauth]/route.ts, src/lib/session.ts (getSessionUser contract), (auth)/actions.ts, (auth)/signin/page.tsx, components/SignOutButton.tsx, types/next-auth.d.ts.

## 2026-06-28 — Foundation, integration & QA
- Foundation: schema (users/wallets/ledger/referrals on Neon), pricing, wallet (atomic/idempotent topup), meter (gate→generate→atomic debit with FOR UPDATE), users, contracts, design tokens, PRD + spec.
- Built in parallel: stripe (test mode + no-key stub), margin dashboard, demo app + landing.
- Typecheck clean; public repo pushed: https://github.com/Aankirz/tollgate
- QA via Chrome component-by-component: landing, sign-in, signup bonus (+50), generate (−10 + real AI cost $0.000126), top-up (+500), dashboard, referral (+100 both sides).
- **Bug found & fixed in QA:** margin dashboard double-counted revenue (cash top-up + imputed per-generation → $5.10). Revenue now recognized on usage only (top-up = deferred); corrected to $0.10. Verified invariant: cached balance == SUM(ledger.credits_delta), 0 violations; referral recorded exactly once.
