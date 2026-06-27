-- Money-correctness check: cached wallet balance MUST equal the append-only
-- ledger sum for every user. Any row returned = a bug in the debit/topup path.
-- Run during QA: psql "$DATABASE_URL" -f scripts/invariant.sql
SELECT
  w.user_id,
  w.balance_credits AS cached,
  COALESCE(SUM(l.credits_delta), 0) AS computed
FROM wallets w
LEFT JOIN ledger l ON l.user_id = w.user_id
GROUP BY w.user_id, w.balance_credits
HAVING w.balance_credits <> COALESCE(SUM(l.credits_delta), 0);
