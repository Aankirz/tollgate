import type { ReactNode } from "react";

// Saturated deep-blue panel with film grain (Blueprint DNA) — backdrop for illustrations.
export function GrainPanel({
  children,
  className = "",
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[var(--radius-card)] ${className}`}
      style={{
        background:
          "linear-gradient(150deg, var(--color-panel), var(--color-panel-deep))",
        color: "var(--color-panel-foreground)",
      }}
    >
      {/* film grain */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.12] mix-blend-overlay"
      >
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
      <div className="relative">{children}</div>
    </div>
  );
}
