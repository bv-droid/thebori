/* Premium backdrop for the "Войди в первый состав" (waitlist) section.
   Drop the generated file into /public/waitlist/ and flip `enabled`.
   While disabled, the section keeps its plain dark gradient. */

export const waitlistMedia = {
  enabled: true, // steppe paw-trail backdrop (video to follow later)
  type: "image" as "image" | "video",
  image: "/waitlist/join-bg.jpg",
  video: "/waitlist/join-bg.mp4",
  poster: "/waitlist/join-bg.jpg", // first frame for the video
} as const;
