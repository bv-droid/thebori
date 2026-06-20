"use client";

import { useEffect, useState } from "react";
import { SignalGate } from "@/components/signal/SignalGate";
import { TopNav } from "@/components/ui/TopNav";
import { Hero } from "@/components/sections/Hero";
import { TheJourney } from "@/components/sections/RoadJourney";
import { FieldTest } from "@/components/sections/FieldTest";
import { Founding } from "@/components/sections/Founding";
import { Waitlist } from "@/components/sections/Waitlist";
import { Footer } from "@/components/sections/Footer";
import { CursorPaw } from "@/components/cursor/CursorPaw";
import { CookieConsent } from "@/components/ui/CookieConsent";
import { captureAttribution } from "@/lib/attribution";
import { useSignatureSound } from "@/lib/useSignatureSound";
import { useSmoothScroll } from "@/lib/useSmoothScroll";

export function Experience() {
  const [entered, setEntered] = useState(false);
  const [soundOn, setSoundOn] = useState(false);

  // capture UTM + inbound ?ref (first-touch) for attribution + referral credit
  useEffect(() => captureAttribution(), []);

  // Apple-class inertial scroll + GSAP sync
  useSmoothScroll();
  // Signature feature: entering the protocol launches the sound.
  useSignatureSound(soundOn);

  const handleEnter = (withSound: boolean) => {
    setEntered(true);
    setSoundOn(withSound);
  };

  return (
    <>
      <CursorPaw />
      {!entered && <SignalGate onEnter={handleEnter} />}
      {entered && (
        <TopNav soundOn={soundOn} onToggleSound={() => setSoundOn((s) => !s)} />
      )}
      {entered && <CookieConsent />}

      <Hero play={entered} />

      {/* 02 — The Journey: one continuous film CITY→ROAD→FIELD,
          with the Manifesto revealed over the FIELD third */}
      <TheJourney />

      {/* 03 — Field Test Program */}
      <FieldTest />

      {/* 04 — Founding Pack (Pack ID card) */}
      <Founding />

      {/* 05 — Waitlist (join the pack) */}
      <Waitlist />

      {/* 06 — Footer */}
      <Footer />
    </>
  );
}
