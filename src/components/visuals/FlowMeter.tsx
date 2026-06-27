// Hero centerpiece: credits flow in → the meter debits real cost → margin out.
// Flowing dots use offset-path (GPU-friendly); halted by the global reduced-motion rule.
export function FlowMeter({ className = "" }: { className?: string }) {
  const PIPE = "M 96 150 C 170 150, 190 150, 250 150 S 360 116, 430 108";
  return (
    <div className={className}>
      <style>{`
        @keyframes credit-flow { from { offset-distance: 0%; } to { offset-distance: 100%; } }
        .credit-dot { offset-path: path("${PIPE}"); animation: credit-flow 2.8s linear infinite; }
      `}</style>
      <svg viewBox="0 0 520 300" className="w-full h-auto" role="img"
        aria-label="Credits flow into the meter, which debits the real AI cost and returns margin.">
        {/* pipe */}
        <path d={PIPE} fill="none" stroke="var(--color-border)" strokeWidth="10" strokeLinecap="round" />
        <path d={PIPE} fill="none" stroke="var(--color-accent)" strokeWidth="2.5"
          strokeDasharray="4 12" strokeLinecap="round"
          style={{ animation: "flow-dash 1.6s linear infinite" }} />

        {/* CREDITS — stacked tiles */}
        {[0, 1, 2].map((i) => (
          <rect key={i} x={42} y={120 - i * 6} width="48" height="20" rx="4"
            fill="var(--color-accent)" opacity={0.55 + i * 0.22} />
        ))}
        <text x="66" y="178" textAnchor="middle" className="tnum"
          fontSize="11" letterSpacing="2" fill="var(--color-muted)">CREDITS</text>

        {/* METER — gauge */}
        <circle cx="250" cy="150" r="46" fill="var(--color-paper-2)" stroke="var(--color-border)" strokeWidth="2" />
        <path d="M 250 150 L 250 110" stroke="var(--color-border)" strokeWidth="2" />
        <path d="M 214 168 A 46 46 0 0 1 286 168" fill="none"
          stroke="var(--color-accent)" strokeWidth="6" strokeLinecap="round" />
        <line x1="250" y1="150" x2="276" y2="128" stroke="var(--color-warm-ink)" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="250" cy="150" r="4.5" fill="var(--color-ink)" />
        <text x="250" y="222" textAnchor="middle" fontSize="11" letterSpacing="2"
          className="tnum" fill="var(--color-muted)">METER</text>

        {/* MARGIN — rising bars + up arrow */}
        {[0, 1, 2].map((i) => (
          <rect key={i} x={418 + i * 16} y={120 - i * 14} width="11" height={20 + i * 14} rx="2"
            fill="var(--color-positive)" />
        ))}
        <path d="M 414 96 l 10 -12 l 10 12" fill="none" stroke="var(--color-positive)"
          strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <text x="442" y="178" textAnchor="middle" fontSize="11" letterSpacing="2"
          className="tnum" fill="var(--color-muted)">MARGIN</text>

        {/* flowing credits */}
        {[0, 0.93, 1.86].map((d, i) => (
          <circle key={i} className="credit-dot" r="5" fill="var(--color-warm)"
            style={{ animationDelay: `${d}s` }} />
        ))}
      </svg>
    </div>
  );
}
