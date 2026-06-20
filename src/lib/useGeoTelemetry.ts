"use client";

import { useEffect, useState } from "react";

/* Real telemetry by IP for the loading-gate HUD: city, coordinates, and ground
   elevation. ipapi.co gives lat/lon/city; open-meteo gives real elevation.
   Module-level cache + in-flight dedup → one network round-trip per session,
   shared across components. Falls back to Astana if blocked/offline. */

export type GeoTel = {
  lat: number;
  lon: number;
  city: string;
  country: string;
  altitude: number; // metres above sea level
  live: boolean; // false = fallback (offline/blocked)
};

const FALLBACK: GeoTel = {
  lat: 51.1694,
  lon: 71.4491,
  city: "ASTANA",
  country: "KZ",
  altitude: 347,
  live: false,
};

let cache: GeoTel | null = null;
let inflight: Promise<GeoTel> | null = null;

async function fetchJson(url: string, ms: number): Promise<unknown> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const r = await fetch(url, { signal: ctrl.signal });
    return await r.json();
  } finally {
    clearTimeout(t);
  }
}

/* Single shared IP lookup — country/lat/lon/city. Cached + in-flight deduped so
   BOTH the language default (LanguageProvider) and the gate telemetry reuse ONE
   ipapi.co request per session (the free tier 429s under spike). */
export type IpGeo = {
  lat: number;
  lon: number;
  city: string;
  country: string;
  live: boolean;
};
let ipCache: IpGeo | null = null;
let ipInflight: Promise<IpGeo> | null = null;

export function getIpGeo(): Promise<IpGeo> {
  if (ipCache) return Promise.resolve(ipCache);
  if (ipInflight) return ipInflight;
  ipInflight = (async () => {
    try {
      const d = (await fetchJson("https://ipapi.co/json/", 3500)) as {
        latitude?: number;
        longitude?: number;
        city?: string;
        country_code?: string;
      };
      ipCache = {
        lat: typeof d.latitude === "number" ? d.latitude : FALLBACK.lat,
        lon: typeof d.longitude === "number" ? d.longitude : FALLBACK.lon,
        city: String(d.city || FALLBACK.city).toUpperCase(),
        country: String(d.country_code || FALLBACK.country).toUpperCase(),
        live: true,
      };
    } catch {
      ipCache = {
        lat: FALLBACK.lat,
        lon: FALLBACK.lon,
        city: FALLBACK.city,
        country: FALLBACK.country,
        live: false,
      };
    }
    return ipCache;
  })();
  return ipInflight;
}

async function load(): Promise<GeoTel> {
  if (cache) return cache;
  if (inflight) return inflight;
  inflight = (async () => {
    const ip = await getIpGeo();
    let altitude = FALLBACK.altitude;
    try {
      const ed = (await fetchJson(
        `https://api.open-meteo.com/v1/elevation?latitude=${ip.lat}&longitude=${ip.lon}`,
        3000,
      )) as { elevation?: number[] };
      if (Array.isArray(ed.elevation) && typeof ed.elevation[0] === "number") {
        altitude = Math.max(0, Math.round(ed.elevation[0]));
      }
    } catch {
      /* keep fallback altitude */
    }
    cache = { ...ip, altitude };
    return cache;
  })();
  return inflight;
}

export function useGeoTelemetry(): GeoTel {
  const [geo, setGeo] = useState<GeoTel>(cache || FALLBACK);
  useEffect(() => {
    let mounted = true;
    load().then((g) => {
      if (mounted) setGeo(g);
    });
    return () => {
      mounted = false;
    };
  }, []);
  return geo;
}

/* Plausible blood-oxygen reading derived from real ground elevation — drops
   with altitude, like a real pulse-ox during mountain acclimatization. */
export function oxygenForAltitude(alt: number): number {
  return Math.max(85, Math.min(99, Math.round(99 - Math.max(0, (alt - 300) / 420))));
}

const axis = (v: number, pos: string, neg: string) =>
  `${Math.abs(v).toFixed(4)}°${v >= 0 ? pos : neg}`;

/* "51.1694°N · 71.4491°E" from the live geo (shared HUD format). */
export function formatCoords(g: GeoTel): string {
  return `${axis(g.lat, "N", "S")} · ${axis(g.lon, "E", "W")}`;
}
