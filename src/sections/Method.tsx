import { useRef } from "react";
import { gsap, useGSAP } from "../lib/gsap";
import { reveal } from "../lib/reveal";
import SectionHead from "../components/SectionHead";
import { disciplines, method } from "../data/profile";
import "./Method.css";

const pad = (n: number) => String(n).padStart(2, "0");

export default function Method() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      reveal(el);
      const mm = gsap.matchMedia();

      mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
        el.classList.add("is-pinned");
        const steps = gsap.utils.toArray<HTMLElement>(".mstep", el);
        const fills = gsap.utils.toArray<HTMLElement>(".mprog__fill", el);
        const ticks = gsap.utils.toArray<HTMLElement>(".mprog li", el);
        const part = (i: number, sel: string) => steps[i]!.querySelector(sel);

        steps.forEach((_, i) => {
          if (i === 0) return;
          gsap.set(part(i, ".mstep__verb-in"), { yPercent: 112 });
          gsap.set([part(i, ".mstep__body"), part(i, ".mstep__num")], { autoAlpha: 0, y: 30 });
        });
        gsap.set(fills, { scaleX: 0 });
        gsap.set(fills[0]!, { scaleX: 1 });
        ticks[0]?.classList.add("is-on");

        const tl = gsap.timeline({
          defaults: { ease: "power3.inOut", duration: 1 },
          scrollTrigger: {
            trigger: ".method__pin",
            pin: true,
            start: "top top",
            end: () => `+=${window.innerHeight * (steps.length - 0.4)}`,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: () => {
              const t = tl.time();
              ticks.forEach((tick, i) => tick.classList.toggle("is-on", i === 0 || t >= (i - 1) * 1.25 + 0.75));
            },
          },
        });

        for (let i = 0; i < steps.length - 1; i++) {
          const at = i * 1.25 + 0.25;
          tl.to(part(i, ".mstep__verb-in"), { yPercent: -112 }, at)
            .to([part(i, ".mstep__body"), part(i, ".mstep__num")], { autoAlpha: 0, y: -30, duration: 0.6 }, at)
            .to(part(i + 1, ".mstep__verb-in"), { yPercent: 0 }, at + 0.1)
            .to([part(i + 1, ".mstep__body"), part(i + 1, ".mstep__num")], { autoAlpha: 1, y: 0, duration: 0.7 }, at + 0.4)
            .to(fills[i + 1]!, { scaleX: 1, ease: "none" }, at);
        }
        tl.to({}, { duration: 0.4 });

        return () => el.classList.remove("is-pinned");
      });

      // Discipline cards: a soft light follows the pointer across the surface.
      gsap.utils.toArray<HTMLElement>(".disc", el).forEach((card) => {
        const move = (e: PointerEvent) => {
          const r = card.getBoundingClientRect();
          card.style.setProperty("--px", `${e.clientX - r.left}px`);
          card.style.setProperty("--py", `${e.clientY - r.top}px`);
        };
        card.addEventListener("pointermove", move);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="method" className="method" aria-labelledby="method-title">
      <div className="method__pin">
        <div className="wrap method__stage">
          <SectionHead index="02" label="Method" aside="The loop behind ProofSIFT" />
          <h2 id="method-title" className="method__title" data-reveal="lines">
            Six moves. <span className="serif">Every build.</span>
          </h2>

          <div className="method__frame">
            {method.map((m, i) => (
              <article key={m.verb} className="mstep">
                <span className="mstep__num label">
                  <span className="label--ember">{pad(i + 1)}</span> / {pad(method.length)}
                </span>
                <h3 className="mstep__verb">
                  <span className="mstep__verb-in">
                    {i % 2 ? <span className="serif">{m.verb}</span> : m.verb}
                    <span className="mstep__dot">.</span>
                  </span>
                </h3>
                <p className="mstep__body">{m.body}</p>
              </article>
            ))}
          </div>

          <ol className="mprog" aria-hidden="true">
            {method.map((m) => (
              <li key={m.verb}>
                <span className="label">{m.verb}</span>
                <span className="mprog__bar">
                  <span className="mprog__fill" />
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="wrap method__disc">
        {disciplines.map((d, i) => (
          <article key={d.id} className="disc" data-reveal="fade" data-delay={i * 0.12}>
            <span className="disc__mark" aria-hidden="true">
              {String.fromCharCode(65 + i)}
            </span>
            <p className="label label--ember">{d.kicker}</p>
            <h3 className="disc__title">{d.title}</h3>
            <p className="disc__body">{d.body}</p>
            <ul className="disc__tools" aria-label={`${d.title} tools`}>
              {d.tools.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
