/* Minimal first-party cookie/consent state. No third-party vendor, no external
   calls — privacy-first, fits the brand. Gate any future analytics/pixels on
   `hasAnalyticsConsent()` so nothing non-essential loads without opt-in. */

export type Consent = "all" | "essential";
const KEY = "bori.consent.v1";
export const CONSENT_EVENT = "bori:consent";

export function getConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(KEY);
  return v === "all" || v === "essential" ? v : null;
}

export function setConsent(c: Consent) {
  try {
    window.localStorage.setItem(KEY, c);
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: c }));
  } catch {
    /* storage blocked */
  }
}

export function hasAnalyticsConsent(): boolean {
  return getConsent() === "all";
}
