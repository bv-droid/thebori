import { Oswald, Inter, JetBrains_Mono } from "next/font/google";

// NOTE: "cyrillic-ext" is REQUIRED for Kazakh letters (ә ғ қ ң ө ұ ү һ і and
// their caps) — they live in that Unicode subset; without it they fall back to
// a system font and visually "break out" of the brand type.

// Display — brand wordmark family (canon: BØRI is set in Oswald)
export const displayFont = Oswald({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-display",
  display: "swap",
});

// Body — full Russian + Kazakh Cyrillic coverage
export const bodyFont = Inter({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-body",
  display: "swap",
});

// Technical microcopy / system labels
export const monoFont = JetBrains_Mono({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-mono",
  display: "swap",
});

export const fontVars = `${displayFont.variable} ${bodyFont.variable} ${monoFont.variable}`;
