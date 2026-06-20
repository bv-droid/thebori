"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { defaultLocale, locales, type Locale } from "./config";
import { dictionaries, type Dict } from "./dictionaries";
import { getIpGeo } from "@/lib/useGeoTelemetry";

type Ctx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Dict;
};

const LanguageContext = createContext<Ctx | null>(null);
const STORAGE_KEY = "bori.locale";

function applyHtmlLang(l: Locale) {
  document.documentElement.lang = l === "kz" ? "kk" : l;
}

// Base language by country. KZ copy is still draft → KZ/CIS default to RU for now;
// rest of the world → EN. (Switch KZ→"kz" once Kazakh copy is reviewed.)
const RU_COUNTRIES = new Set(["KZ", "RU", "BY", "KG", "UZ", "TJ", "TM", "UA", "AM", "AZ", "MD", "GE"]);
function countryToLocale(cc?: string): Locale {
  if (!cc) return defaultLocale;
  return RU_COUNTRIES.has(cc.toUpperCase()) ? "ru" : "en";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  // Hydrate: saved choice wins; otherwise detect base language by IP.
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (saved && locales.includes(saved)) {
      applyHtmlLang(saved);
      setLocaleState(saved);
      return;
    }
    let cancelled = false;
    // shared single IP lookup (also used by the gate telemetry) → one request
    getIpGeo()
      .then((g) => {
        if (cancelled) return;
        const detected = countryToLocale(g.country);
        applyHtmlLang(detected);
        setLocaleState(detected); // base default — not persisted until user picks
      })
      .catch(() => {
        /* offline / blocked → keep default */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    window.localStorage.setItem(STORAGE_KEY, l);
    document.documentElement.lang = l === "kz" ? "kk" : l;
  }, []);

  const value = useMemo<Ctx>(
    () => ({ locale, setLocale, t: dictionaries[locale] }),
    [locale, setLocale],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useI18n must be used within LanguageProvider");
  return ctx;
}
