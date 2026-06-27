import {
  pgTable,
  text,
  integer,
  numeric,
  timestamp,
  uuid,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";

// ponytail: 4 tables. Single demo app, so no `apps`/api_key table yet — add when multi-tenant.

export const ledgerType = pgEnum("ledger_type", [
  "signup_bonus",
  "topup",
  "debit",
  "referral_grant",
]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  referredBy: uuid("referred_by"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// Balance is a cached projection of the append-only ledger. Source of truth = ledger.
export const wallets = pgTable("wallets", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  balanceCredits: integer("balance_credits").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// Append-only. Never UPDATE/DELETE rows. creditsDelta is +topup/-debit.
export const ledger = pgTable("ledger", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  type: ledgerType("type").notNull(),
  creditsDelta: integer("credits_delta").notNull(),
  // For debits: real AI cost in USD. For topups: revenue collected in USD.
  realCostUsd: numeric("real_cost_usd", { precision: 12, scale: 6 }).default("0").notNull(),
  revenueUsd: numeric("revenue_usd", { precision: 12, scale: 6 }).default("0").notNull(),
  meta: jsonb("meta").$type<Record<string, unknown>>().default({}).notNull(),
  // Dedupe retries (Stripe webhooks, double-clicks). Null = not idempotent.
  idempotencyKey: text("idempotency_key").unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const referrals = pgTable("referrals", {
  id: uuid("id").defaultRandom().primaryKey(),
  referrerUserId: uuid("referrer_user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  referredUserId: uuid("referred_user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull()
    .unique(),
  creditsGranted: integer("credits_granted").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type Wallet = typeof wallets.$inferSelect;
export type LedgerEntry = typeof ledger.$inferSelect;
export type Referral = typeof referrals.$inferSelect;
