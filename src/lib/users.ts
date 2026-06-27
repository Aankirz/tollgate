import { eq } from "drizzle-orm";
import { db, users } from "@/db";
import { topup } from "@/lib/wallet";
import { CREDITS } from "@/lib/pricing";
import type { User } from "@/db/schema";

// Demo auth helper: look up a user by email, or create them with a wallet
// + signup bonus. Real product would key off an OAuth/magic-link identity.
export async function getOrCreateUser(
  email: string,
  name?: string,
): Promise<{ user: User; isNew: boolean }> {
  const existing = await db.select().from(users).where(eq(users.email, email));
  if (existing[0]) return { user: existing[0], isNew: false };

  const inserted = await db
    .insert(users)
    .values({ email, name: name ?? null })
    .returning();
  const user = inserted[0];

  await topup({
    userId: user.id,
    credits: CREDITS.SIGNUP_BONUS,
    revenueUsd: 0,
    type: "signup_bonus",
    idempotencyKey: `signup:${user.id}`,
  });

  return { user, isNew: true };
}

export async function getUserById(id: string): Promise<User | null> {
  const rows = await db.select().from(users).where(eq(users.id, id));
  return rows[0] ?? null;
}
