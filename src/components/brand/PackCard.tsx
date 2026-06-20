"use client";

import { useCallback, useRef } from "react";
import { BoriPaw } from "@/components/brand/Logo";
import styles from "./PackCard.module.css";

/* Shared premium Pack ID card — all-code brushed metal, engraved text, raised
   3D paw emblem, reactive holo/tilt on fine pointers. One source of truth for
   the Founding section and the Waitlist success card. */
export function PackCard({
  packId,
  label,
  status,
  micro,
  tilt = true,
}: {
  packId: string;
  label: string;
  status: string;
  micro?: string;
  tilt?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = useCallback(
    (e: React.PointerEvent) => {
      const el = ref.current;
      if (!el || !tilt) return;
      if (window.matchMedia("(pointer: coarse)").matches) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `rotateY(${px * 14}deg) rotateX(${-py * 14}deg)`;
      el.style.setProperty("--mx", `${((px + 0.5) * 100).toFixed(1)}%`);
      el.style.setProperty("--my", `${((py + 0.5) * 100).toFixed(1)}%`);
    },
    [tilt],
  );

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "";
    el.style.setProperty("--mx", "50%");
    el.style.setProperty("--my", "50%");
  }, []);

  return (
    <div className={styles.wrap}>
      <div
        ref={ref}
        className={styles.card}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
      >
        <div className={styles.metal} />
        <div className={styles.guilloche} />
        <div className={styles.holo} />
        <div className={styles.sheen} />
        <div className={styles.edge} />
        <BoriPaw size={260} className={styles.watermark} title="" />
        <div className={styles.inner}>
          <div className={styles.top}>
            <span className={styles.label}>{label}</span>
            <BoriPaw size={30} className={styles.paw} title="" />
          </div>
          <div className={styles.bottom}>
            <span className={styles.num}>{packId}</span>
            <span className={styles.status}>{status}</span>
            {micro && <span className={styles.micro}>{micro}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
