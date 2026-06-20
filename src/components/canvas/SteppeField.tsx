"use client";

import { useEffect, useRef } from "react";

/* Procedural wind-driven steppe grass + drifting fog + dust.
   Canvas 2D, DPR-aware, reduced-motion safe. The "FIELD" half of the hero. */

type Blade = {
  x: number;
  h: number;
  w: number;
  phase: number;
  stiff: number;
  tone: number;
};

type Dust = { x: number; y: number; r: number; sp: number; a: number };

export function SteppeField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let blades: Blade[] = [];
    let dust: Dust[] = [];
    let raf = 0;
    let t = 0;

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.round((w / 1000) * 220) + 60;
      blades = Array.from({ length: count }, () => {
        const hh = rand(h * 0.16, h * 0.46);
        return {
          x: rand(-20, w + 20),
          h: hh,
          w: rand(1.1, 2.6),
          phase: rand(0, Math.PI * 2),
          stiff: rand(0.5, 1.1),
          tone: rand(0.16, 0.5),
        };
      });
      // far blades first (shorter), draw order by height for depth
      blades.sort((a, b) => a.h - b.h);

      dust = Array.from({ length: 34 }, () => ({
        x: rand(0, w),
        y: rand(0, h),
        r: rand(0.4, 1.6),
        sp: rand(4, 18),
        a: rand(0.04, 0.16),
      }));
    };

    const draw = (now: number) => {
      t = now / 1000;
      ctx.clearRect(0, 0, w, h);

      // slow gust envelope (0..1) modulating global wind
      const gust = 0.55 + 0.45 * Math.sin(t * 0.32) * Math.sin(t * 0.11 + 1.3);
      const wind = gust;

      // — Fog: large soft drifting blobs near horizon —
      const fogBands = 3;
      for (let i = 0; i < fogBands; i++) {
        const cx = ((t * (6 + i * 4) + i * w * 0.4) % (w + 400)) - 200;
        const cy = h * (0.42 + i * 0.12);
        const rad = w * (0.32 + i * 0.05);
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
        const a = 0.05 + i * 0.012;
        g.addColorStop(0, `rgba(170,176,178,${a})`);
        g.addColorStop(1, "rgba(170,176,178,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }

      // — Dust motes drifting on the wind —
      for (const d of dust) {
        d.x += (d.sp * (0.4 + wind)) / 60;
        d.y -= d.sp / 220;
        if (d.x > w + 10) d.x = -10;
        if (d.y < -10) d.y = h + 10;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,205,206,${d.a})`;
        ctx.fill();
      }

      // — Grass blades —
      const base = h + 6;
      for (const b of blades) {
        const sway =
          (Math.sin(t * 1.1 * b.stiff + b.phase) * 0.6 +
            Math.sin(t * 2.3 * b.stiff + b.phase * 1.7) * 0.25) *
          (10 + b.h * 0.16) *
          (0.4 + wind) /
          b.stiff;

        const tipX = b.x + sway;
        const tipY = base - b.h;
        const cpX = b.x + sway * 0.45;
        const cpY = base - b.h * 0.55;

        ctx.beginPath();
        ctx.moveTo(b.x, base);
        ctx.quadraticCurveTo(cpX, cpY, tipX, tipY);
        ctx.lineWidth = b.w;
        ctx.lineCap = "round";
        // platinum-tinted near tips, near-black at root
        const grad = ctx.createLinearGradient(b.x, base, tipX, tipY);
        grad.addColorStop(0, "rgba(12,12,10,0)");
        grad.addColorStop(0.35, `rgba(53,51,44,${b.tone})`);
        grad.addColorStop(1, `rgba(168,176,184,${b.tone * 0.7})`);
        ctx.strokeStyle = grad;
        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    };

    build();
    if (reduced) {
      draw(0);
    } else {
      raf = requestAnimationFrame(draw);
    }

    const ro = new ResizeObserver(() => {
      build();
      if (reduced) draw(0);
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className={className}
      aria-hidden="true"
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}
