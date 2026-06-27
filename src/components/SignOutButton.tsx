"use client";

import { signOutAction } from "@/app/(auth)/actions";

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button
        type="submit"
        className="rounded-[var(--radius-card)] border border-border px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground hover:border-foreground/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        Sign out
      </button>
    </form>
  );
}
