/* Premium backdrop for the "Войди в первый состав" (waitlist) section.
   Drop the generated file into /public/waitlist/ and flip `enabled`.
   While disabled, the section keeps its plain dark gradient. */

export const waitlistMedia = {
  enabled: true, // steppe paw-trail backdrop
  type: "video" as "image" | "video",
  image: "/waitlist/join-bg.jpg", // fallback still
  video: "/waitlist/join-bg.mp4",
  poster: "/waitlist/join-poster.jpg", // video first frame
} as const;
