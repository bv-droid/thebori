"use client";

import { useEffect, useRef } from "react";
import { audioConfig } from "@/config/audio";
import { useAmbientWind } from "./useAmbientWind";

/* Signature sound = the brand "feature": entering the protocol launches sound.
   Two layers: the cinematic THEME plays once on entry, then crossfades into a
   steady AMBIENT bed that loops seamlessly under the whole scroll. Falls back to
   procedural steppe wind when no track is configured. Controlled by `active`. */

export function useSignatureSound(active: boolean) {
  const hasTrack = audioConfig.hasTrack;

  // wind fallback — only when there is NO music track
  useAmbientWind(!hasTrack && active);

  const themeRef = useRef<HTMLAudioElement | null>(null);
  const ambientRef = useRef<HTMLAudioElement | null>(null);
  const fades = useRef<Map<HTMLAudioElement, number>>(new Map());
  const handedOff = useRef(false);

  useEffect(() => {
    if (!hasTrack) return;

    const fadeTo = (a: HTMLAudioElement, target: number, ms: number) => {
      const prev = fades.current.get(a);
      if (prev) cancelAnimationFrame(prev);
      const start = a.volume;
      const t0 = performance.now();
      const step = (now: number) => {
        const k = Math.min(1, (now - t0) / ms);
        a.volume = Math.max(0, Math.min(1, start + (target - start) * k));
        if (k < 1) fades.current.set(a, requestAnimationFrame(step));
        else fades.current.delete(a);
      };
      fades.current.set(a, requestAnimationFrame(step));
    };

    if (!themeRef.current) {
      const theme = new Audio(audioConfig.theme);
      theme.loop = false;
      theme.volume = 0;
      theme.preload = "auto";
      themeRef.current = theme;

      const ambient = new Audio(audioConfig.ambient);
      ambient.loop = true;
      ambient.volume = 0;
      ambient.preload = "auto";
      ambientRef.current = ambient;

      // hand the theme off to the looping bed near its end (single crossfade)
      const handoff = () => {
        if (handedOff.current) return;
        handedOff.current = true;
        fadeTo(theme, 0, audioConfig.crossfadeTail * 1000);
        fadeTo(ambient, audioConfig.ambientVolume, audioConfig.crossfadeTail * 1000);
      };
      theme.addEventListener("timeupdate", () => {
        const d = theme.duration;
        if (d && theme.currentTime >= d - audioConfig.crossfadeTail) handoff();
      });
      theme.addEventListener("ended", handoff);
    }

    const theme = themeRef.current;
    const ambient = ambientRef.current!;

    if (active) {
      // bed runs (silent) from the start so the crossfade + loop are seamless
      ambient.play().catch(() => {});
      if (handedOff.current) {
        fadeTo(ambient, audioConfig.ambientVolume, 1200);
      } else {
        theme.play().catch(() => {
          /* blocked until a user gesture — the nav sound toggle will start it */
        });
        fadeTo(theme, audioConfig.themeVolume, 1800);
      }
    } else {
      fadeTo(theme, 0, 700);
      fadeTo(ambient, 0, 700);
      const id = window.setTimeout(() => {
        theme.pause();
        ambient.pause();
      }, 760);
      return () => window.clearTimeout(id);
    }
  }, [active, hasTrack]);

  useEffect(() => {
    return () => {
      fades.current.forEach((id) => cancelAnimationFrame(id));
      themeRef.current?.pause();
      ambientRef.current?.pause();
    };
  }, []);
}
