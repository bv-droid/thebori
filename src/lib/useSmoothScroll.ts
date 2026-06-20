"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
// pin math must survive mobile URL-bar resize; recompute after media settles
ScrollTrigger.config({ ignoreMobileResize: true });

/* Inertial smooth scroll (Lenis) synced with GSAP ScrollTrigger.
   Disabled under prefers-reduced-motion (native scroll preserved). */
export function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    // recompute pin/trigger positions once layout, fonts and media have settled
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    const t1 = window.setTimeout(() => ScrollTrigger.refresh(), 800);
    const t2 = window.setTimeout(() => ScrollTrigger.refresh(), 2500);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
      window.removeEventListener("load", onLoad);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);
}
