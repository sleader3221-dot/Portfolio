const mq = (q: string) => typeof window !== "undefined" && window.matchMedia(q).matches;

export const reducedMotion = mq("(prefers-reduced-motion: reduce)");
export const finePointer = mq("(hover: hover) and (pointer: fine)");

/** Rough GPU/CPU budget used to size the particle field. */
export function deviceTier(): "high" | "mid" | "low" {
  if (typeof navigator === "undefined") return "mid";
  const cores = navigator.hardwareConcurrency ?? 4;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  const small = window.innerWidth < 760;
  if (small || cores <= 4 || mem <= 4) return small ? "low" : "mid";
  return "high";
}
