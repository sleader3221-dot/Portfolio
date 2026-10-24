import { useEffect, useRef, useState } from "react";
import { gsap, SplitText, useGSAP } from "../lib/gsap";
import { store } from "../lib/store";
import { bridge } from "../lib/bridge";
import { finePointer, reducedMotion } from "../lib/env";
import { caseHash } from "../lib/caseHash";
import { person, projects, stats } from "../data/profile";
import "./Hero.css";

/** Hidden case notes, printed in "latent ink" that only the UV cursor reveals. */
function latentNotes(hash: string) {
  const facts = [
    `subject ${person.name}`,
    person.role,
    person.coords,
    ...stats.map((s) => `${s.value} ${s.label}`),
    ...projects.map((p) => `${p.code} ${p.title}`),
    `sha256 ${hash}`,
  ];
  return Array.from({ length: 6 }, () => facts.join("  ·  ")).join("  ·  ");
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const [hash, setHash] = useState("…");

  useEffect(() => {
    caseHash.then(setHash);
  }, []);

  useGSAP(
    () => {
      const el = root.current!;
      const split = SplitText.create(".hero__line", { type: "chars", mask: "chars", charsClass: "hero__char" });
      const fadeIns = gsap.utils.toArray<HTMLElement>(".hero__meta > div, .hero__intro > *, .hero__foot > *");
      gsap.set(split.chars, { yPercent: 115 });
      gsap.set(fadeIns, { autoAlpha: 0, y: 24 });

      const intro = () => {
        const tl = gsap.timeline();
        if (reducedMotion) tl.timeScale(40);
        tl.to(bridge, { intro: 1, duration: 3.4, ease: "power3.inOut" }, 0)
          .to(split.chars, { yPercent: 0, duration: 1.7, stagger: 0.035, ease: "expo.out" }, 0.35)
          .to(fadeIns, { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.06 }, 0.9)
          .add(() => store.set({ phase: "ready" }));
      };
      let unsub = () => {};
      if (store.get().phase !== "loading") intro();
      else {
        unsub = store.subscribe(() => {
          if (store.get().phase === "intro") {
            unsub();
            intro();
          }
        });
      }

      // Leaving the hero: the two halves of the name drift apart as the case file opens.
      if (!reducedMotion) {
        const out = gsap.timeline({
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 0.6 },
        });
        out.to(".hero__line--1", { xPercent: -14, ease: "none" }, 0)
          .to(".hero__line--2", { xPercent: 12, ease: "none" }, 0)
          .to(".hero__name", { yPercent: -22, autoAlpha: 0.15, ease: "none" }, 0)
          .to(".hero__meta, .hero__intro", { y: -120, autoAlpha: 0, ease: "none" }, 0)
          .to(".hero__uv", { autoAlpha: 0, ease: "none" }, 0);
      }

      // UV torch: a radial mask follows the pointer over the latent-ink layer.
      if (finePointer && !reducedMotion) {
        const pos = { x: 0, y: 0 };
        const apply = () => {
          el.style.setProperty("--mx", `${pos.x}px`);
          el.style.setProperty("--my", `${pos.y}px`);
        };
        const setX = gsap.quickTo(pos, "x", { duration: 0.5, ease: "power3", onUpdate: apply });
        const setY = gsap.quickTo(pos, "y", { duration: 0.5, ease: "power3", onUpdate: apply });
        const onMove = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          setX(e.clientX - r.left);
          setY(e.clientY - r.top);
          el.classList.add("is-torch");
        };
        const onLeave = () => el.classList.remove("is-torch");
        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerleave", onLeave);
        return () => {
          unsub();
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerleave", onLeave);
        };
      }
      return unsub;
    },
    { scope: root },
  );

  return (
    <section ref={root} id="top" className="hero" aria-labelledby="hero-title">
      <div className="hero__uv" aria-hidden="true">
        <p>{latentNotes(hash)}</p>
      </div>

      <div className="hero__grid wrap">
        <dl className="hero__meta label">
          <div>
            <dt>Case file</dt>
            <dd>{person.caseId}</dd>
          </div>
          <div>
            <dt>Subject</dt>
            <dd>{person.name}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>
              <span className="dot" /> {person.availability}
            </dd>
          </div>
        </dl>

        <div className="hero__intro">
          <p className="label label--ember">{person.role}</p>
          <p className="hero__statement">{person.statement}</p>
        </div>

        <h1 id="hero-title" className="hero__name" aria-label={person.name}>
          <span className="hero__line hero__line--1" aria-hidden="true">
            Karthik M
          </span>
          <span className="hero__line hero__line--2 serif" aria-hidden="true">
            Achalakar
          </span>
        </h1>

        <div className="hero__foot">
          <span className="label">
            {person.coords} — {person.location}
          </span>
          <span className="hero__cue label">
            Scroll to investigate <i aria-hidden="true" />
          </span>
          {finePointer && <span className="label hero__hint">Move the cursor — UV light reveals latent ink</span>}
        </div>
      </div>
    </section>
  );
}
