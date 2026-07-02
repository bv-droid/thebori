"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useI18n } from "@/i18n/LanguageProvider";
import { collection } from "@/config/collection";
import styles from "./Collection.module.css";

gsap.registerPlugin(ScrollTrigger);

/* SERIES 01 · КӨШ — pinned cinematic walk through the colorways. Each fills the
   screen; the next blooms in THROUGH a growing BØRI-paw aperture. Reduced-motion
   and mobile fall back to flowing full-viewport panels (no pin). */
export function Collection() {
  const { t } = useI18n();
  const root = useRef<HTMLElement>(null);
  const medias = useRef<(HTMLDivElement | null)[]>([]);
  const captions = useRef<(HTMLDivElement | null)[]>([]);
  const dots = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const section = root.current;
    if (!section) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 760px)").matches;
    if (reduced || mobile) return; // CSS fallback = flowing full-viewport panels

    const N = medias.current.length;
    section.style.setProperty("--slides", String(N));
    section.classList.add(styles.pinned);

    const bloom = gsap.parseEase("power2.out");
    const START = 40;
    const endSize = () => Math.ceil(Math.hypot(window.innerWidth, window.innerHeight) * 6);

    const update = (p: number) => {
      const pos = p * (N - 1);
      const cur = Math.min(N - 2, Math.floor(pos));
      const frac = pos - cur;
      medias.current.forEach((m, i) => {
        if (!m) return;
        if (i <= cur) {
          m.style.opacity = "1";
          m.classList.remove(styles.wipe);
          m.style.removeProperty("mask-size");
          m.style.removeProperty("-webkit-mask-size");
        } else if (i === cur + 1) {
          if (frac < 0.015) {
            m.style.opacity = "0";
            m.classList.remove(styles.wipe);
          } else {
            m.style.opacity = "1";
            m.classList.add(styles.wipe);
            const size = START + (endSize() - START) * bloom(frac);
            m.style.setProperty("mask-size", `${size}px`);
            m.style.setProperty("-webkit-mask-size", `${size}px`);
          }
        } else {
          m.style.opacity = "0";
        }
      });
      captions.current.forEach((c, i) => {
        if (c) c.style.opacity = String(Math.max(0, Math.min(1, 1 - Math.abs(i - pos) * 1.7)));
      });
      const act = Math.round(pos);
      dots.current.forEach((d, i) => d?.classList.toggle(styles.dotOn, i === act));
    };

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      onUpdate: (self) => update(self.progress),
    });
    update(0);

    return () => {
      st.kill();
      section.classList.remove(styles.pinned);
      section.style.removeProperty("--slides");
    };
  }, [t]);

  return (
    <section ref={root} className={styles.collection} id="collection">
      <div className={styles.sticky}>
        <div className={styles.grid} aria-hidden="true" />

        {t.collection.items.map((it, i) => {
          const media = collection[i];
          const coming = media?.coming ?? true;
          return (
            <article key={it.latin} className={styles.panel}>
              <div
                ref={(el) => {
                  medias.current[i] = el;
                }}
                className={`${styles.media} ${coming ? styles.soonMedia : ""}`}
              >
                {coming ? (
                  <span className={styles.soonTag}>{t.collection.soon}</span>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    className={styles.img}
                    src={media.image}
                    alt={`BØRI ${it.latin} — ${it.territory}`}
                  />
                )}
              </div>
              <div
                ref={(el) => {
                  captions.current[i] = el;
                }}
                className={styles.caption}
              >
                <span className={styles.terr}>{it.territory}</span>
                <span className={styles.name}>{it.name}</span>
                <span className={styles.row}>
                  <span className={styles.latin}>{it.latin}</span>
                  <span className={styles.desc}>{it.desc}</span>
                </span>
              </div>
            </article>
          );
        })}

        <span className={styles.kicker}>{t.collection.kicker}</span>
        <div className={styles.pager} aria-hidden="true">
          {t.collection.items.map((it, i) => (
            <span
              key={it.latin}
              ref={(el) => {
                dots.current[i] = el;
              }}
              className={styles.dot}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
          ))}
        </div>

        <div className={styles.grain} aria-hidden="true" />
      </div>
    </section>
  );
}
