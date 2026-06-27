import { sql } from "drizzle-orm";
import { eq, desc } from "drizzle-orm";
import { db, wallets, ledger } from "@/db";
import type { LedgerEntry } from "@/db/schema";
import type { WalletApi } from "@/lib/contracts";

export const getBalance: WalletApi["getBalance"] = async (userId) => {
  const row = await db
    .select({ b: wallets.balanceCredits })
    .from(wallets)
    .where(eq(wallets.userId, userId));
  return row[0]?.b ?? 0;
};

// Atomic credit grant. Idempotent when idempotencyKey is supplied:
// a duplicate key is a no-op and returns the current balance.
export const topup: WalletApi["topup"] = async ({
  userId,
  credits,
  revenueUsd,
  type,
  idempotencyKey,
  meta = {},
}) => {
  return db.transaction(async (tx) => {
    if (idempotencyKey) {
      const dupe = await tx
        .select({ id: ledger.id })
        .from(ledger)
        .where(eq(ledger.idempotencyKey, idempotencyKey));
      if (dupe.length > 0) {
        const cur = await tx
          .select({ b: wallets.balanceCredits })
          .from(wallets)
          .where(eq(wallets.userId, userId));
        return { newBalance: cur[0]?.b ?? 0 };
      }
    }

    await tx.insert(ledger).values({
      userId,
      type,
      creditsDelta: credits,
      revenueUsd: revenueUsd.toFixed(6),
      meta,
      idempotencyKey: idempotencyKey ?? null,
    });

    const updated = await tx
      .insert(wallets)
      .values({ userId, balanceCredits: credits })
      .onConflictDoUpdate({
        target: wallets.userId,
        set: {
          balanceCredits: sql`${wallets.balanceCredits} + ${credits}`,
          updatedAt: new Date(),
        },
      })
      .returning({ b: wallets.balanceCredits });

    return { newBalance: updated[0].b };
  });
};

export const getLedger: WalletApi["getLedger"] = async (userId): Promise<LedgerEntry[]> => {
  return db
    .select()
    .from(ledger)
    .where(eq(ledger.userId, userId))
    .orderBy(desc(ledger.createdAt));
};
