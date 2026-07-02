"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useI18n } from "@/i18n/LanguageProvider";
import { collection } from "@/config/collection";
import styles from "./Collection.module.css";

gsap.registerPlugin(ScrollTrigger);

/* SERIES 01 · КӨШ — the four colorways as cinematic cards, each tied to a
   territory (City / Road / Field). The pack moves across the steppe. */
export function Collection() {
  const { t } = useI18n();
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.to("[data-reveal]", {
        scrollTrigger: { trigger: root.current, start: "top 72%" },
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.1,
      });
    }, root);
    return () => ctx.revert();
  }, [t]);

  return (
    <section ref={root} className={styles.collection} id="collection">
      <div className={styles.head}>
        <span className={`${styles.kicker} ${styles.reveal}`} data-reveal>
          {t.collection.kicker}
        </span>
        <h2 className={`${styles.title} ${styles.reveal}`} data-reveal>
          {t.collection.title}
        </h2>
        <p className={`${styles.lead} ${styles.reveal}`} data-reveal>
          {t.collection.lead}
        </p>
      </div>

      <div className={styles.grid}>
        {t.collection.items.map((it, i) => {
          const media = collection[i];
          const coming = media?.coming ?? true;
          return (
            <article
              key={it.latin}
              className={`${styles.card} ${styles.reveal} ${coming ? styles.cardSoon : ""}`}
              data-reveal
            >
              <div className={styles.media}>
                {coming ? (
                  <>
                    <div className={styles.placeholder} aria-hidden="true" />
                    <span className={styles.soon}>{t.collection.soon}</span>
                  </>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    className={styles.img}
                    src={media.image}
                    alt={`BØRI ${it.latin} — ${it.territory}`}
                    loading="lazy"
                  />
                )}
                <span className={styles.terr}>{it.territory}</span>
              </div>
              <div className={styles.meta}>
                <span className={styles.name}>{it.name}</span>
                <span className={styles.latin}>{it.latin}</span>
                <span className={styles.desc}>{it.desc}</span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
