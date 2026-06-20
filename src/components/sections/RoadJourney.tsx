"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useI18n } from "@/i18n/LanguageProvider";
import styles from "./RoadJourney.module.css";

gsap.registerPlugin(ScrollTrigger);

const FRAMES = 180;
const framePath = (i: number) =>
  `/road/seq/steppe_${String(i + 1).padStart(4, "0")}.jpg`;

/* The Journey — ONE continuous film CITY → ROAD → FIELD, scrubbed by scroll.
   The Manifesto reveals line-by-line over the FIELD third. */
export function TheJourney() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const journeyKickerRef = useRef<HTMLHeadingElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);
  const roadRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const citySlabRef = useRef<HTMLSpanElement>(null);
  const roadSlabRef = useRef<HTMLSpanElement>(null);
  const fieldSlabRef = useRef<HTMLSpanElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const kickerRef = useRef<HTMLSpanElement>(null);
  const maniBgRef = useRef<HTMLDivElement>(null);
  const maniRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const images = useRef<HTMLImageElement[]>([]);
  const frame = useRef(0);
  const [ready, setReady] = useState(false);
  const [loadPct, setLoadPct] = useState(0);

  // preload frame sequence
  useEffect(() => {
    let loaded = 0;
    const imgs: HTMLImageElement[] = [];
    for (let i = 0; i < FRAMES; i++) {
      const im = new Image();
      im.src = framePath(i);
      im.onload = im.onerror = () => {
        loaded++;
        setLoadPct(Math.round((loaded / FRAMES) * 100));
        if (loaded === FRAMES) setReady(true);
      };
      imgs[i] = im;
    }
    images.current = imgs;
  }, []);

  // canvas draw + scroll-scrub + overlays
  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // intentional focal cover-crop — keeps the walking figure framed on every
    // aspect (incl. 9:16 phones) instead of a naive dead-centre crop. The 16:9
    // source stays full-height on portrait with the subject held centre; fy
    // biases the height-crop (landscape) toward the figure/horizon line.
    const draw = (i: number) => {
      const im = images.current[i];
      if (!im || !im.naturalWidth) return;
      const cw = canvas.width;
      const ch = canvas.height;
      const ir = im.naturalWidth / im.naturalHeight;
      const cr = cw / ch;
      const portrait = cr < 1;
      const fx = 0.5; // figure sits horizontally centred in the plates
      const fy = portrait ? 0.5 : 0.46; // hold the horizon a touch above centre
      let dw, dh, dx, dy;
      if (ir > cr) {
        dh = ch;
        dw = ch * ir;
        dx = (cw - dw) * fx;
        dy = 0;
      } else {
        dw = cw;
        dh = cw / ir;
        dx = 0;
        dy = (ch - dh) * fy;
      }
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(im, dx, dy, dw, dh);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
      draw(frame.current);
    };
    resize();

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
    const tri = (p: number, c: number) => clamp01(1 - Math.abs(p - c) / 0.24);
    // narrower triangle for the act titles so adjacent acts never overlap
    const actTri = (p: number, c: number) => clamp01(1 - Math.abs(p - c) / 0.11);
    const fadeIn = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
    const maniStarts = [0.78, 0.84, 0.9]; // three slogans
    const REVEAL_END = 0.06; // first 6% of the track = the logo-portal bloom

    // subtle slab parallax: each title recedes in Z + eases its tilt as it
    // leaves its peak — composes on the inner carrier so it never fights the
    // act-level translateY. Compositor-only (translate3d + rotateX) → 60fps.
    const slabParallax = (
      slab: HTMLElement | null,
      center: number,
      p: number,
    ) => {
      if (!slab) return;
      const d = p - center;
      const ty = (d * -34).toFixed(1);
      const tz = (-Math.abs(d) * 200).toFixed(0);
      const rx = (-7 + d * 9).toFixed(1);
      slab.style.transform = `translate3d(0, ${ty}px, ${tz}px) rotateX(${rx}deg)`;
    };

    const overlay = (p: number) => {
      // keep all titles hidden while the logo portal is still opening, then
      // fade them in just after it has bloomed — so nothing competes with the
      // aperture during the reveal
      const revealed = clamp01((p - REVEAL_END) / 0.03);
      // journey kicker shows during the acts, then fades out before the manifesto
      if (journeyKickerRef.current)
        journeyKickerRef.current.style.opacity = String(
          revealed * (1 - fadeIn(p, 0.66, 0.72)),
        );
      // three act slabs: CITY (0.12) → ROAD (0.40) → FIELD (0.62), then manifesto
      if (cityRef.current) {
        const o = (p < 0.25 ? actTri(p, 0.12) : 0) * revealed;
        cityRef.current.style.opacity = String(o);
        cityRef.current.style.transform = `translateY(${(p - 0.12) * -60}px)`;
        if (o > 0) slabParallax(citySlabRef.current, 0.12, p);
      }
      if (roadRef.current) {
        const o = p < 0.53 ? actTri(p, 0.4) : 0;
        roadRef.current.style.opacity = String(o);
        roadRef.current.style.transform = `translateY(${(p - 0.4) * -60}px)`;
        if (o > 0) slabParallax(roadSlabRef.current, 0.4, p);
      }
      if (fieldRef.current) {
        const o = p < 0.74 ? actTri(p, 0.62) : 0;
        fieldRef.current.style.opacity = String(o);
        fieldRef.current.style.transform = `translateY(${(p - 0.62) * -60}px)`;
        if (o > 0) slabParallax(fieldSlabRef.current, 0.62, p);
      }
      // Manifesto over the tail (starts as FIELD clips at 0.74)
      if (maniBgRef.current)
        maniBgRef.current.style.opacity = String(fadeIn(p, 0.72, 0.8));
      if (kickerRef.current)
        kickerRef.current.style.opacity = String(fadeIn(p, 0.74, 0.78));
      maniRefs.current.forEach((el, i) => {
        if (!el) return;
        // premium "focus-rise": each line lifts, sharpens from blur, and its
        // tracking settles — a cinematic reveal rather than a flat fade
        const o = fadeIn(p, maniStarts[i], maniStarts[i] + 0.06);
        const inv = 1 - o;
        el.style.opacity = String(o);
        el.style.transform = `translateY(${(inv * 30).toFixed(1)}px) scale(${(1 + inv * 0.03).toFixed(3)})`;
        el.style.filter = `blur(${(inv * 7).toFixed(2)}px)`;
        el.style.letterSpacing = `${(0.01 + inv * 0.12).toFixed(3)}em`;
      });
      if (fillRef.current)
        fillRef.current.style.transform = `scaleY(${p.toFixed(3)})`;
    };

    if (reduced) {
      draw(Math.floor(FRAMES / 2));
      overlay(0.95);
      window.addEventListener("resize", resize);
      return () => window.removeEventListener("resize", resize);
    }

    // ── Logo-portal reveal ──────────────────────────────────────────────
    // The film is unveiled THROUGH a growing BØRI-logo aperture over the first
    // slice of the track. The aperture is born at the Hero logo's screen spot
    // and, as it blooms, drifts onto the solid lower pad + grows huge so the
    // unmask lands on fully-solid film (no counter-hole) with zero seam.
    const backdrop = backdropRef.current;
    const END_Y = 84; // % → maps onto the solid bottom pad of the mark
    const MID_FRAC = 0.5; // Hero portal grew [0, MID_FRAC]; we continue [MID_FRAC, 1]
    const bloomEase = gsap.parseEase("power2.out"); // fast early growth = visible on the Hero
    let startSize = 132;
    let startX = 50;
    let startY = 62;

    const syncAperture = () => {
      const hero = document.querySelector(
        "[data-hero-logo]",
      ) as HTMLElement | null;
      if (hero) {
        const r = hero.getBoundingClientRect();
        // only trust the measurement while the Hero logo is actually on-screen
        // (i.e. page near top); otherwise keep the last good / default origin
        if (r.width > 0 && r.top > -r.height && r.top < window.innerHeight) {
          startSize = Math.max(96, r.width);
          startX = ((r.left + r.width / 2) / window.innerWidth) * 100;
          startY = ((r.top + r.height / 2) / window.innerHeight) * 100;
        }
      }
      if (backdrop) {
        backdrop.style.setProperty("--ap-x", `${startX}%`);
        backdrop.style.setProperty("--ap-y", `${startY}%`);
      }
    };

    const endSize = () =>
      Math.ceil(Math.hypot(window.innerWidth, window.innerHeight) * 8);

    const reveal = (p: number) => {
      if (p >= REVEAL_END) {
        if (canvas.classList.contains(styles.blooming)) {
          canvas.classList.remove(styles.blooming);
          canvas.style.removeProperty("mask-size");
          canvas.style.removeProperty("-webkit-mask-size");
        }
        if (backdrop) backdrop.style.opacity = "0";
        return;
      }
      if (!canvas.classList.contains(styles.blooming))
        canvas.classList.add(styles.blooming);
      // CONTINUE the global bloom: the Hero portal already grew [0, MID_FRAC];
      // this segment grows [MID_FRAC, 1] over the journey's first slice so the
      // aperture meets the Hero's at the seam with no jump.
      const lp = p / REVEAL_END;
      const g = MID_FRAC + (1 - MID_FRAC) * lp;
      const e = bloomEase(g);
      const apX = startX + (50 - startX) * e;
      const apY = startY + (END_Y - startY) * e;
      const size = startSize + (endSize() - startSize) * e;
      canvas.style.setProperty("--ap-x", `${apX}%`);
      canvas.style.setProperty("--ap-y", `${apY}%`);
      canvas.style.setProperty("mask-size", `${size}px auto`);
      canvas.style.setProperty("-webkit-mask-size", `${size}px auto`);
      if (backdrop) backdrop.style.opacity = String(0.92 * (1 - lp));
    };

    syncAperture();
    window.addEventListener("resize", syncAperture);
    window.visualViewport?.addEventListener("resize", syncAperture);

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      onUpdate: (self) => {
        const p = self.progress;
        const f = Math.min(FRAMES - 1, Math.round(p * (FRAMES - 1)));
        if (f !== frame.current) {
          frame.current = f;
          draw(f);
        }
        reveal(p);
        overlay(p);
      },
    });

    window.addEventListener("resize", resize);
    overlay(0);
    reveal(0);

    return () => {
      st.kill();
      window.removeEventListener("resize", resize);
      window.removeEventListener("resize", syncAperture);
      window.visualViewport?.removeEventListener("resize", syncAperture);
    };
  }, [ready]);

  return (
    <section ref={sectionRef} className={styles.road} id="territories">
      <div className={styles.sticky}>
        <div ref={backdropRef} className={styles.revealBackdrop} aria-hidden="true" />
        <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
        <div className={styles.grade} aria-hidden="true" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/road/seq/steppe_0001.jpg"
          alt=""
          aria-hidden="true"
          className={`${styles.poster} ${ready ? styles.posterHidden : ""}`}
        />
        <div className={styles.scrim} />
        <div className={styles.grain} />

        <h2 ref={journeyKickerRef} className={styles.kicker}>
          {t.journey.kicker}
        </h2>

        {/* CITY / ROAD / FIELD act labels — floating slabs */}
        <div className={styles.acts}>
          <div ref={cityRef} className={styles.act}>
            <span className={styles.actIdx}>01</span>
            <span className={styles.actT}>
              <span ref={citySlabRef} className={styles.actTSlab}>
                {t.journey.city.t}
              </span>
            </span>
            <span className={styles.actS}>{t.journey.city.s}</span>
          </div>
          <div ref={roadRef} className={styles.act}>
            <span className={styles.actIdx}>02</span>
            <span className={styles.actT}>
              <span ref={roadSlabRef} className={styles.actTSlab}>
                {t.journey.road.t}
              </span>
            </span>
            <span className={styles.actS}>{t.journey.road.s}</span>
          </div>
          <div ref={fieldRef} className={styles.act}>
            <span className={styles.actIdx}>03</span>
            <span className={styles.actT}>
              <span ref={fieldSlabRef} className={styles.actTSlab}>
                {t.journey.field.t}
              </span>
            </span>
            <span className={styles.actS}>{t.journey.field.s}</span>
          </div>
        </div>

        {/* Manifesto over the FIELD third */}
        <div className={styles.manifesto}>
          <div ref={maniBgRef} className={styles.maniBg} aria-hidden="true" />
          <span ref={kickerRef} className={styles.maniKicker}>
            {t.manifesto.kicker}
          </span>
          {t.manifesto.lines.map((l, i) => (
            <p
              key={i}
              ref={(el) => {
                maniRefs.current[i] = el;
              }}
              className={styles.maniLine}
            >
              <em className={styles.maniEm}>{l.em}</em>
              {l.rest}
            </p>
          ))}
        </div>

        <div className={styles.progress}>
          <div ref={fillRef} className={styles.progressFill} />
        </div>

        <div className={`${styles.loading} ${ready ? styles.loadingDone : ""}`}>
          {loadPct}%
        </div>
      </div>
    </section>
  );
}
