import { gsap, SplitText } from "./gsap";
import { reducedMotion } from "./env";

/**
 * Declarative entrance animations inside a scope:
 *   data-reveal="lines"  — masked line-by-line rise (SplitText, re-splits on resize)
 *   data-reveal="fade"   — soft rise + fade
 *   data-reveal="rule"   — hairline draws, then its labels settle
 *   data-reveal="clip"   — clip-path wipe upward
 */
export function reveal(scope: Element) {
  if (reducedMotion) return;
  const at = (el: Element) => ({ trigger: el, start: "top 86%", once: true });

  scope.querySelectorAll<HTMLElement>('[data-reveal="lines"]').forEach((el) => {
    SplitText.create(el, {
      type: "lines",
      mask: "lines",
      linesClass: "split-line",
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.lines, { yPercent: 112, duration: 1.4, stagger: 0.09, scrollTrigger: at(el) }),
    });
  });

  scope.querySelectorAll<HTMLElement>('[data-reveal="fade"]').forEach((el) => {
    gsap.from(el, { y: 40, autoAlpha: 0, duration: 1.4, delay: Number(el.dataset.delay ?? 0), scrollTrigger: at(el) });
  });

  scope.querySelectorAll<HTMLElement>('[data-reveal="rule"]').forEach((el) => {
    const tl = gsap.timeline({ scrollTrigger: at(el) });
    const rule = el.querySelector(".shead__rule");
    if (rule) tl.from(rule, { scaleX: 0, duration: 1.6, ease: "expo.inOut" });
    tl.from(el.querySelectorAll(".label"), { y: 14, autoAlpha: 0, stagger: 0.06, duration: 1 }, 0.2);
  });

  scope.querySelectorAll<HTMLElement>('[data-reveal="clip"]').forEach((el) => {
    gsap.fromTo(
      el,
      { clipPath: "inset(100% 0% 0% 0%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.inOut", scrollTrigger: at(el) },
    );
  });
}
