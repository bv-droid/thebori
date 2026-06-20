"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useI18n } from "@/i18n/LanguageProvider";
import styles from "./FieldTest.module.css";

gsap.registerPlugin(ScrollTrigger);

export function FieldTest() {
  const { t } = useI18n();
  const root = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 860px)").matches;

    const ctx = gsap.context(() => {
      // leaving the manifesto → the Field Test intro blooms in through the paw
      const intro = introRef.current;
      if (intro && !reduced) {
        const REVEAL = 0.9;
        const startSize = 110;
        const ease = gsap.parseEase("power1.out");
        const endSize = () => {
          const r = intro.getBoundingClientRect();
          return Math.ceil(Math.hypot(r.width, r.height) * 1.3);
        };
        const apply = (p: number) => {
          if (p >= REVEAL) {
            intro.classList.remove(styles.introPortal);
            intro.style.removeProperty("mask-size");
            intro.style.removeProperty("-webkit-mask-size");
            return;
          }
          if (!intro.classList.contains(styles.introPortal))
            intro.classList.add(styles.introPortal);
          const e = ease(p / REVEAL);
          const size = startSize + (endSize() - startSize) * e;
          intro.style.maskSize = `${size}px auto`;
          (intro.style as unknown as { webkitMaskSize: string }).webkitMaskSize = `${size}px auto`;
        };
        ScrollTrigger.create({
          trigger: intro,
          start: "top 82%",
          end: "top 30%",
          scrub: 0.8,
          onUpdate: (self) => apply(self.progress),
        });
        apply(0);
      }

      if (reduced || mobile) return;

      const outer = outerRef.current;
      const track = trackRef.current;
      const pin = pinRef.current;
      if (!outer || !track || !pin) return;

      // CSS sticky pins the gallery; scroll progress translates the track
      const panels = Array.from(track.children) as HTMLElement[];
      const n = panels.length;
      ScrollTrigger.create({
        trigger: outer,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;
          const total = track.scrollWidth - pin.clientWidth;
          track.style.transform = `translate3d(${-(p * total).toFixed(1)}px, 0, 0)`;
          // progress HUD: counter + bar
          const cur = Math.min(n, Math.floor(p * n) + 1);
          if (counterRef.current)
            counterRef.current.textContent = String(cur).padStart(2, "0");
          if (barRef.current) barRef.current.style.transform = `scaleX(${p.toFixed(3)})`;
          // subtle parallax: each panel image drifts against the scroll
          panels.forEach((panel, i) => {
            const center = n > 1 ? i / (n - 1) : 0;
            const d = p - center;
            const img = panel.querySelector("img") as HTMLElement | null;
            if (img)
              img.style.transform = `scale(1.08) translateX(${(d * -36).toFixed(1)}px)`;
          });
        },
      });
    }, root);

    return () => ctx.revert();
  }, [t]);

  return (
    <section ref={root} className={styles.fieldTest} id="field-test">
      <div ref={introRef} className={styles.intro} data-fintro>
        <span className={styles.kicker}>{t.fieldTest.kicker}</span>
        <h2 className={styles.title}>{t.fieldTest.title}</h2>
        <p className={styles.introText}>{t.fieldTest.intro}</p>
      </div>

      <div ref={outerRef} className={styles.galleryOuter}>
        <div ref={pinRef} className={styles.galleryPin}>
          <div ref={trackRef} className={styles.track}>
            {t.fieldTest.modules.map((m) => (
              <article key={m.id} className={styles.panel}>
                <div className={styles.panelInner}>
                  <div className={styles.media}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/field-test/${m.name.toLowerCase()}.jpg`}
                      alt={m.caption}
                      className={styles.mediaImg}
                      loading="lazy"
                    />
                    <span className={styles.mediaTag}>{m.name}</span>
                  </div>
                  <div className={styles.meta}>
                    <span className={styles.idx}>{m.id} / 04</span>
                    <h3 className={styles.name}>{m.name}</h3>
                    <p className={styles.caption}>{m.caption}</p>
                    <span className={styles.status}>{m.status}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className={styles.galleryHud} aria-hidden="true">
            <span className={styles.counter}>
              <span ref={counterRef}>01</span>
              <span className={styles.counterTotal}>
                {" "}
                / {String(t.fieldTest.modules.length).padStart(2, "0")}
              </span>
            </span>
            <div className={styles.bar}>
              <div ref={barRef} className={styles.barFill} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
