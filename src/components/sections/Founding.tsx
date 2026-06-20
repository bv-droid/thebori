"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PackCard } from "@/components/brand/PackCard";
import { FoundingCounter } from "@/components/sections/FoundingCounter";
import { useI18n } from "@/i18n/LanguageProvider";
import styles from "./Founding.module.css";

gsap.registerPlugin(ScrollTrigger);

export function Founding() {
  const { t } = useI18n();
  const root = useRef<HTMLElement>(null);
  const cardRevealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const card = cardRevealRef.current;
    const ctx = gsap.context(() => {
      gsap.to("[data-reveal]", {
        scrollTrigger: { trigger: root.current, start: "top 65%" },
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.1,
      });

      // the Pack ID card materialises THROUGH a growing BØRI-paw aperture as
      // the section scrolls in — reusing the Hero→film logo-portal language
      if (card) {
        const REVEAL = 0.9;
        const startSize = 96;
        const ease = gsap.parseEase("power1.out");
        // end ≈ 2.4× the card so the solid pad fully covers the (larger) card
        // while keeping the paw silhouette card-sized through the reveal
        const endSize = () =>
          Math.ceil(Math.min(560, card.getBoundingClientRect().width) * 2.4);
        const apply = (p: number) => {
          if (p >= REVEAL) {
            card.classList.remove(styles.cardPortal);
            card.style.removeProperty("mask-size");
            card.style.removeProperty("-webkit-mask-size");
            return;
          }
          if (!card.classList.contains(styles.cardPortal))
            card.classList.add(styles.cardPortal);
          const e = ease(p / REVEAL);
          const size = startSize + (endSize() - startSize) * e;
          card.style.maskSize = `${size}px auto`;
          (card.style as unknown as { webkitMaskSize: string }).webkitMaskSize = `${size}px auto`;
        };
        ScrollTrigger.create({
          trigger: root.current,
          start: "top 78%",
          end: "top 30%",
          scrub: 0.8,
          onUpdate: (self) => apply(self.progress),
        });
        apply(0);
      }
    }, root);
    return () => ctx.revert();
  }, [t]);

  return (
    <section ref={root} className={styles.founding} id="founding-pack">
      <div className={styles.inner}>
        <div className={styles.text}>
          <span className={`${styles.kicker} ${styles.reveal}`} data-reveal>
            {t.founding.kicker}
          </span>
          <h2 className={`${styles.title} ${styles.reveal}`} data-reveal>
            {t.founding.title}
          </h2>
          <p className={`${styles.lead} ${styles.reveal}`} data-reveal>
            {t.founding.lead}
          </p>
          <ul className={`${styles.benefits} ${styles.reveal}`} data-reveal>
            {t.founding.benefits.map((b) => (
              <li key={b} className={styles.benefit}>
                {b}
              </li>
            ))}
          </ul>
          <span className={`${styles.note} ${styles.reveal}`} data-reveal>
            {t.founding.note}
          </span>
        </div>

        <div className={styles.cardCol}>
          <div ref={cardRevealRef} className={styles.cardReveal}>
            <PackCard
              packId="KZ-AST-000184"
              label={t.founding.cardLabel}
              status={t.founding.cardStatus}
              micro="STEPPE PROTOCOL · FOUNDING SERIES · АСТАНА"
            />
          </div>
          <FoundingCounter />
        </div>
      </div>
    </section>
  );
}
