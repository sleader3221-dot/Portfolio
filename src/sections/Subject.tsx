import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "../lib/gsap";
import { reveal } from "../lib/reveal";
import { reducedMotion } from "../lib/env";
import { caseHash } from "../lib/caseHash";
import SectionHead from "../components/SectionHead";
import { person, record, stats, statsAsOf } from "../data/profile";
import "./Subject.css";

/** Words wrapped in *asterisks* are set in italic serif — the claims the rest of the site has to prove. */
const LEAD =
  "I'm Karthik — a software, AI/ML & DFIR engineer in Bengaluru. I build *evidence-driven* intelligent systems, engineered for *trust,* *clarity* and *measurable* *results.*";

function Barcode({ hash }: { hash: string }) {
  const bars = hash.length === 64 ? [...hash] : Array.from({ length: 64 }, () => "0");
  return (
    <div className="tag__barcode" aria-hidden="true">
      {bars.map((c, i) => {
        const n = parseInt(c, 16) || 0;
        return <i key={i} style={{ width: `${1 + (n % 4)}px`, opacity: n > 2 ? 1 : 0.35 }} />;
      })}
    </div>
  );
}

export default function Subject() {
  const root = useRef<HTMLElement>(null);
  const [hash, setHash] = useState("");

  useEffect(() => {
    caseHash.then(setHash);
  }, []);

  useGSAP(
    () => {
      const el = root.current!;
      reveal(el);
      if (reducedMotion) return;

      // Declassification: redaction bars lift word by word, scrubbed to the scroll.
      const words = gsap.utils.toArray<HTMLElement>(".rd");
      gsap
        .timeline({ scrollTrigger: { trigger: ".subject__lead", start: "top 80%", end: "bottom 58%", scrub: 0.5 } })
        .to(".rd__bar", { scaleX: 0, stagger: 0.12, ease: "power2.inOut", duration: 1 }, 0)
        .to(words, { color: "#ece7de", stagger: 0.12, duration: 1 }, 0);

      // Ledger counters count up once, with tabular figures so nothing jitters.
      gsap.utils.toArray<HTMLElement>(".ledger__num").forEach((n) => {
        const target = Number(n.dataset.value);
        const decimals = Number(n.dataset.decimals ?? 0);
        const v = { x: 0 };
        gsap.to(v, {
          x: target,
          duration: 2.2,
          ease: "power3.out",
          scrollTrigger: { trigger: n, start: "top 88%", once: true },
          onUpdate: () => (n.textContent = v.x.toFixed(decimals)),
        });
      });

      gsap.from(".subject__tag", {
        yPercent: 12,
        rotate: -3,
        autoAlpha: 0,
        duration: 1.8,
        scrollTrigger: { trigger: ".subject__tag", start: "top 85%", once: true },
      });
    },
    { scope: root },
  );

  const edu = record[0]!;

  return (
    <section ref={root} id="subject" className="section subject" aria-labelledby="subject-title">
      <div className="wrap">
        <SectionHead index="01" label="Subject" />

        <div className="subject__grid">
          <aside className="subject__tag" aria-label="Subject summary">
            <span className="tag__hole" aria-hidden="true" />
            <div className="tag__top">
              <span className="label label--ember">Evidence tag</span>
              <span className="label">{person.caseId}-01</span>
            </div>
            <dl className="tag__fields">
              <div>
                <dt className="label">Name</dt>
                <dd>{person.name}</dd>
              </div>
              <div>
                <dt className="label">Role</dt>
                <dd>{person.role}</dd>
              </div>
              <div>
                <dt className="label">Base</dt>
                <dd>{person.location}</dd>
              </div>
              <div>
                <dt className="label">Study</dt>
                <dd>
                  B.E. EEE · RIT · {edu.period.replace(" — ", "–")}
                </dd>
              </div>
              <div>
                <dt className="label">Seeking</dt>
                <dd>{person.interests.join(" · ")} internships</dd>
              </div>
            </dl>
            <Barcode hash={hash} />
            <p className="label tag__hash" title={hash}>
              sha256 {hash ? `${hash.slice(0, 16)}…${hash.slice(-6)}` : "computing…"}
            </p>
          </aside>

          <div className="subject__body">
            <h2 id="subject-title" className="subject__lead">
              {LEAD.split(" ").map((w, i) => {
                const em = w.startsWith("*");
                const text = w.replaceAll("*", "");
                return (
                  <span key={i} className={`rd${em ? " serif rd--em" : ""}`}>
                    {text}
                    <span className="rd__bar" aria-hidden="true" />{" "}
                  </span>
                );
              })}
            </h2>

            <div className="subject__cols">
              <p data-reveal="fade">
                Currently pursuing a B.E. in Electrical &amp; Electronics Engineering at Ramaiah Institute of
                Technology, Bengaluru — CGPA 8.45 / 10, class of 2028 — while building at the intersection of
                software engineering, AI/ML and digital forensics.
              </p>
              <p data-reveal="fade" data-delay="0.1">
                57 hackathons entered, 12 projects published on Devpost and seven winner ribbons — including
                2nd Overall at HackMars 3.0 and 3rd Place at the SS Hacker Team Cybersecurity Global
                Challenge 2026.
              </p>
            </div>
          </div>
        </div>

        <ul className="ledger" aria-label="Record in numbers">
          {stats.map((s) => (
            <li key={s.label} className="ledger__cell" data-reveal="fade">
              <span
                className="ledger__num"
                data-value={s.value}
                data-decimals={s.decimals ?? 0}
                aria-label={String(s.value)}
              >
                {reducedMotion ? s.value.toFixed(s.decimals ?? 0) : "0"}
              </span>
              <span className="ledger__label">{s.label}</span>
              <span className="label">{s.note}</span>
            </li>
          ))}
        </ul>
        <p className="label ledger__src">Source · {statsAsOf}</p>
      </div>
    </section>
  );
}
