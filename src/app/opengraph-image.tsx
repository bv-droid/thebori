import { ImageResponse } from "next/og";
import { PAW_PATHS } from "@/components/brand/Logo";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "BØRI — STEPPE PROTOCOL";

export default function OpengraphImage() {
  const paw = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 395 407"><path fill="#cdd2d6" fill-rule="evenodd" d="${PAW_PATHS.join(
    " ",
  )}"/></svg>`;
  const pawSrc = `data:image/svg+xml;utf8,${encodeURIComponent(paw)}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          background:
            "radial-gradient(120% 100% at 50% 28%, #46443e 0%, #26241f 46%, #0c0c0a 100%)",
          color: "#e9e7e1",
          fontFamily: "sans-serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={pawSrc} width={158} height={163} alt="" />
        <div style={{ fontSize: 132, fontWeight: 800, letterSpacing: 6, display: "flex" }}>
          BØRI
        </div>
        <div style={{ fontSize: 30, letterSpacing: 16, color: "#a8b0b8", display: "flex" }}>
          STEPPE PROTOCOL
        </div>
        <div style={{ fontSize: 26, letterSpacing: 4, color: "#9a988f", display: "flex" }}>
          FUNCTIONAL APPAREL · KAZAKHSTAN
        </div>
      </div>
    ),
    { ...size },
  );
}
