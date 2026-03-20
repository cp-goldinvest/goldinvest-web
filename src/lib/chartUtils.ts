/**
 * Deterministic pseudo-random number generator (LCG).
 * Produces identical output on server and client for the same seed —
 * avoids React hydration mismatches in chart mock data.
 */
export function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}
