"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/i18n/LanguageProvider";
import { useWaitlistCount } from "@/lib/useWaitlistCount";
import styles from "./FoundingCounter.module.css";

/* Live scarcity counter — founding members claimed of 500. Count-up on reveal. */
export function FoundingCounter() {
  const { t } = useI18n();
  const { count, cap } = useWaitlistCount();
  const [display, setDisplay] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    if (count == null) return;
    const el = rootRef.current;
    const run = () => {
      if (animated.current) return;
      animated.current = true;
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reduced || count <= 0) {
        setDisplay(count);
        return;
      }
      const dur = 1200;
      const t0 = performance.now();
      const step = (now: number) => {
        const k = Math.min(1, (now - t0) / dur);
        const e = 1 - Math.pow(1 - k, 3);
        setDisplay(Math.round(count * e));
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    if (!el || !("IntersectionObserver" in window)) {
      run();
      return;
    }
    const io = new IntersectionObserver(
      (ents) => {
        if (ents.some((x) => x.isIntersecting)) {
          run();
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [count]);

  const c = count ?? 0;
  const remaining = t.founding.counter.remaining.replace(
    "{n}",
    String(Math.max(0, cap - c)),
  );

  return (
    <div ref={rootRef} className={styles.wrap}>
      <div className={styles.figures}>
        <span className={styles.num}>{display.toLocaleString("ru-RU")}</span>
        <span className={styles.cap}>/ {cap}</span>
      </div>
      <span className={styles.label}>{t.founding.counter.label}</span>
      <div className={styles.bar} aria-hidden="true">
        <div className={styles.barTrack}>
          <div
            className={styles.fill}
            style={{ width: `calc((100% - 4px) * ${Math.min(1, display / cap)})` }}
          >
            <span className={styles.head} />
          </div>
        </div>
      </div>
      <span className={styles.remaining}>{remaining}</span>
    </div>
  );
}
