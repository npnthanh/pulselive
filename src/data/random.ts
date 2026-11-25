/** Small seeded PRNG so mock data is stable across reloads. Returns floats in [0, 1). */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Helpers bound to one PRNG instance. */
export function createRandom(seed: number) {
  const rand = mulberry32(seed);
  return {
    rand,
    between: (min: number, max: number) => min + Math.floor(rand() * (max - min + 1)),
    pick: <T,>(arr: readonly T[]) => arr[Math.floor(rand() * arr.length)],
  };
}
