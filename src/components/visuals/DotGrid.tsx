// Halftone dot-grid texture (Blueprint DNA). Drifts slowly; halted under reduced-motion.
export function DotGrid({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`dotgrid pointer-events-none absolute inset-0 ${className}`}
    />
  );
}
