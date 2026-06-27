import Link from "next/link";
import { signInAction } from "@/app/(auth)/actions";
import { Wordmark } from "@/components/visuals/Wordmark";

type SignInPageProps = {
  searchParams: Promise<{ ref?: string }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { ref } = await searchParams;

  return (
    <main className="flex min-h-dvh flex-col bg-background text-foreground">
      {/* Top hairline bar — editorial, not a centered hero. */}
      <header className="border-b border-border">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
          <Link href="/" className="transition-opacity hover:opacity-80">
            <Wordmark />
          </Link>
          <Link
            href="/"
            className="eyebrow transition-colors hover:text-foreground"
          >
            ← Back home
          </Link>
        </div>
      </header>

      <div className="flex flex-1 items-center justify-center px-6 py-16">
        <section aria-labelledby="signin-heading" className="w-full max-w-md">
          <span className="eyebrow">Wallet access · no password</span>
          <h1
            id="signin-heading"
            className="display mt-5 text-[clamp(2.6rem,1.6rem+4vw,3.8rem)]"
          >
            Open your <em className="text-accent">wallet.</em>
          </h1>
          <p className="mt-5 max-w-sm leading-relaxed text-muted">
            One email is all it takes. We open your account and credit your
            wallet on first visit — feel the product before you ever pay.
          </p>

          {/* The "receipt" — hairline border, mono labels, dashed tear line. */}
          <form
            action={signInAction}
            className="mt-10 border border-border bg-surface p-7"
          >
            {ref ? <input type="hidden" name="ref" value={ref} /> : null}

            <div className="space-y-2">
              <label htmlFor="email" className="eyebrow block">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@company.com"
                className="tnum w-full border border-border bg-background px-3.5 py-3 text-sm text-foreground transition-colors placeholder:text-muted/60 focus-visible:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
              />
            </div>

            <button
              type="submit"
              className="group mt-5 inline-flex w-full items-center justify-center gap-2 border border-foreground bg-foreground px-4 py-3 text-sm font-medium text-background transition-colors hover:border-accent hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              Continue
              <span
                aria-hidden
                className="transition-transform group-hover:translate-x-0.5"
              >
                →
              </span>
            </button>

            {/* Dashed tear line — the receipt motif. */}
            <div
              aria-hidden
              className="mt-7 border-t border-dashed border-border"
            />

            <dl className="mt-5 space-y-2.5 text-xs leading-relaxed text-muted">
              <div className="flex items-baseline justify-between gap-4">
                <dt className="eyebrow">Auth</dt>
                <dd className="tnum text-right text-ink-soft">
                  email only · demo mode
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="eyebrow">On signup</dt>
                <dd className="tnum text-right text-positive">
                  + bonus credits
                </dd>
              </div>
            </dl>
          </form>

          {ref ? (
            <p className="mt-5 flex items-center gap-2 text-sm text-muted">
              <span aria-hidden className="text-accent">
                ✦
              </span>
              Joining via a referral — you both get bonus credits.
            </p>
          ) : null}
        </section>
      </div>
    </main>
  );
}
