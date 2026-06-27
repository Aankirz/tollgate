import Anthropic from "@anthropic-ai/sdk";
import { sql } from "drizzle-orm";
import { db, ledger } from "@/db";
import { CREDITS, MODEL_PRICE, aiCostUsd, revenuePerGenerationUsd } from "@/lib/pricing";
import { InsufficientCreditsError } from "@/lib/contracts";
import type { MeterApi, MeterResult } from "@/lib/contracts";

const apiKey = process.env.ANTHROPIC_API_KEY;
const client = apiKey ? new Anthropic({ apiKey }) : null;

type Generation = { text: string; inputTokens: number; outputTokens: number };

async function generate(prompt: string): Promise<Generation> {
  if (!client) {
    // ponytail: offline mock so the demo runs without an API key.
    const text = `✨ (mock) Tollgate generated a response for: "${prompt.slice(0, 80)}"`;
    return {
      text,
      inputTokens: Math.ceil(prompt.length / 4),
      outputTokens: Math.ceil(text.length / 4),
    };
  }
  const res = await client.messages.create({
    model: MODEL_PRICE.model,
    max_tokens: 300,
    messages: [{ role: "user", content: prompt }],
  });
  const text = res.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");
  return {
    text,
    inputTokens: res.usage.input_tokens,
    outputTokens: res.usage.output_tokens,
  };
}

// The core wrapper: gate on balance -> run model -> compute real cost -> atomic debit.
export const meter: MeterApi["meter"] = async ({ userId, prompt }): Promise<MeterResult> => {
  const cost = CREDITS.COST_PER_GENERATION;

  // Cheap pre-check before spending money on the model call.
  const pre = await db.execute(
    sql`SELECT balance_credits FROM wallets WHERE user_id = ${userId}`,
  );
  const preBalance = Number((pre.rows[0] as { balance_credits: number })?.balance_credits ?? 0);
  if (preBalance < cost) throw new InsufficientCreditsError(preBalance, cost);

  const gen = await generate(prompt);
  const costUsd = aiCostUsd(gen.inputTokens, gen.outputTokens);

  // Atomic debit. Lock the wallet row and re-check to defeat concurrent spends.
  const newBalance = await db.transaction(async (tx) => {
    const locked = await tx.execute(
      sql`SELECT balance_credits FROM wallets WHERE user_id = ${userId} FOR UPDATE`,
    );
    const bal = Number((locked.rows[0] as { balance_credits: number })?.balance_credits ?? 0);
    if (bal < cost) throw new InsufficientCreditsError(bal, cost);

    await tx.insert(ledger).values({
      userId,
      type: "debit",
      creditsDelta: -cost,
      realCostUsd: costUsd.toFixed(6),
      revenueUsd: revenuePerGenerationUsd().toFixed(6),
      meta: { prompt: prompt.slice(0, 200), model: MODEL_PRICE.model },
    });

    const updated = await tx.execute(
      sql`UPDATE wallets SET balance_credits = balance_credits - ${cost}, updated_at = now()
          WHERE user_id = ${userId} RETURNING balance_credits`,
    );
    return Number((updated.rows[0] as { balance_credits: number }).balance_credits);
  });

  return {
    text: gen.text,
    inputTokens: gen.inputTokens,
    outputTokens: gen.outputTokens,
    costUsd,
    creditsCharged: cost,
    newBalance,
  };
};
