import type { Metadata, Viewport } from "next";
import { fontVars } from "@/lib/fonts";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import { siteConfig, sameAs } from "@/config/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "BØRI — Сила внутри",
    template: "%s · BØRI",
  },
  description: siteConfig.description,
  applicationName: "BØRI",
  keywords: [
    "BØRI",
    "БӨРІ",
    "BORI",
    "одежда Казахстан",
    "функциональная одежда",
    "premium apparel Kazakhstan",
    "STEPPE PROTOCOL",
    "KÖKBÖRI",
    "Astana",
  ],
  authors: [{ name: "BØRI" }],
  creator: "BØRI",
  publisher: "BØRI",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "BØRI",
    title: "BØRI — Сила внутри",
    description: siteConfig.description,
    url: siteConfig.url,
    locale: "ru_RU",
    alternateLocale: ["en_US", "kk_KZ"],
  },
  twitter: {
    card: "summary_large_image",
    title: "BØRI — Сила внутри",
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  other: { "color-scheme": "dark" },
};

export const viewport: Viewport = {
  themeColor: "#0c0c0a",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  alternateName: [siteConfig.altName, "BORI"],
  url: siteConfig.url,
  logo: `${siteConfig.url}/brand/paw-fill.svg`,
  description: siteConfig.description,
  slogan: siteConfig.tagline,
  areaServed: "KZ",
  address: {
    "@type": "PostalAddress",
    addressCountry: "KZ",
    addressLocality: siteConfig.city,
  },
  ...(sameAs.length ? { sameAs } : {}),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={fontVars}>
      <body>
        <script
          type="application/ld+json"
          // server-rendered structured data for rich results
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
