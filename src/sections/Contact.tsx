import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "../lib/gsap";
import { reveal } from "../lib/reveal";
import { magnetize } from "../lib/magnetic";
import { finePointer, reducedMotion } from "../lib/env";
import { caseHash } from "../lib/caseHash";
import { scrollToTarget } from "../lib/scroll";
import { useClock } from "../lib/useClock";
import SectionHead from "../components/SectionHead";
import { links, person } from "../data/profile";
import "./Contact.css";

const HEADLINE = "Let’s build something";

const CHANNELS = [
  { label: "LinkedIn", value: "in/karthik-ma", href: links.linkedin },
  { label: "GitHub", value: "sleader3221-dot", href: links.github },
  { label: "Devpost", value: "karthikma321", href: links.devpost },
  { label: "Phone", value: person.phone.display, href: person.phone.href },
];

export default function Contact() {
  const root = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const [hash, setHash] = useState("");
  const clock = useClock();

  useEffect(() => {
    caseHash.then(setHash);
  }, []);

  useGSAP(
    () => {
      const el = root.current!;
      reveal(el);
      const unmag = magnetize(el);
      const letters = gsap.utils.toArray<HTMLElement>(".kl", el);

      if (!reducedMotion) {
        gsap.from(letters, {
          yPercent: 110,
          stagger: 0.025,
          duration: 1.5,
          scrollTrigger: { trigger: ".contact__title", start: "top 85%", once: true },
        });
      }

      // Variable-weight wave: letters near the pointer grow heavier, like ink pressed harder.
      const title = el.querySelector<HTMLElement>(".contact__title");
      if (!title || !finePointer || reducedMotion) return unmag;
      const sans = letters.filter((l) => !l.closest(".serif"));
      const setters = sans.map((l) => gsap.quickTo(l, "fontWeight", { duration: 0.6, ease: "power3" }));
      const move = (e: PointerEvent) => {
        sans.forEach((l, i) => {
          const r = l.getBoundingClientRect();
          const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
          setters[i]!(300 + 600 * Math.max(0, 1 - d / 320));
        });
      };
      const leave = () => setters.forEach((s) => s(400));
      title.addEventListener("pointermove", move);
      title.addEventListener("pointerleave", leave);
      return () => {
        unmag();
        title.removeEventListener("pointermove", move);
        title.removeEventListener("pointerleave", leave);
      };
    },
    { scope: root },
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(person.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${person.email}`;
    }
  };

  return (
    <section ref={root} id="contact" className="contact" aria-labelledby="contact-title">
      <div className="wrap contact__inner">
        <SectionHead index="06" label="Open a case" aside={`${person.availability} · ${person.location}`} />

        <h2 id="contact-title" className="contact__title" aria-label={`${HEADLINE} provable.`}>
          <span aria-hidden="true" className="contact__line">
            {HEADLINE.split(" ").map((w, wi) => (
              <span key={wi} className="kw">
                {[...w].map((c, ci) => (
                  <span key={ci} className="kl">
                    {c}
                  </span>
                ))}
              </span>
            ))}
          </span>
          <span aria-hidden="true" className="contact__line contact__line--serif serif">
            <span className="kw">
              <span className="kl">provable</span>
              <span className="kl contact__stop">.</span>
            </span>
          </span>
        </h2>

        <div className="contact__mail-row">
          <a className="contact__mail" href={`mailto:${person.email}`} data-cursor="Write" data-magnetic>
            {person.email}
          </a>
          <button className={`contact__copy ${copied ? "is-done" : ""}`} onClick={copy} data-cursor="Copy" data-magnetic>
            <span className="label">{copied ? "Copied ✓" : "Copy address"}</span>
          </button>
          <span className="sr-only" aria-live="polite">
            {copied ? "Email address copied to clipboard" : ""}
          </span>
        </div>

        <ul className="contact__grid">
          {CHANNELS.map((c) => (
            <li key={c.label} data-reveal="fade">
              <a
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                data-cursor="Open"
              >
                <span className="label">{c.label}</span>
                <span className="contact__val">{c.value}</span>
                <span className="contact__arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="contact__status" data-reveal="fade">
          <p className="label">
            <span className="dot" /> {person.availability} — {person.interests.join(" · ")}
          </p>
          <p className="label">Bengaluru · {clock} IST</p>
        </div>
      </div>

      <div className="contact__finale" aria-hidden="true">
        <p className="label">The case stays open.</p>
      </div>

      <footer className="foot wrap">
        <p className="label">© 2026 {person.name} · Designed &amp; engineered in Bengaluru</p>
        <p className="label foot__seal" title={hash}>
          Case sealed · sha256 {hash ? `${hash.slice(0, 12)}…` : "…"}
        </p>
        <button className="label foot__top" onClick={() => scrollToTarget("#top")} data-cursor="Top">
          Back to top ↑
        </button>
      </footer>
    </section>
  );
}
