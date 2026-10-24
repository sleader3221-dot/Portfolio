import { useRef } from "react";
import { gsap, useGSAP } from "../lib/gsap";
import { reveal } from "../lib/reveal";
import { reducedMotion } from "../lib/env";
import SectionHead from "../components/SectionHead";
import { certifications, record } from "../data/profile";
import "./Record.css";

export default function Record() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      reveal(root.current!);
      if (reducedMotion) return;
      gsap.fromTo(
        ".record__spine-fill",
        { scaleY: 0 },
        { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".record__list", start: "top 70%", end: "bottom 60%", scrub: 0.6 } },
      );
      gsap.utils.toArray<HTMLElement>(".rec").forEach((rec) => {
        gsap.timeline({ scrollTrigger: { trigger: rec, start: "top 70%", toggleClass: "is-lit", once: true } });
        gsap.from(rec.querySelectorAll(".rec__period, .rec__main, .rec__detail"), {
          y: 50,
          autoAlpha: 0,
          stagger: 0.08,
          duration: 1.4,
          scrollTrigger: { trigger: rec, start: "top 85%", once: true },
        });
      });
      gsap.from(".cert", {
        y: 60,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 1.4,
        scrollTrigger: { trigger: ".certs", start: "top 85%", once: true },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="record" className="section record" aria-labelledby="record-title">
      <div className="wrap">
        <SectionHead index="05" label="Record" aside="Education & credentials" />
        <h2 id="record-title" className="record__title" data-reveal="lines">
          The paper <span className="serif">trail.</span>
        </h2>

        <div className="record__list">
          <span className="record__spine" aria-hidden="true">
            <span className="record__spine-fill" />
          </span>
          {record.map((r) => (
            <article key={r.title} className="rec">
              <span className="rec__node" aria-hidden="true" />
              <p className="rec__period">{r.period}</p>
              <div className="rec__main">
                <h3 className="rec__title">{r.title}</h3>
                <p className="label">{r.org}</p>
              </div>
              <p className="rec__detail">{r.detail}</p>
            </article>
          ))}
        </div>

        <div className="certs">
          <p className="label label--ember">Certifications · 2024 — 2026</p>
          <ul>
            {certifications.map((c, i) => (
              <li key={c.title} className="cert">
                <span className="label cert__idx">C-{String(i + 1).padStart(2, "0")}</span>
                <p className="cert__title">{c.title}</p>
                <p className="label">{c.issuer}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
