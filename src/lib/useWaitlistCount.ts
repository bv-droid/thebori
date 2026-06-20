"use client";

import { useEffect, useState } from "react";
import { waitlistConfig } from "@/config/waitlist";

/* Live founding-member count from GetWaitlist (statistics.total_signups) for the
   scarcity counter. Cached + in-flight deduped; public read, no key. */

export const FOUNDING_CAP = 500;
// head-start seed added to the live signup count for social proof
// (keeps the counter at 38 after the two QA test leads are removed)
export const FOUNDING_SEED = 38;

let cache: number | null = null;
let inflight: Promise<number> | null = null;

async function loadCount(): Promise<number> {
  if (cache != null) return cache;
  if (inflight) return inflight;
  inflight = (async () => {
    try {
      if (!waitlistConfig.waitlistId) {
        cache = 0;
        return 0;
      }
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 4000);
      const r = await fetch(
        `${waitlistConfig.apiBase}/waitlist/${waitlistConfig.waitlistId}`,
        { signal: ctrl.signal },
      );
      clearTimeout(t);
      const d = (await r.json()) as {
        statistics?: { total_signups?: number; current_signups?: number };
      };
      const n = d?.statistics?.total_signups;
      cache = typeof n === "number" ? n : 0;
      return cache;
    } catch {
      cache = 0;
      return 0;
    }
  })();
  return inflight;
}

export function useWaitlistCount(): { count: number | null; cap: number } {
  const seeded = (n: number) => Math.min(FOUNDING_CAP, n + FOUNDING_SEED);
  const [count, setCount] = useState<number | null>(
    cache == null ? null : seeded(cache),
  );
  useEffect(() => {
    let mounted = true;
    loadCount().then((n) => {
      if (mounted) setCount(seeded(n));
    });
    return () => {
      mounted = false;
    };
  }, []);
  return { count, cap: FOUNDING_CAP };
}
