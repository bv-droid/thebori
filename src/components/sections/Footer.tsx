"use client";

import { Logo } from "@/components/brand/Logo";
import { LanguageSwitch } from "@/components/ui/LanguageSwitch";
import { useGeoTelemetry, formatCoords } from "@/lib/useGeoTelemetry";
import { useI18n } from "@/i18n/LanguageProvider";
import styles from "./Footer.module.css";

// NOTE: social links are placeholders — replace href="#" with the real
// Instagram / Telegram URLs before launch. TODO(brand-socials)
const SOCIALS = [
  { label: "Instagram", href: "#" },
  { label: "Telegram", href: "#" },
];

export function Footer() {
  const { t } = useI18n();
  const geo = useGeoTelemetry();

  const links = [
    { href: "#territories", label: t.nav.territories },
    { href: "#field-test", label: t.nav.fieldTest },
    { href: "#founding-pack", label: t.nav.foundingPack },
    { href: "#join", label: t.nav.join },
  ];

  return (
    <footer className={styles.footer} id="footer">
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.top}>
        <p className={styles.statement}>{t.footer.statement}</p>
        <a className={styles.cta} href="#join">
          {t.hero.cta}
          <span className={styles.ctaArrow} aria-hidden="true">
            ↗
          </span>
        </a>
      </div>

      <div className={styles.cols}>
        <div className={styles.brandCol}>
          <Logo size={34} showWordmark />
          <span className={styles.coords}>{formatCoords(geo)}</span>
          <span className={styles.loc}>{t.footer.location}</span>
        </div>

        <nav className={styles.col} aria-label={t.footer.navTitle}>
          <span className={styles.colTitle}>{t.footer.navTitle}</span>
          {links.map((l) => (
            <a key={l.href} className={styles.colLink} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className={styles.col}>
          <span className={styles.colTitle}>{t.footer.followTitle}</span>
          {SOCIALS.map((s) => {
            const live = s.href !== "#";
            return (
              <a
                key={s.label}
                className={styles.colLink}
                // placeholder links render inert (no jump-to-top) until real URLs land
                href={live ? s.href : undefined}
                target={live ? "_blank" : undefined}
                rel={live ? "noopener noreferrer" : undefined}
              >
                {s.label}
              </a>
            );
          })}
        </div>

        <div className={styles.langCol}>
          <span className={styles.colTitle}>{t.footer.connectTitle}</span>
          <LanguageSwitch className={styles.lang} />
        </div>
      </div>

      <div className={styles.bottom}>
        <span className={styles.rights}>{t.footer.rights}</span>
        <span className={styles.proto}>STEPPE PROTOCOL</span>
        <a className={styles.toTop} href="#hero">
          {t.footer.backToTop}
          <span aria-hidden="true"> ↑</span>
        </a>
      </div>

      <div className={styles.watermark} aria-hidden="true">
        BØRI
      </div>
    </footer>
  );
}
