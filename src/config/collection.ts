/* SERIES 01 · КӨШ — colorway media. Order matches t.collection.items.
   Drop a generated still into /public/collection/ and set coming:false. */
export const collection = [
  { id: "kau", image: "/collection/kau.jpg", coming: false },
  { id: "jusan", image: "/collection/jusan.jpg", coming: false },
  { id: "tun", image: "/collection/tun.jpg", coming: false },
  { id: "salqyn", image: "/collection/salqyn.jpg", coming: true }, // «холодок» — awaiting still
] as const;
