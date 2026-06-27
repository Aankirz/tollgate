
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

## 2026-06-28 — Full editorial revamp (Cream Receipt)
- New direction (user-picked): warm cream paper, ink + ONE warm-red accent, Instrument Serif display + Geist Mono, deliberately not the blue AI-tool reflex.
- Added Instrument Serif via next/font; new tokens (cream palette, motion keyframes, .display/.eyebrow/.perf/.reveal).
- New components: Receipt (printed usage-receipt motif), Reveal (scroll-reveal, reduced-motion safe).
- Landing rebuilt as editorial 'user story': serif hero + receipt, ticker, 4-act scrollytelling (a day in the life of an AI app), margin teaser with count-up, inverted ink CTA.

## 2026-06-28 — Editorial restyle of sign-in page
- Restyled src/app/(auth)/signin/page.tsx to the Cream Receipt editorial system (serif .display heading, mono eyebrows, hairline borders, dashed receipt tear line, accent focus ring, ink/accent submit button). Visual layer only; preserved signInAction server action, hidden ref field, and referral hint.

## 2026-06-28 — Fix ReferralLink corners for editorial consistency
- Removed rounded corners from referral link input and copy button to match sharp-cornered Cream Receipt aesthetic used everywhere else. Copy button hover now uses accent color, consistent with other CTAs.

## 2026-06-28 — Restyle builder dashboard to "Cream Receipt" editorial
- Rewrote src/app/(dashboard)/dashboard/page.tsx visual layer only: Wordmark + .eyebrow header, total margin as huge serif .display CountUp in green with revenue/brick AI cost summary rows, hairline-ruled per-user ledger table with .tnum figures + totals footer, editorial empty state linking to /app. getMarginRows/getTotals data and logic unchanged.
