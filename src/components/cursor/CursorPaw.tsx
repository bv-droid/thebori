"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./CursorPaw.module.css";

/* Custom cursor — a single BØRI claw, tip-anchored like a standard pointer.
   Fine-pointer only; disabled (native cursor kept) for reduced-motion / AT. */

export function CursorPaw() {
  const [enabled, setEnabled] = useState(false);
  const [hover, setHover] = useState(false);
  const [down, setDown] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);
    document.documentElement.classList.add("cursor-none");

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let cx = x;
    let cy = y;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const interactive = !!(e.target as Element)?.closest?.(
        "a, button, input, [role='button'], label",
      );
      setHover(interactive);
    };
    const onDown = () => setDown(true);
    const onUp = () => setDown(false);

    const loop = () => {
      // tight follow → reads like a standard cursor, just a hair of smoothing
      const k = 0.55;
      cx += (x - cx) * k;
      cy += (y - cy) * k;
      if (ref.current) ref.current.style.transform = `translate(${cx}px, ${cy}px)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.classList.remove("cursor-none");
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={ref}
      className={`${styles.cursor} ${hover ? styles.hover : ""} ${down ? styles.down : ""}`}
      aria-hidden="true"
    >
      <svg
        className={styles.claw}
        width="20"
        height="23"
        viewBox="0 0 20 23"
        fill="none"
      >
        {/* a single talon — sharp tip at top-left (the hotspot) curving down */}
        <path
          d="M2 1 C 4.6 8.4, 10 15.6, 18 21 C 11.2 17.2, 5.6 11.4, 3.6 4.8 C 3.1 3.3, 2.6 2.1, 2 1 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}
