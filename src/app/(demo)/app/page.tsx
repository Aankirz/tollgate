import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { getBalance, getLedger } from "@/lib/wallet";
import { CREDITS } from "@/lib/pricing";
import { Wordmark } from "@/components/visuals/Wordmark";
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
    <div className="flex flex-1 flex-col bg-background text-foreground">
      <TopBar email={user.email} balance={balance} />

      <main className="mx-auto grid w-full max-w-6xl flex-1 gap-px border-x border-border bg-border lg:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-px bg-border">
          <div className="bg-background p-6 md:p-8">
            <Generator />
          </div>
          <div className="bg-background p-6 md:p-8">
            <ReferEarn link={referralLink} />
          </div>
        </div>

        <aside className="flex flex-col gap-px bg-border">
          <div className="bg-background p-6 md:p-8">
            <BuyCredits />
          </div>
          <div className="flex-1 bg-background p-6 md:p-8">
            <RecentActivity ledger={ledger} />
          </div>
        </aside>
      </main>
    </div>
  );
}

function TopBar({ email, balance }: { email: string; balance: number }) {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-end justify-between gap-6 px-6 py-5">
        <div className="flex flex-col gap-2">
          <Wordmark />
          <p className="max-w-[16rem] truncate font-mono text-xs text-muted">
            {email}
          </p>
        </div>

        <div className="flex items-end gap-7">
          <div className="text-right">
            <span className="eyebrow">Balance</span>
            <p className="display mt-1 flex items-baseline justify-end gap-2 leading-none">
              <span className="tnum text-5xl text-foreground">
                {balance.toLocaleString()}
              </span>
              <span className="eyebrow">credits</span>
            </p>
          </div>
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}

function ReferEarn({ link }: { link: string }) {
  return (
    <section>
      <span className="eyebrow">Refer &amp; earn</span>
      <h2 className="display mt-3 text-3xl">
        Bring a friend, <em className="text-accent">both</em> get paid.
      </h2>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
        Share your link. When a friend signs in, you both get{" "}
        <span className="tnum font-medium text-positive">+{CREDITS.REFERRAL_GRANT}</span>{" "}
        credits — instantly, exactly once.
      </p>
      <ReferralLink link={link} />
    </section>
  );
}

function RecentActivity({ ledger }: { ledger: LedgerEntry[] }) {
  return (
    <section>
      <span className="eyebrow">Recent activity</span>
      <h2 className="display mt-3 text-3xl">The ledger.</h2>

      {ledger.length === 0 ? (
        <p className="mt-5 text-sm text-muted">
          No activity yet. Run a generation to begin.
        </p>
      ) : (
        <ul className="mt-6 flex flex-col">
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
    <li className="flex items-baseline justify-between gap-4 border-t border-dashed border-border py-3 font-mono text-sm">
      <span className="flex items-baseline gap-3">
        <span className="text-foreground">{LEDGER_LABELS[entry.type]}</span>
        <span className="tnum text-xs text-muted">{date}</span>
      </span>
      <span
        className={`tnum font-medium ${isCredit ? "text-positive" : "text-negative"}`}
      >
        {sign}
        {entry.creditsDelta.toLocaleString()}
      </span>
    </li>
  );
}
