/* First-touch attribution: capture UTM + inbound referral from the landing URL
   into sessionStorage so signups can be attributed by channel and credited to
   the referrer (the cheapest growth lever). First touch wins for the session. */

const KEY = "bori.attribution.v1";

export type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  ref?: string;
  landing?: string;
  referrer?: string;
};

export function captureAttribution() {
  if (typeof window === "undefined") return;
  try {
    if (sessionStorage.getItem(KEY)) return; // first-touch wins
    const p = new URLSearchParams(window.location.search);
    const a: Attribution = {};
    (["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const).forEach(
      (k) => {
        const v = p.get(k);
        if (v) a[k] = v;
      },
    );
    const ref = p.get("ref") || p.get("ref_id") || p.get("r");
    if (ref) a.ref = ref;
    a.landing = window.location.pathname + window.location.search;
    a.referrer = document.referrer || "";
    sessionStorage.setItem(KEY, JSON.stringify(a));
  } catch {
    /* storage blocked */
  }
}

export function getAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(sessionStorage.getItem(KEY) || "{}") as Attribution;
  } catch {
    return {};
  }
}
