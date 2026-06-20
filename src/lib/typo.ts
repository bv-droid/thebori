/* Micro-typography for RU/KZ/EN display copy.

   Two rules that matter for premium typesetting:
   1. One/two-letter words (prepositions, conjunctions, particles: в, на, и, не,
      a, is, of …) must never be stranded at the end of a line — bind them to the
      next word with a non-breaking space.
   2. An em-dash must not start a line — bind it to the preceding word.

   Pure string→string, safe to run on any locale. Idempotent enough for our copy
   (run the short-word pass twice to catch adjacent shorties like "и не"). */

const NBSP = " ";

export function typo(input: string): string {
  let s = input;
  // bind 1–2 letter words to what follows (run twice for adjacent short words)
  const short = /(^|[\s(«"])(\p{L}{1,2})[ \t]+/gu;
  s = s.replace(short, `$1$2${NBSP}`);
  s = s.replace(short, `$1$2${NBSP}`);
  // keep the em-dash attached to the preceding word
  s = s.replace(/([^\s])[ \t]+—[ \t]+/g, `$1${NBSP}— `);
  // keep a "·" / "•" separator on the preceding word so it never leads a line
  s = s.replace(/[ \t]+([·•])[ \t]+/g, `${NBSP}$1 `);
  return s;
}
