"use client";

import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { LanguageSwitch } from "@/components/ui/LanguageSwitch";
import { useI18n } from "@/i18n/LanguageProvider";
import styles from "./TopNav.module.css";

export function TopNav({
  soundOn,
  onToggleSound,
}: {
  soundOn: boolean;
  onToggleSound: () => void;
}) {
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const firstRun = useRef(true);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) closeRef.current?.focus();
    else if (!firstRun.current) burgerRef.current?.focus();
    firstRun.current = false;
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const links = [
    { href: "#territories", label: t.nav.territories },
    { href: "#field-test", label: t.nav.fieldTest },
    { href: "#founding-pack", label: t.nav.foundingPack },
    { href: "#join", label: t.nav.join },
  ];

  const Sound = (
    <button
      type="button"
      className={`${styles.sound} ${soundOn ? styles.soundOn : ""}`}
      onClick={onToggleSound}
      aria-pressed={soundOn}
    >
      <span className={styles.bars} aria-hidden="true">
        <i /><i /><i /><i />
      </span>
      {soundOn ? t.sound.on : t.sound.off}
    </button>
  );

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}>
        <a
          className={`${styles.brand} ${scrolled ? styles.brandShow : styles.brandHide}`}
          href="#hero"
          aria-label="BØRI"
        >
          <Logo size={30} showWordmark />
        </a>

        <div className={styles.links}>
          {links.map((l) => (
            <a key={l.href} className={styles.link} href={l.href}>
              {l.label}
            </a>
          ))}
        </div>

        <div className={styles.right}>
          <div className={styles.desktopActions}>{Sound}</div>
          <button
            ref={burgerRef}
            type="button"
            className={styles.burger}
            aria-label="Menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(true)}
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {open && (
        <div
          id="mobile-menu"
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-label="BØRI"
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
          }}
        >
          <div className={styles.overlayHead}>
            <Logo size={30} showWordmark />
            <button
              ref={closeRef}
              type="button"
              className={styles.close}
              aria-label="Close"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
          </div>

          <nav className={styles.overlayLinks}>
            {links.map((l) => (
              <a
                key={l.href}
                className={styles.overlayLink}
                href={l.href}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className={styles.overlayFooter}>
            <LanguageSwitch />
            {Sound}
          </div>
        </div>
      )}
    </>
  );
}
