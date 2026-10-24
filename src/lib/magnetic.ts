import { gsap } from "./gsap";
import { finePointer, reducedMotion } from "./env";

/** Elements tagged [data-magnetic] lean toward the pointer and spring back on leave. */
export function magnetize(scope: Element, strength = 0.32) {
  if (!finePointer || reducedMotion) return () => {};
  const offs: (() => void)[] = [];
  scope.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
    const x = gsap.quickTo(el, "x", { duration: 0.8, ease: "elastic.out(1, 0.45)" });
    const y = gsap.quickTo(el, "y", { duration: 0.8, ease: "elastic.out(1, 0.45)" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      x((e.clientX - (r.left + r.width / 2)) * strength);
      y((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => {
      x(0);
      y(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    offs.push(() => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    });
  });
  return () => offs.forEach((f) => f());
}
