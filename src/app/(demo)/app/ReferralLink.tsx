"use client";

import { useState } from "react";

const COPIED_RESET_MS = 2000;

export default function ReferralLink({ link }: { link: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), COPIED_RESET_MS);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
      <label htmlFor="referral-link" className="sr-only">
        Your referral link
      </label>
      <input
        id="referral-link"
        type="text"
        readOnly
        value={link}
        onFocus={(e) => e.currentTarget.select()}
        className="tnum w-full flex-1 truncate border border-border bg-background px-3 py-2 text-sm text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      />
      <button
        type="button"
        onClick={copy}
        className="shrink-0 border border-foreground bg-foreground px-4 py-2 text-sm font-semibold text-background transition-colors hover:border-accent hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
      >
        {copied ? "Copied ✓" : "Copy"}
      </button>
    </div>
  );
}
