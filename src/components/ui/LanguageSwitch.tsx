"use client";

import { useI18n } from "@/i18n/LanguageProvider";
import { locales, localeLabels } from "@/i18n/config";
import styles from "./LanguageSwitch.module.css";

export function LanguageSwitch({ className }: { className?: string }) {
  const { locale, setLocale } = useI18n();
  return (
    <div className={`${styles.langs} ${className ?? ""}`}>
      {locales.map((l, i) => (
        <span key={l} style={{ display: "inline-flex", alignItems: "center" }}>
          <button
            type="button"
            className={`${styles.lang} ${l === locale ? styles.active : ""}`}
            onClick={() => setLocale(l)}
            aria-current={l === locale ? "true" : undefined}
          >
            {localeLabels[l]}
          </button>
          {i < locales.length - 1 && <span className={styles.sep}>/</span>}
        </span>
      ))}
    </div>
  );
}
