import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "../lib/gsap";
import { reducedMotion } from "../lib/env";
import { method } from "../data/profile";
import "./Marquee.css";

/** Velocity-reactive band: drifts on its own, surges and reverses with the scroll. */
export default function Marquee() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const track = root.current?.querySelector<HTMLElement>(".marquee__track");
      if (!track || reducedMotion) return;
      let x = 0;
      let dir = -1;
      let boost = 0;
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          dir = self.direction === 1 ? -1 : 1;
          boost = Math.min(18, Math.abs(self.getVelocity()) / 220);
        },
      });
      const skew = gsap.quickTo(track, "skewX", { duration: 0.6, ease: "power3" });
      const tick = (_t: number, dt: number) => {
        if (!st.isActive) return;
        boost *= 0.92;
        x += dir * (0.045 + boost * 0.05) * dt;
        const half = track.scrollWidth / 2;
        if (x <= -half) x += half;
        if (x > 0) x -= half;
        gsap.set(track, { x });
        skew(-dir * boost * 0.5);
      };
      gsap.ticker.add(tick);
      return () => gsap.ticker.remove(tick);
    },
    { scope: root },
  );

  const run = method.map((m) => m.verb);
  return (
    <div ref={root} className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {[0, 1].map((k) => (
          <span key={k} className="marquee__run">
            {run.map((v, i) => (
              <span key={v} className="marquee__item">
                <span className={i % 2 ? "serif" : undefined}>{v}</span>
                <span className="marquee__sep">→</span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
