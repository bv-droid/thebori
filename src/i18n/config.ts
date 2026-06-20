export const locales = ["ru", "en", "kz"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ru";

export const localeLabels: Record<Locale, string> = {
  kz: "KZ",
  ru: "RU",
  en: "EN",
};
