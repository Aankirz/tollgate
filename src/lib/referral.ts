import { eq } from "drizzle-orm";
import { db, users, referrals } from "@/db";
import { topup } from "@/lib/wallet";
import { CREDITS } from "@/lib/pricing";
import type { ReferralApi } from "@/lib/contracts";

// Postgres unique_violation — a concurrent apply already recorded this referral.
const UNIQUE_VIOLATION = "23505";

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === UNIQUE_VIOLATION
  );
}

// Records a referral + grants credits to both sides exactly once.
// Safe to call on every sign-in; the referrals.referredUserId unique
// constraint plus topup idempotency keys make repeats a no-op.
export const applyReferral: ReferralApi["applyReferral"] = async ({
  referrerUserId,
  referredUserId,
}) => {
  if (referrerUserId === referredUserId) return;

  const existing = await db
    .select({ id: referrals.id })
    .from(referrals)
    .where(eq(referrals.referredUserId, referredUserId));
  if (existing.length > 0) return;

  const referrer = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.id, referrerUserId));
  if (referrer.length === 0) return;

  const grant = CREDITS.REFERRAL_GRANT;

  try {
    await db.insert(referrals).values({
      referrerUserId,
      referredUserId,
      creditsGranted: grant,
    });
  } catch (error: unknown) {
    // Lost a race: another sign-in inserted first. Credits handled there.
    if (isUniqueViolation(error)) return;
    throw error;
  }

  // ponytail: not in one transaction with the insert above — topup is already
  // idempotent, so a crash mid-grant self-heals on the next applyReferral call.
  await db.update(users).set({ referredBy: referrerUserId }).where(eq(users.id, referredUserId));

  await topup({
    userId: referrerUserId,
    credits: grant,
    revenueUsd: 0,
    type: "referral_grant",
    idempotencyKey: `referral:${referredUserId}:referrer`,
  });
  await topup({
    userId: referredUserId,
    credits: grant,
    revenueUsd: 0,
    type: "referral_grant",
    idempotencyKey: `referral:${referredUserId}:referred`,
  });
};
