"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useWaitlistCount } from "@/lib/useWaitlistCount";
import styles from "./FoundingOccupancy.module.css";

/* High-resolution scarcity meter: `cap` cells, the first `count` light up
   platinum in a staggered wave when scrolled into view. Reads count/cap from
   props when given (shares the counter's single fetch), else from the hook. */
export function FoundingOccupancy({
  count: countProp,
  cap: capProp,
}: {
  count?: number | null;
  cap?: number;
} = {}) {
  const hook = useWaitlistCount();
  const count = countProp !== undefined ? countProp : hook.count;
  const cap = capProp ?? hook.cap;
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setRevealed(true);
      return;
    }
    const io = new IntersectionObserver(
      (ents) => {
        if (ents.some((e) => e.isIntersecting)) {
          setRevealed(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const filled = Math.min(cap, Math.max(0, count ?? 0));

  // build cells once per (cap, filled) change; only lit cells carry a delay
  const cells = useMemo(
    () =>
      Array.from({ length: cap }, (_, i) => {
        const lit = i < filled;
        return { lit, delay: lit ? Math.round((i / Math.max(1, filled)) * 850) : 0 };
      }),
    [cap, filled],
  );

  return (
    <div ref={ref} className={`${styles.wrap} ${revealed ? styles.on : ""}`}>
      <div className={styles.grid} role="img" aria-label={`${filled} / ${cap}`}>
        {cells.map((c, i) => (
          <span
            key={i}
            className={`${styles.cell} ${c.lit ? styles.lit : ""}`}
            style={c.lit ? { transitionDelay: `${c.delay}ms` } : undefined}
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  );
}
