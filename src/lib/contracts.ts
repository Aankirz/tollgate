// FROZEN INTERFACE CONTRACTS — parallel agents implement these exactly.
// Do not change signatures without updating every consumer.

import type { LedgerEntry } from "@/db/schema";

export type MeterResult = {
  text: string;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
  creditsCharged: number;
  newBalance: number;
};

export class InsufficientCreditsError extends Error {
  constructor(public balance: number, public required: number) {
    super(`Insufficient credits: have ${balance}, need ${required}`);
    this.name = "InsufficientCreditsError";
  }
}

// --- lib/wallet (Agent owns src/lib/wallet.ts) ---
export interface WalletApi {
  getBalance(userId: string): Promise<number>;
  // Atomic: append ledger row + bump cached balance in ONE transaction.
  topup(args: {
    userId: string;
    credits: number;
    revenueUsd: number;
    type: "topup" | "signup_bonus" | "referral_grant";
    idempotencyKey?: string;
    meta?: Record<string, unknown>;
  }): Promise<{ newBalance: number }>;
  getLedger(userId: string): Promise<LedgerEntry[]>;
}

// --- lib/meter (built in-house: the moat) ---
export interface MeterApi {
  // Check balance -> run model -> compute real cost -> atomic debit. Throws InsufficientCreditsError.
  meter(args: { userId: string; prompt: string }): Promise<MeterResult>;
}

// --- lib/referral (Agent owns src/lib/referral.ts) ---
export interface ReferralApi {
  // Idempotent: records referral + grants credits to both sides exactly once.
  applyReferral(args: { referrerUserId: string; referredUserId: string }): Promise<void>;
}

// --- dashboard margin math (Agent owns dashboard) ---
export type MarginRow = {
  userId: string;
  email: string;
  revenueUsd: number;
  costUsd: number;
  marginUsd: number;
  generations: number;
};
