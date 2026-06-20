"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AstanaBlueprint } from "@/components/blueprint/AstanaBlueprint";
import { SteppeField } from "@/components/canvas/SteppeField";
import { Silhouette } from "@/components/atmos/Silhouette";
import { HeroMedia } from "@/components/media/HeroMedia";
import { BoriPaw } from "@/components/brand/Logo";
import { LanguageSwitch } from "@/components/ui/LanguageSwitch";
import { useGeoTelemetry, formatCoords } from "@/lib/useGeoTelemetry";
import { heroMedia } from "@/config/heroMedia";
import { useI18n } from "@/i18n/LanguageProvider";
import styles from "./Hero.module.css";

gsap.registerPlugin(ScrollTrigger);

export function Hero({ play }: { play: boolean }) {
  const { t } = useI18n();
  const ref = useRef<HTMLElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const portalBdRef = useRef<HTMLDivElement>(null);
  const useMedia = heroMedia.enabled;
  const [scrolled, setScrolled] = useState(false);
  const geo = useGeoTelemetry();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // soft hand-off: hero content dissolves as the next section scrolls in
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.to("[data-hero-content]", {
        opacity: 0,
        y: -40,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  // Logo portal — the paw enlarges ON the Hero as you scroll and the film
  // blooms through it. Grows the first segment of the bloom (logo → MID); the
  // SAME global curve continues inside TheJourney.reveal() (MID → full) so the
  // handoff is seamless. Fixed layers: no pin, no page-height change.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    const portal = portalRef.current;
    const bd = portalBdRef.current;
    if (!el || !portal || !bd) return;

    const MID_FRAC = 0.5; // Hero owns the first half of the global bloom curve
    const END_Y = 84; // % → onto the solid lower pad (matches TheJourney)
    const bloomEase = gsap.parseEase("power2.out"); // fast early growth = visible on the Hero
    const endSize = () =>
      Math.ceil(Math.hypot(window.innerWidth, window.innerHeight) * 8);
    let startSize = 132,
      startX = 50,
      startY = 62;
    const measure = () => {
      const h = document.querySelector("[data-hero-logo]") as HTMLElement | null;
      if (!h) return;
      const r = h.getBoundingClientRect();
      if (r.width > 0 && r.top > -r.height && r.top < window.innerHeight) {
        startSize = Math.max(96, r.width);
        startX = ((r.left + r.width / 2) / window.innerWidth) * 100;
        startY = ((r.top + r.height / 2) / window.innerHeight) * 100;
      }
    };
    measure();
    window.addEventListener("resize", measure);

    const logo = () =>
      document.querySelector("[data-hero-logo]") as HTMLElement | null;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom top",
        scrub: 0.6,
        onUpdate: (self) => {
          const hp = self.progress;
          const active = hp > 0.001 && hp < 0.999;
          portal.style.visibility = active ? "visible" : "hidden";
          bd.style.visibility = active ? "visible" : "hidden";
          const l = logo();
          if (!active) {
            if (l) l.style.opacity = hp <= 0.001 ? "" : "0";
            return;
          }
          const g = hp * MID_FRAC; // global bloom progress 0..MID_FRAC on Hero
          const e = bloomEase(g);
          const size = startSize + (endSize() - startSize) * e;
          portal.style.setProperty("--ap-x", `${startX + (50 - startX) * e}%`);
          portal.style.setProperty("--ap-y", `${startY + (END_Y - startY) * e}%`);
          portal.style.maskSize = `${size}px auto`;
          (portal.style as unknown as { webkitMaskSize: string }).webkitMaskSize = `${size}px auto`;
          portal.style.opacity = String(Math.min(1, hp / 0.05));
          bd.style.opacity = String(Math.min(0.92, hp * 1.2 * 0.92));
          if (l) l.style.opacity = String(Math.max(0, 1 - hp / 0.18));
        },
      });
    }, ref);

    return () => {
      ctx.revert();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const onMove = useCallback((e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--px", px.toFixed(3));
    el.style.setProperty("--py", py.toFixed(3));
  }, []);

  return (
    <section
      ref={ref}
      className={`${styles.hero} ${play ? styles.play : ""}`}
      onPointerMove={onMove}
      id="hero"
    >
      {/* environment */}
      {useMedia ? (
        <>
          {/* generated cinematic base — already contains blueprint city + figure + steppe */}
          <div className={`${styles.layer} ${styles.media}`}>
            <HeroMedia className={styles.mediaEl} />
          </div>
          <div className={`${styles.layer} ${styles.scrim}`} />
        </>
      ) : (
        <>
          <div className={`${styles.layer} ${styles.blueprint}`}>
            <AstanaBlueprint play={play} />
          </div>
          <div className={`${styles.layer} ${styles.figure}`}>
            <Silhouette />
          </div>
          <div className={`${styles.layer} ${styles.field}`}>
            <SteppeField />
          </div>
        </>
      )}
      <div className={`${styles.layer} ${styles.vignette}`} />
      <div className={`${styles.layer} ${styles.grain}`} />

      {/* logo portal — paw-masked film that blooms on scroll (fixed layers) */}
      <div ref={portalBdRef} className={styles.portalBd} aria-hidden="true" />
      <div ref={portalRef} className={styles.portal} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/road/seq/steppe_0001.jpg"
          alt=""
          aria-hidden="true"
          className={styles.portalFilm}
        />
      </div>

      {/* HUD — system labels reveal on scroll */}
      <div
        className={`${styles.hud} ${styles.hudRight} ${scrolled ? styles.hudShow : styles.hudHide}`}
      >
        <span>{t.hero.micro.protocol}</span>
        <span style={{ color: "var(--text-faint)" }}>{t.hero.micro.activating}</span>
        <span className={styles.bar} />
      </div>

      <div className={`${styles.hud} ${styles.coordsBL} ${styles.reveal} ${styles.d4}`}>
        {formatCoords(geo)}
      </div>
      <LanguageSwitch className={`${styles.heroLang} ${styles.reveal} ${styles.d4}`} />

      {/* content */}
      <div className={styles.content} data-hero-content>
        {/* tagline above the walking figure */}
        <p className={`${styles.taglineTop} ${styles.reveal} ${styles.d1}`}>
          {t.hero.tagline}
        </p>

        {/* logo at leg level, CTA below */}
        <div className={styles.lower}>
          <h1 className={`${styles.lockup} ${styles.reveal} ${styles.d2}`}>
            <span data-hero-logo style={{ display: "inline-flex" }}>
              <BoriPaw size={120} className={styles.logoMark} title="BØRI" />
            </span>
            <span className="srOnly">BØRI — {t.hero.tagline}</span>
          </h1>
          <a
            className={`${styles.ctaBtn} ${styles.reveal} ${styles.d3}`}
            href="#join"
          >
            {t.hero.cta}
          </a>
          <svg
            className={`${styles.chev} ${styles.reveal} ${styles.d4}`}
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path d="M5 9l7 7 7-7" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </div>
      </div>
    </section>
  );
}
