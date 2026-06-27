// Tollgate wordmark — an SVG "toll gate" mark (two posts + a lifting bar) + name.
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-semibold tracking-tight ${className}`}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="3" y="9" width="3" height="12" rx="1" fill="var(--color-ink)" />
        <rect x="18" y="9" width="3" height="12" rx="1" fill="var(--color-ink)" />
        <rect x="4" y="4" width="17" height="3" rx="1.5" fill="var(--color-accent)"
          transform="rotate(-18 4 5.5)" />
        <circle cx="12" cy="15" r="1.6" fill="var(--color-warm)" />
      </svg>
      <span className="text-[1.05rem]">Tollgate</span>
    </span>
  );
}
