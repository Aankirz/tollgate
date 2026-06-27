"use server";

import { revalidatePath } from "next/cache";
import { getSessionUser } from "@/lib/session";
import { getBalance } from "@/lib/wallet";
import { meter } from "@/lib/meter";
import { InsufficientCreditsError } from "@/lib/contracts";
import type { MeterResult } from "@/lib/contracts";

export type GenerateActionResult =
  | { ok: true; result: MeterResult }
  | { ok: false; error: "insufficient"; balance: number }
  | { ok: false; error: "empty" | "failed" };

export async function generateAction(prompt: string): Promise<GenerateActionResult> {
  const user = await getSessionUser();
  if (!user) throw new Error("Not authenticated");

  const trimmed = prompt.trim();
  if (!trimmed) return { ok: false, error: "empty" };

  try {
    const result = await meter({ userId: user.id, prompt: trimmed });
    // Refresh balance + activity rendered by the server component.
    revalidatePath("/app");
    return { ok: true, result };
  } catch (error: unknown) {
    if (error instanceof InsufficientCreditsError) {
      return { ok: false, error: "insufficient", balance: error.balance };
    }
    throw error;
  }
}
