"use client";

import { useState, useTransition } from "react";
import { generateAction, type GenerateActionResult } from "./actions";

const COST_USD_FRACTION_DIGITS = 6;

export default function Generator() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<GenerateActionResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const canSubmit = prompt.trim().length > 0 && !isPending;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    startTransition(async () => {
      const res = await generateAction(prompt);
      setResult(res);
    });
  }

  return (
    <section className="rounded-[var(--radius-card)] border border-border bg-surface p-6">
      <header className="flex items-baseline justify-between">
        <h2 className="text-lg font-semibold tracking-tight">Generate</h2>
        <span className="text-xs text-muted">Metered by Tollgate</span>
      </header>

      <form onSubmit={handleSubmit} className="mt-4">
        <label htmlFor="prompt" className="sr-only">
          Prompt
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          placeholder="Ask the model anything…"
          disabled={isPending}
          className="w-full resize-y rounded-[var(--radius-card)] border border-border bg-background px-4 py-3 text-sm leading-relaxed text-foreground placeholder:text-muted transition-colors focus:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-60"
        />

        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-muted">Each generation debits credits at the real AI cost.</p>
          <button
            type="submit"
            disabled={!canSubmit}
            className="rounded-[var(--radius-card)] bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Generating…" : "Generate"}
          </button>
        </div>
      </form>

      {result && <Output result={result} />}
    </section>
  );
}

function Output({ result }: { result: GenerateActionResult }) {
  if (result.ok) {
    const { text, costUsd, creditsCharged, newBalance } = result.result;
    return (
      <div className="mt-5 rounded-[var(--radius-card)] border border-border bg-background p-4">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">{text}</p>
        <p className="mt-4 border-t border-border pt-3 text-xs text-muted">
          charged <span className="tnum font-medium text-foreground">{creditsCharged}</span>{" "}
          credits ·{" "}
          <span title="real AI cost">
            real AI cost{" "}
            <span className="tnum font-medium text-negative">
              ${costUsd.toFixed(COST_USD_FRACTION_DIGITS)}
            </span>
          </span>{" "}
          · new balance{" "}
          <span className="tnum font-medium text-foreground">{newBalance}</span>
        </p>
      </div>
    );
  }

  if (result.error === "insufficient") {
    return (
      <div className="mt-5 rounded-[var(--radius-card)] border border-negative/30 bg-negative/5 p-4">
        <p className="text-sm font-medium text-foreground">You&rsquo;re out of credits.</p>
        <p className="mt-1 text-sm text-muted">
          Balance: <span className="tnum font-medium text-negative">{result.balance}</span>.
          Top up to keep generating.
        </p>
        <a
          href="#buy-credits"
          className="mt-3 inline-block rounded-[var(--radius-card)] bg-foreground px-4 py-2 text-sm font-semibold text-background transition-colors hover:bg-foreground/85"
        >
          Buy credits
        </a>
      </div>
    );
  }

  const message =
    result.error === "empty" ? "Enter a prompt first." : "Something went wrong. Try again.";
  return (
    <div className="mt-5 rounded-[var(--radius-card)] border border-border bg-background p-4">
      <p className="text-sm text-muted">{message}</p>
    </div>
  );
}
