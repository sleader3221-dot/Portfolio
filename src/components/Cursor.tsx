import { useEffect, useRef } from "react";
import { gsap } from "../lib/gsap";
import { finePointer, reducedMotion } from "../lib/env";
import "./Cursor.css";

/** Two-part cursor: a precise dot and a lagging ring that opens into a contextual label. */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!finePointer || reducedMotion || !dot.current || !ring.current) return;
    const html = document.documentElement;
    html.classList.add("has-cursor");
    const dx = gsap.quickTo(dot.current, "x", { duration: 0.12, ease: "power3" });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.12, ease: "power3" });
    const rx = gsap.quickTo(ring.current, "x", { duration: 0.55, ease: "power3" });
    const ry = gsap.quickTo(ring.current, "y", { duration: 0.55, ease: "power3" });
    const r = ring.current;
    let label = "";

    const move = (e: PointerEvent) => {
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
      html.classList.add("cursor-in");
      over(e);
    };
    // Re-evaluated on every move so canvases can change their label per hovered node.
    const over = (e: PointerEvent) => {
      const t = e.target as Element | null;
      const tagged = t?.closest<HTMLElement>("[data-cursor]");
      const interactive = t?.closest("a, button, [role='button'], input, textarea, canvas[data-interactive]");
      const next = tagged?.dataset.cursor ?? "";
      if (next !== label && text.current) {
        label = next;
        text.current.textContent = next;
      }
      r.classList.toggle("is-label", next.length > 0);
      r.classList.toggle("is-hover", !next && Boolean(interactive));
    };
    const down = () => r.classList.add("is-press");
    const up = () => r.classList.remove("is-press");
    const leave = () => html.classList.remove("cursor-in");

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    html.addEventListener("pointerleave", leave);
    return () => {
      html.classList.remove("has-cursor", "cursor-in");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      html.removeEventListener("pointerleave", leave);
    };
  }, []);

  if (!finePointer || reducedMotion) return null;
  return (
    <div className="cursor" aria-hidden="true">
      <div ref={ring} className="cursor__ring">
        <span ref={text} className="cursor__text" />
      </div>
      <div ref={dot} className="cursor__dot" />
    </div>
  );
}
