/* Single source of truth for canonical URL + brand identity used by metadata,
   OG image, robots, sitemap, JSON-LD. Override the URL per-environment with
   NEXT_PUBLIC_SITE_URL (e.g. the production domain) without touching code. */

export const siteConfig = {
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://thebori.com").replace(/\/$/, ""),
  name: "BØRI",
  altName: "БӨРІ",
  legalName: "BØRI",
  tagline: "Сила внутри",
  description:
    "BØRI — казахстанский бренд функциональной одежды для движения через город, дорогу и поле. Присоединись к стае.",
  descriptionEn:
    "BØRI — functional apparel from Kazakhstan for moving through city, road and field. Join the pack.",
  locale: "ru_RU",
  country: "KZ",
  city: "Astana",
  // fill these once the real accounts are live (also used for JSON-LD sameAs)
  social: {
    instagram: "",
    telegram: "",
  },
} as const;

export const sameAs = Object.values(siteConfig.social).filter(Boolean);
