"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/LanguageProvider";
import { getConsent, setConsent, type Consent } from "@/lib/consent";
import styles from "./CookieConsent.module.css";

/* First-party, brand-styled consent. Appears once (after entry), stores the
   choice locally, and gates any future analytics via lib/consent. */
export function CookieConsent() {
  const { t } = useI18n();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (getConsent()) return;
    const id = window.setTimeout(() => setShow(true), 900);
    return () => window.clearTimeout(id);
  }, []);

  if (!show) return null;

  const choose = (c: Consent) => {
    setConsent(c);
    setShow(false);
  };

  return (
    <div className={styles.bar} role="dialog" aria-label={t.cookies.text}>
      <p className={styles.text}>
        <span className={styles.dot} aria-hidden="true" />
        <span>
          {t.cookies.text}{" "}
          <a
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.learn}
          >
            {t.cookies.learn}
          </a>
        </span>
      </p>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.ghost}
          onClick={() => choose("essential")}
        >
          {t.cookies.essential}
        </button>
        <button
          type="button"
          className={styles.accept}
          onClick={() => choose("all")}
        >
          {t.cookies.accept}
        </button>
      </div>
    </div>
  );
}
