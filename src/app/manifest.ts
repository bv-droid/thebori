import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BØRI — STEPPE PROTOCOL",
    short_name: "BØRI",
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0c0c0a",
    theme_color: "#0c0c0a",
    icons: [
      { src: "/icon", sizes: "256x256", type: "image/png", purpose: "any" },
    ],
  };
}
