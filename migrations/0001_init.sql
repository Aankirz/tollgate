-- Tollgate initial schema. Apply with: psql "$DATABASE_URL" -f migrations/0001_init.sql
-- (or via the Neon console). Ledger is append-only; balance is a cached projection.

CREATE TYPE ledger_type AS ENUM ('signup_bonus', 'topup', 'debit', 'referral_grant');

CREATE TABLE IF NOT EXISTS users (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email       text NOT NULL UNIQUE,
  name        text,
  referred_by uuid,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS wallets (
  user_id         uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  balance_credits integer NOT NULL DEFAULT 0,
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ledger (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type            ledger_type NOT NULL,
  credits_delta   integer NOT NULL,
  real_cost_usd   numeric(12,6) NOT NULL DEFAULT 0,
  revenue_usd     numeric(12,6) NOT NULL DEFAULT 0,
  meta            jsonb NOT NULL DEFAULT '{}',
  idempotency_key text UNIQUE,
  created_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ledger_user_idx ON ledger(user_id);

CREATE TABLE IF NOT EXISTS referrals (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_user_id  uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referred_user_id  uuid NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  credits_granted   integer NOT NULL,
  created_at        timestamptz NOT NULL DEFAULT now()
);
