import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsap";
import { reducedMotion } from "./env";

let lenis: Lenis | null = null;

/** Lenis drives the scroll, GSAP's ticker drives Lenis, ScrollTrigger listens to Lenis. One clock. */
export function startScroll() {
  if (lenis) return lenis;
  lenis = new Lenis({
    lerp: reducedMotion ? 1 : 0.085,
    wheelMultiplier: 0.95,
    touchMultiplier: 1.4,
    smoothWheel: !reducedMotion,
    autoRaf: false,
  });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis?.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export const getLenis = () => lenis;

export function scrollToTarget(target: string | HTMLElement | number, immediate = false) {
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  if (el === null) return;
  if (lenis) {
    lenis.scrollTo(el, { duration: immediate ? 0 : 1.8, immediate, easing: (t) => 1 - Math.pow(1 - t, 4) });
  } else if (typeof el === "number") {
    window.scrollTo({ top: el });
  } else {
    el.scrollIntoView();
  }
}

export const lockScroll = (locked: boolean) => (locked ? lenis?.stop() : lenis?.start());
