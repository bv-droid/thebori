/* Premium backdrop for the "Войди в первый состав" (waitlist) section.
   Drop the generated file into /public/waitlist/ and flip `enabled`.
   While disabled, the section keeps its plain dark gradient. */

export const waitlistMedia = {
  enabled: true, // steppe paw-trail backdrop (image mode)
  type: "image" as "image" | "video",
  image: "/waitlist/join-bg.jpg", // dusk steppe + wolf paw trail
  video: "/waitlist/join-bg.mp4", // parked — switch type to "video" to use
  poster: "/waitlist/join-poster.jpg",
} as const;
