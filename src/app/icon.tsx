import { ImageResponse } from "next/og";
import { PAW_PATHS } from "@/components/brand/Logo";

export const size = { width: 256, height: 256 };
export const contentType = "image/png";

export default function Icon() {
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
          alignItems: "center",
          justifyContent: "center",
          background: "#0c0c0a",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={pawSrc} width={176} height={181} alt="" />
      </div>
    ),
    { ...size },
  );
}
