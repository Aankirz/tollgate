import { signInAction } from "@/app/(auth)/actions";

type SignInPageProps = {
  searchParams: Promise<{ ref?: string }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { ref } = await searchParams;

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-6 py-16">
      <section
        aria-labelledby="signin-heading"
        className="w-full max-w-sm"
      >
        {/* Wordmark + tagline — hierarchy, not a centered template hero. */}
        <div className="mb-10">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold tracking-tight text-foreground">
              Tollgate
            </span>
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-accent"
            />
          </div>
          <p className="mt-2 text-sm text-muted">the money layer for AI apps</p>
        </div>

        <div className="rounded-[var(--radius-card)] border border-border bg-surface p-7 shadow-sm">
          <h1
            id="signin-heading"
            className="text-lg font-medium tracking-tight text-foreground"
          >
            Sign in
          </h1>
          <p className="mt-1 text-sm text-muted">
            Enter your email to open your wallet.
          </p>

          <form action={signInAction} className="mt-6 space-y-4">
            {ref ? <input type="hidden" name="ref" value={ref} /> : null}

            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-medium uppercase tracking-wide text-muted"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@company.com"
                className="w-full rounded-[var(--radius-card)] border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted/60 transition-colors focus-visible:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-[var(--radius-card)] bg-accent px-3 py-2.5 text-sm font-semibold text-accent-foreground transition-[transform,opacity] hover:opacity-95 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              Continue
            </button>
          </form>

          {/* ponytail: demo auth — no password, no verification. */}
          <p className="mt-5 text-xs leading-relaxed text-muted">
            Demo sign-in: email only, no password. We&apos;ll create your account
            and wallet on first visit.
          </p>
        </div>

        {ref ? (
          <p className="mt-4 text-center text-xs text-muted">
            Joining via a referral — you both get bonus credits.
          </p>
        ) : null}
      </section>
    </main>
  );
}
