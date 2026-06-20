"use client";

import { useEffect, useRef } from "react";

/* Procedural steppe wind via Web Audio — filtered noise + slow gusts.
   Asset-free placeholder until a real ambient bed is produced.
   Only ever starts after a user gesture (the sound toggle). */

type Graph = {
  ctx: AudioContext;
  master: GainNode;
  src: AudioBufferSourceNode;
  lfo: OscillatorNode;
  lfoGain: GainNode;
};

const TARGET_GAIN = 0.09;

export function useAmbientWind(active: boolean) {
  const graph = useRef<Graph | null>(null);

  useEffect(() => {
    let cancelled = false;

    const ensure = () => {
      if (graph.current) return graph.current;
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new AC();

      // 3s of brown-ish noise, looped
      const len = ctx.sampleRate * 3;
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = buf.getChannelData(0);
      let last = 0;
      for (let i = 0; i < len; i++) {
        const white = Math.random() * 2 - 1;
        last = (last + 0.02 * white) / 1.02;
        data[i] = last * 3.2;
      }

      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.loop = true;

      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 520;
      lp.Q.value = 0.7;

      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = 900;
      bp.Q.value = 0.6;

      // slow gust modulation on the bandpass gain
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.08;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.5;

      const bpGain = ctx.createGain();
      bpGain.gain.value = 0.5;
      lfo.connect(lfoGain).connect(bpGain.gain);

      const master = ctx.createGain();
      master.gain.value = 0;

      src.connect(lp).connect(master);
      src.connect(bp).connect(bpGain).connect(master);
      master.connect(ctx.destination);

      src.start();
      lfo.start();

      graph.current = { ctx, master, src, lfo, lfoGain };
      return graph.current;
    };

    if (active) {
      const g = ensure();
      g.ctx.resume().catch(() => {});
      const now = g.ctx.currentTime;
      g.master.gain.cancelScheduledValues(now);
      g.master.gain.setValueAtTime(g.master.gain.value, now);
      g.master.gain.linearRampToValueAtTime(TARGET_GAIN, now + 1.6);
    } else if (graph.current) {
      const g = graph.current;
      const now = g.ctx.currentTime;
      g.master.gain.cancelScheduledValues(now);
      g.master.gain.setValueAtTime(g.master.gain.value, now);
      g.master.gain.linearRampToValueAtTime(0, now + 0.8);
    }

    return () => {
      cancelled = true;
      void cancelled;
    };
  }, [active]);

  // teardown on unmount
  useEffect(() => {
    return () => {
      const g = graph.current;
      if (g) {
        try {
          g.src.stop();
          g.lfo.stop();
          g.ctx.close();
        } catch {
          /* noop */
        }
        graph.current = null;
      }
    };
  }, []);
}
