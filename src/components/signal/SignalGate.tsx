"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PawLogo3DLazy } from "@/components/three/PawLogo3DLazy";
import {
  useGeoTelemetry,
  oxygenForAltitude,
  formatCoords,
} from "@/lib/useGeoTelemetry";
import { useI18n } from "@/i18n/LanguageProvider";
import styles from "./SignalGate.module.css";

const HOLD_MS = 1700;
const R = 120;
const C = 2 * Math.PI * R;

const hex = () =>
  Math.floor(Math.random() * 65536).toString(16).padStart(4, "0").toUpperCase();

export function SignalGate({
  onEnter,
}: {
  onEnter: (withSound: boolean) => void;
}) {
  const { t } = useI18n();
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [feed, setFeed] = useState("0000 · 0000 · 0000");
  const [tel, setTel] = useState({ load: 24, pace: 4.2 });
  const [reducedMotion, setReducedMotion] = useState(false);
  const geo = useGeoTelemetry(); // real city / coords / ground elevation by IP
  const [soundOn, setSoundOn] = useState(true); // chosen on the gate, applied on entry
  const soundOnRef = useRef(true);
  soundOnRef.current = soundOn;
  const holding = useRef(false);
  const startTs = useRef(0);
  const raf = useRef(0);
  const done = useRef(false);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    setReducedMotion(reduced.current);
    if (reduced.current) return;
    const id = window.setInterval(
      () => setFeed(`${hex()} · ${hex()} · ${hex()}`),
      80,
    );
    // ambient jitter for the gear/pace sensors (altitude/oxygen come from real IP geo)
    const wob = (v: number, d: number, lo: number, hi: number) =>
      Math.min(hi, Math.max(lo, v + (Math.random() - 0.5) * d));
    const tid = window.setInterval(() => {
      setTel((p) => ({
        load: Math.round(wob(p.load, 1.4, 22, 27)),
        pace: Math.round(wob(p.pace, 0.5, 3.6, 4.8) * 10) / 10,
      }));
    }, 720);
    return () => {
      window.clearInterval(id);
      window.clearInterval(tid);
    };
  }, []);

  const complete = useCallback(() => {
    if (done.current) return;
    done.current = true;
    holding.current = false;
    cancelAnimationFrame(raf.current);
    setProgress(1);
    setExiting(true);
    window.setTimeout(() => onEnter(soundOnRef.current), 820);
  }, [onEnter]);

  const tick = useCallback(
    (now: number) => {
      if (!holding.current) return;
      const p = Math.min(1, (now - startTs.current) / HOLD_MS);
      setProgress(p);
      if (p >= 1) {
        complete();
        return;
      }
      raf.current = requestAnimationFrame(tick);
    },
    [complete],
  );

  const startHold = useCallback(() => {
    if (done.current) return;
    if (reduced.current) {
      complete();
      return;
    }
    holding.current = true;
    startTs.current = performance.now() - progress * HOLD_MS;
    raf.current = requestAnimationFrame(tick);
  }, [complete, progress, tick]);

  const endHold = useCallback(() => {
    if (done.current) return;
    holding.current = false;
    cancelAnimationFrame(raf.current);
    const decay = () => {
      setProgress((prev) => {
        const next = prev - 0.05;
        if (next <= 0) return 0;
        raf.current = requestAnimationFrame(decay);
        return next;
      });
    };
    raf.current = requestAnimationFrame(decay);
  }, []);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      complete();
    }
  };

  const pct = Math.round(progress * 100);
  const tl = t.signal.telemetry;
  // real ground elevation by IP + a symbolic "ascent" while the hold charges
  const summitAlt = geo.altitude + Math.round(progress * 240);
  const o2 = oxygenForAltitude(geo.altitude);
  const coords = formatCoords(geo);
  // halo hugging the paw silhouette: platinum at rest → ember orange as it charges,
  // in lockstep with the in-engine emissive (same smoothstep).
  const s = progress * progress * (3 - 2 * progress);
  const gr = Math.round(0xa8 + (0xff - 0xa8) * s);
  const gg = Math.round(0xb0 + (0x6a - 0xb0) * s);
  const gb = Math.round(0xb8 + (0x1a - 0xb8) * s);
  const gc = `${gr},${gg},${gb}`;
  const glow = `drop-shadow(0 0 ${(6 + s * 16).toFixed(1)}px rgba(${gc},${(
    0.14 +
    s * 0.42
  ).toFixed(3)})) drop-shadow(0 0 ${(16 + s * 40).toFixed(1)}px rgba(${gc},${(
    0.08 +
    s * 0.34
  ).toFixed(3)}))`;
  // charge ring ignites grey → ember in lockstep with the glass
  const ringStroke = `rgb(${gc})`;
  const ringGlow = `drop-shadow(0 0 ${(6 + s * 10).toFixed(1)}px rgba(${gc},${(
    0.5 +
    s * 0.4
  ).toFixed(2)}))`;

  return (
    <div className={`${styles.gate} ${exiting ? styles.exiting : ""}`}>
      <div className={styles.grid} />
      <span className={`${styles.corner} ${styles.cTL}`} />
      <span className={`${styles.corner} ${styles.cTR}`} />
      <span className={`${styles.corner} ${styles.cBL}`} />
      <span className={`${styles.corner} ${styles.cBR}`} />
      <span className={styles.scan} />

      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.statusRow}>
            <span className={styles.dot} />
            <span className={styles.status}>{t.signal.status}</span>
          </div>
          <p className={styles.valueProp}>
            BØRI — {t.signal.valueProp}
          </p>
        </div>

        <div className={styles.center}>
          <button
            type="button"
            className={styles.control}
            aria-label={t.signal.enter}
            onPointerDown={startHold}
            onPointerUp={endHold}
            onPointerLeave={endHold}
            onPointerCancel={endHold}
            onKeyDown={onKey}
          >
            <svg className={styles.reticle} viewBox="0 0 300 300">
              <circle className={styles.ringTicks} cx={150} cy={150} r={142} />
              <circle className={styles.ringThin} cx={150} cy={150} r={R} />
              <circle
                className={styles.ringProg}
                cx={150}
                cy={150}
                r={R}
                strokeDasharray={C}
                strokeDashoffset={C * (1 - progress)}
                style={{ stroke: ringStroke, filter: ringGlow }}
              />
              <path className={styles.bracket} d="M65 87 V65 H87" />
              <path className={styles.bracket} d="M213 65 H235 V87" />
              <path className={styles.bracket} d="M65 213 V235 H87" />
              <path className={styles.bracket} d="M235 213 V235 H213" />
              <line className={styles.cross} x1={150} y1={14} x2={150} y2={34} />
              <line className={styles.cross} x1={150} y1={266} x2={150} y2={286} />
              <line className={styles.cross} x1={14} y1={150} x2={34} y2={150} />
              <line className={styles.cross} x1={266} y1={150} x2={286} y2={150} />
            </svg>

            <span className={styles.paw3d} style={{ filter: glow }}>
              <PawLogo3DLazy
                progress={progress}
                reduced={reducedMotion}
                className={styles.paw3dCanvas}
              />
            </span>

            {exiting && <span className={styles.flash} />}
          </button>

          <div className={styles.hud}>
            <div className={styles.hudHead}>
              <span>{tl.train}</span>
              <span className={styles.hudState}>
                <i className={styles.hudPing} />
                {progress >= 1 ? t.signal.locked : t.signal.targeting} · {pct}%
              </span>
            </div>
            <div className={styles.hudGrid}>
              <div className={styles.hudRow}>
                <span className={styles.hudLabel}>{tl.altitude}</span>
                <span className={styles.hudVal}>
                  {summitAlt} <em className={styles.hudUp}>M ▲</em>
                </span>
              </div>
              <div className={styles.hudRow}>
                <span className={styles.hudLabel}>{tl.accl}</span>
                <span className={styles.hudVal}>{pct}%</span>
              </div>
              <div className={styles.hudRow}>
                <span className={styles.hudLabel}>{tl.load}</span>
                <span className={styles.hudVal}>{tel.load} KG</span>
              </div>
              <div className={styles.hudRow}>
                <span className={styles.hudLabel}>{tl.oxygen}</span>
                <span className={styles.hudVal}>{o2}%</span>
              </div>
            </div>
            <div className={styles.hudFoot}>
              <span className={styles.feed}>{feed}</span>
              <span>
                {coords} · {geo.city} · {tel.pace} KM/H
              </span>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <button
            type="button"
            className={`${styles.soundToggle} ${soundOn ? styles.soundActive : ""}`}
            onClick={() => setSoundOn((s) => !s)}
            aria-pressed={soundOn}
          >
            <span className={styles.eq} aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </span>
            {soundOn ? t.signal.soundOn : t.signal.soundOff}
          </button>
          <p className={styles.instruction}>{t.signal.instruction}</p>
          <button type="button" className={styles.skip} onClick={complete}>
            {t.signal.tapHint}
          </button>
        </div>
      </div>
    </div>
  );
}
