
## 2026-06-28 — Add referral module
- Created src/lib/referral.ts implementing ReferralApi.applyReferral: idempotent referral recording + dual-sided credit grants via wallet.topup.

## 2026-06-28 — Auth module (Auth.js v5)
- Added src/auth.ts (Credentials demo provider, JWT session, referral on signup), api/auth/[...nextauth]/route.ts, src/lib/session.ts (getSessionUser contract), (auth)/actions.ts, (auth)/signin/page.tsx, components/SignOutButton.tsx, types/next-auth.d.ts.
