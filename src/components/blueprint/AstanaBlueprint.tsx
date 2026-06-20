"use client";

import styles from "./AstanaBlueprint.module.css";

/* Astana as platinum blueprint (spec §8.6): Bayterek, Khan Shatyr,
   Nur-Alem sphere, towers — line-art that draws on after entry.
   NOT a literal skyline photo. */

const VB_W = 520;
const VB_H = 760;
const BASE = 680;

// staggered draw-on delays
let _d = 0;
const delay = () => {
  _d += 0.045;
  return { animationDelay: `${_d.toFixed(3)}s` };
};

function floorTicks(x1: number, x2: number, top: number, bottom: number, gap: number) {
  const ticks: number[] = [];
  for (let y = bottom; y > top; y -= gap) ticks.push(y);
  return ticks.map((y, i) => (
    <line
      key={`${x1}-${i}`}
      className={`${styles.line} ${styles.faint}`}
      x1={x1}
      y1={y}
      x2={x2}
      y2={y}
      pathLength={1}
      style={delay()}
    />
  ));
}

export function AstanaBlueprint({
  className,
  play = false,
}: {
  className?: string;
  play?: boolean;
}) {
  _d = 0; // reset stagger on each render
  return (
    <div className={`${styles.wrap} ${className ?? ""}`} aria-hidden="true">
      <svg
        className={`${styles.svg} ${play ? styles.play : ""}`}
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="xMidYMax meet"
      >
        {/* horizon */}
        <line className={`${styles.line} ${styles.faint}`} x1={0} y1={BASE} x2={VB_W} y2={BASE} pathLength={1} style={delay()} />

        {/* ground ruler ticks */}
        {Array.from({ length: 13 }).map((_, i) => (
          <line
            key={`r${i}`}
            className={`${styles.line} ${styles.faint}`}
            x1={i * 42}
            y1={BASE}
            x2={i * 42}
            y2={BASE + 9}
            pathLength={1}
            style={delay()}
          />
        ))}

        {/* — Khan Shatyr (leaning tent) — */}
        <path className={styles.line} d="M30 680 Q92 520 150 422" pathLength={1} style={delay()} />
        <path className={styles.line} d="M150 422 L150 398" pathLength={1} style={delay()} />
        <path className={styles.line} d="M150 422 L200 680" pathLength={1} style={delay()} />
        <path className={`${styles.line} ${styles.faint}`} d="M150 422 L72 680" pathLength={1} style={delay()} />
        <path className={`${styles.line} ${styles.faint}`} d="M150 422 L116 680" pathLength={1} style={delay()} />
        <path className={`${styles.line} ${styles.faint}`} d="M150 422 L168 680" pathLength={1} style={delay()} />

        {/* — background tower — */}
        <path className={styles.line} d="M300 680 L300 500 L332 500 L332 680" pathLength={1} style={delay()} />
        {floorTicks(300, 332, 502, 678, 22)}
        <path className={styles.line} d="M306 500 L316 480 L326 500" pathLength={1} style={delay()} />

        {/* — Bayterek (center) — */}
        <path className={styles.line} d="M243 680 L249 372" pathLength={1} style={delay()} />
        <path className={styles.line} d="M277 680 L271 372" pathLength={1} style={delay()} />
        {/* lattice rungs */}
        {Array.from({ length: 9 }).map((_, i) => {
          const y = 660 - i * 34;
          return (
            <line key={`b${i}`} className={`${styles.line} ${styles.faint}`} x1={245} y1={y} x2={275} y2={y} pathLength={1} style={delay()} />
          );
        })}
        {/* sphere */}
        <circle className={styles.line} cx={260} cy={348} r={30} pathLength={1} style={delay()} />
        <ellipse className={`${styles.line} ${styles.faint}`} cx={260} cy={348} rx={12} ry={30} pathLength={1} style={delay()} />
        <line className={styles.line} x1={260} y1={318} x2={260} y2={290} pathLength={1} style={delay()} />
        <circle className={styles.line} cx={260} cy={284} r={4} pathLength={1} style={delay()} />

        {/* — Nur-Alem sphere (right) — */}
        <circle className={styles.line} cx={412} cy={520} r={72} pathLength={1} style={delay()} />
        <ellipse className={`${styles.line} ${styles.faint}`} cx={412} cy={520} rx={26} ry={72} pathLength={1} style={delay()} />
        <ellipse className={`${styles.line} ${styles.faint}`} cx={412} cy={520} rx={72} ry={24} pathLength={1} style={delay()} />
        <ellipse className={`${styles.line} ${styles.faint}`} cx={412} cy={520} rx={72} ry={50} pathLength={1} style={delay()} />
        <path className={styles.line} d="M412 592 L412 680" pathLength={1} style={delay()} />
        <path className={`${styles.line} ${styles.faint}`} d="M388 680 L404 600" pathLength={1} style={delay()} />
        <path className={`${styles.line} ${styles.faint}`} d="M436 680 L420 600" pathLength={1} style={delay()} />

        {/* — slim tower (right edge) — */}
        <path className={styles.line} d="M474 680 L474 452 L506 452 L506 680" pathLength={1} style={delay()} />
        {floorTicks(474, 506, 454, 678, 20)}
        <path className={styles.line} d="M474 452 L490 426 L506 452" pathLength={1} style={delay()} />

        {/* — crosshair annotation — */}
        <line className={`${styles.line} ${styles.faint}`} x1={300} y1={300} x2={320} y2={300} pathLength={1} style={delay()} />
        <line className={`${styles.line} ${styles.faint}`} x1={310} y1={290} x2={310} y2={310} pathLength={1} style={delay()} />

        {/* scanning line */}
        <line className={styles.scan} x1={0} y1={150} x2={VB_W} y2={150} />

        {/* technical label, anchored low near the structures */}
        <text className={styles.label} x={6} y={642}>
          ASTANA · STEPPE PROTOCOL
        </text>
      </svg>
    </div>
  );
}
