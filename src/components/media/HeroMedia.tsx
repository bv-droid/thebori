"use client";

import { useEffect, useRef, useState } from "react";
import { heroMedia } from "@/config/heroMedia";

/* Background hero film with poster fallback. Picks desktop/mobile source,
   shows a still in reduced-motion, and hides itself if the file 404s so the
   in-code environment remains visible. */

export function HeroMedia({ className }: { className?: string }) {
  const [mobile, setMobile] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [failed, setFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 760px)");
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setMobile(mq.matches);
      setReduced(rm.matches);
    };
    sync();
    mq.addEventListener("change", sync);
    rm.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      rm.removeEventListener("change", sync);
    };
  }, []);

  if (!heroMedia.enabled || failed) return null;

  const film = mobile ? heroMedia.film.mobile : heroMedia.film.desktop;
  const poster = mobile ? heroMedia.poster.mobile : heroMedia.poster.desktop;

  if (reduced) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        className={className}
        src={poster}
        alt=""
        aria-hidden="true"
        onError={() => setFailed(true)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    );
  }

  return (
    <video
      ref={videoRef}
      className={className}
      autoPlay
      muted
      loop
      playsInline
      poster={poster}
      aria-hidden="true"
      onError={() => setFailed(true)}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    >
      <source src={film} type="video/mp4" />
    </video>
  );
}
