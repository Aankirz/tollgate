// Isometric "append-only ledger" illustration (Blueprint DNA) — stacked blocks,
// newest on top in warm accent, with a floating credit feeding in. Pure SVG.
const COS = 0.866, SIN = 0.5;
function proj(x: number, y: number, z: number, ox: number, oy: number) {
  return [ox + (x - y) * COS, oy + (x + y) * SIN - z] as const;
}
function Box({
  x, y, z, w, d, h, ox, oy, top, left, right,
}: {
  x: number; y: number; z: number; w: number; d: number; h: number;
  ox: number; oy: number; top: string; left: string; right: string;
}) {
  const p = (X: number, Y: number, Z: number) => proj(X, Y, Z, ox, oy).join(",");
  const topFace = `${p(x, y, z + h)} ${p(x + w, y, z + h)} ${p(x + w, y + d, z + h)} ${p(x, y + d, z + h)}`;
  const leftFace = `${p(x, y + d, z + h)} ${p(x + w, y + d, z + h)} ${p(x + w, y + d, z)} ${p(x, y + d, z)}`;
  const rightFace = `${p(x + w, y, z + h)} ${p(x + w, y + d, z + h)} ${p(x + w, y + d, z)} ${p(x + w, y, z)}`;
  return (
    <g stroke="var(--color-panel-foreground)" strokeOpacity="0.35" strokeWidth="1">
      <polygon points={leftFace} fill={left} />
      <polygon points={rightFace} fill={right} />
      <polygon points={topFace} fill={top} />
    </g>
  );
}

export function IsometricLedger({ className = "" }: { className?: string }) {
  const ox = 180, oy = 210;
  const blocks = [0, 1, 2, 3]; // bottom → top
  return (
    <svg viewBox="0 0 360 300" className={`w-full h-auto ${className}`} role="img"
      aria-label="An append-only ledger: stacked blocks, newest on top.">
      {blocks.map((i) => {
        const top = i === blocks.length - 1 ? "var(--color-warm)" : "rgba(255,255,255,0.92)";
        return (
          <Box key={i} x={-55} y={-55} z={i * 26} w={110} d={110} h={20}
            ox={ox} oy={oy} top={top}
            left="rgba(255,255,255,0.30)" right="rgba(255,255,255,0.16)" />
        );
      })}
      {/* floating credit feeding the top block */}
      <g style={{ animation: "pulse-soft 2.4s var(--ease-in-out) infinite" }}>
        <Box x={-14} y={-14} z={132} w={28} d={28} h={10} ox={ox} oy={oy}
          top="var(--color-accent)" left="rgba(0,0,0,0.18)" right="rgba(0,0,0,0.30)" />
      </g>
      {/* connector */}
      <line {...lineProps(ox, oy)} stroke="var(--color-panel-foreground)" strokeOpacity="0.5"
        strokeWidth="1.5" strokeDasharray="3 4" />
    </svg>
  );
}

function lineProps(ox: number, oy: number) {
  const [x1, y1] = proj(0, 0, 120, ox, oy);
  const [x2, y2] = proj(0, 0, 132, ox, oy);
  return { x1, y1, x2, y2 };
}
