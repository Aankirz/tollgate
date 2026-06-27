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
    <section>
      <header className="flex items-baseline justify-between">
        <div>
          <span className="eyebrow">Metered by Tollgate</span>
          <h2 className="display mt-3 text-3xl">Generate.</h2>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="mt-5">
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
          className="w-full resize-y border border-border bg-surface px-4 py-3 text-sm leading-relaxed text-foreground placeholder:text-muted transition-colors focus:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-60"
        />

        <div className="mt-4 flex items-center justify-between gap-4">
          <p className="max-w-xs text-xs leading-relaxed text-muted">
            Each generation debits credits at the real AI cost.
          </p>
          <button
            type="submit"
            disabled={!canSubmit}
            className="group inline-flex items-center gap-2 bg-accent px-5 py-2.5 text-sm text-accent-foreground transition-colors hover:bg-accent-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Generating…" : "Generate"}
            <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
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
      <div className="mt-6 border border-border bg-surface">
        <div className="border-b border-dashed border-border px-5 py-4">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">{text}</p>
        </div>
        <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1 px-5 py-3 font-mono text-xs text-muted">
          <span>
            charged{" "}
            <span className="tnum font-medium text-foreground">{creditsCharged}</span> credits
          </span>
          <span aria-hidden className="text-border">·</span>
          <span title="real AI cost">
            real AI cost{" "}
            <span className="tnum font-medium text-negative">
              ${costUsd.toFixed(COST_USD_FRACTION_DIGITS)}
            </span>
          </span>
          <span aria-hidden className="text-border">·</span>
          <span>
            new balance{" "}
            <span className="tnum font-medium text-positive">{newBalance}</span>
          </span>
        </p>
      </div>
    );
  }

  if (result.error === "insufficient") {
    return (
      <div className="mt-6 border border-negative/40 bg-surface p-5">
        <span className="eyebrow" style={{ color: "var(--color-negative)" }}>
          Out of credits
        </span>
        <p className="mt-2 font-mono text-sm text-muted">
          Balance:{" "}
          <span className="tnum font-medium text-negative">{result.balance}</span>. Top up to
          keep generating.
        </p>
        <a
          href="#buy-credits"
          className="group mt-4 inline-flex items-center gap-2 border border-foreground bg-foreground px-4 py-2 text-sm text-background transition-colors hover:border-accent hover:bg-accent"
        >
          Buy credits
          <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
        </a>
      </div>
    );
  }

  const message =
    result.error === "empty" ? "Enter a prompt first." : "Something went wrong. Try again.";
  return (
    <div className="mt-6 border border-border bg-surface p-5">
      <p className="font-mono text-sm text-muted">{message}</p>
    </div>
  );
}
