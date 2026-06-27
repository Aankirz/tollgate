import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { getBalance, getLedger } from "@/lib/wallet";
import { CREDITS } from "@/lib/pricing";
import { SignOutButton } from "@/components/SignOutButton";
import type { LedgerEntry } from "@/db/schema";
import Generator from "./Generator";
import BuyCredits from "./BuyCredits";
import ReferralLink from "./ReferralLink";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

const LEDGER_LABELS: Record<LedgerEntry["type"], string> = {
  signup_bonus: "Signup bonus",
  topup: "Top up",
  debit: "Generation",
  referral_grant: "Referral reward",
};

export default async function DemoAppPage() {
  const user = await getSessionUser();
  if (!user) redirect("/signin");

  const [balance, ledger] = await Promise.all([
    getBalance(user.id),
    getLedger(user.id),
  ]);

  const referralLink = `${APP_URL}/signin?ref=${user.id}`;

  return (
    <div className="flex flex-1 flex-col">
      <TopBar email={user.email} balance={balance} />

      <main className="mx-auto grid w-full max-w-6xl flex-1 gap-6 px-6 py-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-6">
          <Generator />
          <ReferEarn link={referralLink} />
        </div>

        <aside className="flex flex-col gap-6">
          <BuyCredits />
          <RecentActivity ledger={ledger} />
        </aside>
      </main>
    </div>
  );
}

function TopBar({ email, balance }: { email: string; balance: number }) {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid size-6 place-items-center rounded-md bg-accent text-accent-foreground text-xs font-bold">
            T
          </span>
          <span>Tollgate</span>
        </Link>

        <div className="flex items-center gap-5">
          <div className="text-right">
            <p className="text-xs uppercase tracking-wider text-muted">Balance</p>
            <p className="tnum text-2xl font-semibold leading-tight">
              {balance.toLocaleString()}
              <span className="ml-1 text-sm font-normal text-muted">credits</span>
            </p>
          </div>
          <div className="hidden text-right sm:block">
            <p className="text-xs uppercase tracking-wider text-muted">Signed in</p>
            <p className="max-w-[14rem] truncate text-sm text-foreground">{email}</p>
          </div>
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}

function ReferEarn({ link }: { link: string }) {
  return (
    <section className="rounded-[var(--radius-card)] border border-border bg-surface p-6">
      <h2 className="text-lg font-semibold tracking-tight">Refer &amp; earn</h2>
      <p className="mt-1 text-sm text-muted">
        Share your link. When a friend signs in, you both get{" "}
        <span className="tnum font-medium text-positive">{CREDITS.REFERRAL_GRANT}</span>{" "}
        credits — instantly, exactly once.
      </p>
      <ReferralLink link={link} />
    </section>
  );
}

function RecentActivity({ ledger }: { ledger: LedgerEntry[] }) {
  return (
    <section className="rounded-[var(--radius-card)] border border-border bg-surface p-6">
      <h2 className="text-lg font-semibold tracking-tight">Recent activity</h2>

      {ledger.length === 0 ? (
        <p className="mt-3 text-sm text-muted">No activity yet. Run a generation to begin.</p>
      ) : (
        <ul className="mt-4 divide-y divide-border">
          {ledger.slice(0, 12).map((entry) => (
            <LedgerRow key={entry.id} entry={entry} />
          ))}
        </ul>
      )}
    </section>
  );
}

function LedgerRow({ entry }: { entry: LedgerEntry }) {
  const isCredit = entry.creditsDelta >= 0;
  const sign = isCredit ? "+" : "";
  const date = new Date(entry.createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

  return (
    <li className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium text-foreground">{LEDGER_LABELS[entry.type]}</p>
        <p className="tnum text-xs text-muted">{date}</p>
      </div>
      <span
        className={`tnum text-sm font-semibold ${isCredit ? "text-positive" : "text-negative"}`}
      >
        {sign}
        {entry.creditsDelta.toLocaleString()}
      </span>
    </li>
  );
}
