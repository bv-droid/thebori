/* Signature sound. Two layers, both generated for BØRI (STEPPE PROTOCOL):
   - `theme`   : the cinematic "Рух"-style cue that plays ONCE on entry.
   - `ambient` : a steady steppe bed that loops seamlessly under the whole scroll.
   The theme crossfades into the ambient bed near its end. Set `hasTrack: false`
   to fall back to the procedural steppe wind. */

export const audioConfig = {
  hasTrack: true,
  theme: "/audio/bori-theme.mp3", // Kazakh Steppe-2 — dramatic entry cue (≈3:39)
  ambient: "/audio/bori-ambient.mp3", // Silent Steppe-2 — seamless looping bed
  themeVolume: 0.42,
  ambientVolume: 0.22,
  crossfadeTail: 7, // seconds before the theme ends to fade into the bed
} as const;
