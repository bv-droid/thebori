"use client";

import { Component, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { BoriPaw } from "@/components/brand/Logo";

/* Lazy + resilient 3D logo: defers the Three.js/R3F chunk (~323KB) off the
   first paint and degrades to the 2D BØRI paw while it loads OR if WebGL fails
   (low-end devices) — instead of blanking the loading gate. Drop-in for PawLogo3D. */

function Fallback2D() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "grid",
        placeItems: "center",
        color: "#a8b0b8",
      }}
      aria-hidden="true"
    >
      <BoriPaw size={150} title="" />
    </div>
  );
}

const PawLogo3DDyn = dynamic(
  () => import("./PawLogo3D").then((m) => ({ default: m.PawLogo3D })),
  { ssr: false, loading: () => <Fallback2D /> },
);

class WebglBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <Fallback2D /> : this.props.children;
  }
}

export function PawLogo3DLazy(props: {
  progress?: number;
  reduced?: boolean;
  className?: string;
}) {
  return (
    <WebglBoundary>
      <PawLogo3DDyn {...props} />
    </WebglBoundary>
  );
}
