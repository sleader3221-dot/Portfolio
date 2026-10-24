import { useRef } from "react";
import { gsap, useGSAP } from "../lib/gsap";
import { reveal } from "../lib/reveal";
import { scramble } from "../lib/scramble";
import SectionHead from "../components/SectionHead";
import { links, projects, type Project } from "../data/profile";
import "./Evidence.css";

const winners = projects.filter((p) => p.ribbon).length;

function Exhibit({ p }: { p: Project }) {
  return (
    <article className="exhibit" style={{ "--accent": p.accent } as React.CSSProperties} aria-labelledby={`ex-${p.id}`} data-code={p.code}>
      <div className="exhibit__media">
        <a className="exhibit__frame" href={p.live} target="_blank" rel="noreferrer" data-cursor="Open live" aria-label={`Open ${p.title} live demo`}>
          <img
            className="exhibit__img"
            src={p.image}
            alt={`${p.title} — screenshot of the live product`}
            width={1600}
            height={1000}
            loading="lazy"
            decoding="async"
          />
          <span className="exhibit__shade" aria-hidden="true" />
          <span className="exhibit__corner exhibit__corner--tl" aria-hidden="true" />
          <span className="exhibit__corner exhibit__corner--tr" aria-hidden="true" />
          <span className="exhibit__corner exhibit__corner--bl" aria-hidden="true" />
          <span className="exhibit__corner exhibit__corner--br" aria-hidden="true" />
          <span className="exhibit__strip label" aria-hidden="true">
            <span>Exhibit {p.code}</span>
            <span>{new URL(p.live).hostname}</span>
          </span>
        </a>
      </div>

      <div className="exhibit__info">
        <div className="exhibit__meta label">
          <span className="label--ember">{p.code}</span>
          <span>{p.domain}</span>
          <span>{p.year}</span>
        </div>
        <h3 id={`ex-${p.id}`} className="exhibit__title">
          {p.title}
        </h3>
        <p className="exhibit__tagline">{p.tagline}</p>
        {p.context && <p className="label exhibit__context">{p.context}</p>}

        {p.awards.length > 0 ? (
          <ul className="exhibit__awards" aria-label="Awards">
            {p.awards.map((a) => (
              <li key={a.title + a.event}>
                <span className="exhibit__award">{a.title}</span>
                <span className="exhibit__event">{a.event}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="exhibit__awards exhibit__awards--none label">Independent build · not entered on Devpost</p>
        )}

        <ul className="exhibit__stack" aria-label="Built with">
          {p.stack.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>

        <div className="exhibit__links">
          <a href={p.live} target="_blank" rel="noreferrer" data-cursor="Live">
            Live demo <span aria-hidden="true">↗</span>
          </a>
          {p.devpost && (
            <a href={p.devpost} target="_blank" rel="noreferrer" data-cursor="Devpost">
              Devpost <span aria-hidden="true">↗</span>
            </a>
          )}
          {p.source && (
            <a href={p.source} target="_blank" rel="noreferrer" data-cursor="Source">
              Source <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default function Evidence() {
  const root = useRef<HTMLElement>(null);
  const counter = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      reveal(el);
      const mm = gsap.matchMedia();

      mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
        el.classList.add("is-horizontal");
        const track = el.querySelector<HTMLElement>(".evidence__track")!;
        const bar = el.querySelector<HTMLElement>(".evidence__bar span")!;
        const distance = () => track.scrollWidth - window.innerWidth;
        const skew = gsap.quickTo(track, "skewX", { duration: 0.8, ease: "power3" });
        let current = "";

        const slide = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: ".evidence__pin",
            pin: true,
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              gsap.set(bar, { scaleX: self.progress });
              skew(gsap.utils.clamp(-1.5, 1.5, self.getVelocity() / -1600));
            },
          },
        });

        gsap.utils.toArray<HTMLElement>(".exhibit", el).forEach((ex) => {
          const img = ex.querySelector(".exhibit__img");
          const frame = ex.querySelector(".exhibit__frame");
          const info = ex.querySelectorAll(".exhibit__info > *");
          const st = { containerAnimation: slide, trigger: ex };

          gsap.fromTo(img, { xPercent: -7 }, { xPercent: 7, ease: "none", scrollTrigger: { ...st, start: "left right", end: "right left", scrub: true } });
          gsap.fromTo(
            frame,
            { clipPath: "inset(8% 0% 8% 100%)" },
            { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.out", scrollTrigger: { ...st, start: "left 95%", end: "left 35%", scrub: true } },
          );
          gsap.from(info, { x: 80, autoAlpha: 0, stagger: 0.05, ease: "power2.out", scrollTrigger: { ...st, start: "left 75%", end: "left 25%", scrub: true } });
          gsap.timeline({
            scrollTrigger: {
              ...st,
              start: "left center",
              end: "right center",
              onToggle: (self) => {
                if (!self.isActive || !counter.current) return;
                const code = ex.dataset.code ?? "";
                if (code !== current) {
                  current = code;
                  scramble(counter.current, code, 420);
                }
              },
            },
          });
        });

        return () => el.classList.remove("is-horizontal");
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="evidence" className="evidence" aria-labelledby="evidence-title">
      <div className="evidence__pin">
        <div className="wrap evidence__head">
          <SectionHead index="03" label="Evidence" aside="Eight exhibits" />
        </div>

        <div className="evidence__track">
          <div className="ev-intro">
            <h2 id="evidence-title" className="ev-intro__title" data-reveal="lines">
              Evidence<span className="mstep__dot">.</span>
            </h2>
            <p className="ev-intro__lead" data-reveal="fade">
              Eight builds. <span className="serif">{winners} Devpost winner ribbons.</span> Every one live, sourced and
              verifiable — open any exhibit to inspect it yourself.
            </p>
            <p className="label ev-intro__cue">
              <span className="ev-intro__arrow" aria-hidden="true" /> Keep scrolling to examine
            </p>
          </div>

          {projects.map((p) => (
            <Exhibit key={p.id} p={p} />
          ))}

          <div className="ev-outro">
            <p className="label">End of exhibits</p>
            <p className="ev-outro__big">
              Eight of <span className="serif">twelve.</span>
            </p>
            <p className="ev-outro__lead">The full record — every hackathon, every build — lives on Devpost.</p>
            <a className="ev-outro__cta" href={links.devpost} target="_blank" rel="noreferrer" data-cursor="Devpost">
              View the full record <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        <div className="wrap evidence__foot" aria-hidden="true">
          <span className="label">
            Exhibit <span ref={counter} className="evidence__count">03-A</span> / {projects.at(-1)!.code}
          </span>
          <span className="evidence__bar">
            <span />
          </span>
        </div>
      </div>
    </section>
  );
}
