/* Hero media slot. Drop generated files into /public/hero/ and flip `enabled`.
   While disabled, the hero runs on the in-code environment (blueprint + canvas). */

export const heroMedia = {
  enabled: true,
  film: {
    desktop: "/hero/hero-film_16x9.mp4",
    // no dedicated 9:16 export yet — 16:9 cover-crops acceptably on mobile
    mobile: "/hero/hero-film_16x9.mp4",
  },
  poster: {
    desktop: "/hero/hero-poster_16x9.jpg",
    mobile: "/hero/hero-poster_9x16.jpg",
  },
} as const;
