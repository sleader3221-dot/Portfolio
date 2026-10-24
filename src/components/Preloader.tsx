import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "../lib/gsap";
import { loader } from "../lib/loader";
import { store } from "../lib/store";
import { caseHash } from "../lib/caseHash";
import { reducedMotion } from "../lib/env";
import { person, projects } from "../data/profile";
import { useClock } from "../lib/useClock";
import "./Preloader.css";

type Line = { id: string; label: string; done: boolean; detail?: string };

const SEEN_KEY = "kma:case-opened";
const ORDER = ["custody", "fonts", "exhibits", "gl", "seal"];

function registerTasks() {
  loader.task("custody", "Establishing chain of custody", 0.5)("ok");

  loader.track(
    "fonts",
    "Loading typefaces",
    Promise.all([
      document.fonts.load('600 1em "Inter Tight Variable"'),
      document.fonts.load('italic 400 1em "Instrument Serif"'),
      document.fonts.load('500 1em "JetBrains Mono Variable"'),
    ]).then(() => document.fonts.ready),
    2,
    () => "3 families",
  );

  loader.track(
    "exhibits",
    "Mounting exhibits",
    Promise.all(
      projects.map((p) => {
        const img = new Image();
        img.src = p.image;
        return img.decode().catch(() => undefined);
      }),
    ),
    2,
    () => `${projects.length} of ${projects.length}`,
  );

  loader.track("seal", "Sealing case file", caseHash, 1, (h) => `sha256 ${h.slice(0, 8)}…${h.slice(-4)}`);
}

export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const [gone, setGone] = useState(false);
  const clock = useClock();

  useEffect(() => {
    registerTasks();
    return loader.subscribe((tasks) =>
      setLines(tasks.map((t) => ({ ...t })).sort((a, b) => ORDER.indexOf(a.id) - ORDER.indexOf(b.id))),
    );
  }, []);

  useGSAP(
    () => {
      const seen = sessionStorage.getItem(SEEN_KEY) === "1";
      const minTime = reducedMotion ? 0.2 : seen ? 0.7 : 2.4;
      const shown = { v: 0 };
      const started = performance.now();
      let target = 0;
      let exiting = false;

      const unsub = loader.subscribe((_t, p) => (target = p));
      // Never hold a visitor hostage: a stalled asset can't block the case from opening.
      const failsafe = window.setTimeout(() => (target = 1), 9000);

      const exit = () => {
        exiting = true;
        unsub();
        window.clearTimeout(failsafe);
        sessionStorage.setItem(SEEN_KEY, "1");
        const tl = gsap.timeline({
          onComplete: () => {
            setGone(true);
          },
        });
        tl.to(".pre__log li, .pre__meta, .pre__sign", { yPercent: -120, opacity: 0, duration: 0.7, stagger: 0.03, ease: "expo.in" })
          .to(".pre__count", { yPercent: -110, duration: 0.8, ease: "expo.in" }, "<0.1")
          .to(".pre__bar", { scaleX: 0, transformOrigin: "right", duration: 0.6, ease: "expo.inOut" }, "<")
          .add(() => store.set({ phase: "intro" }), "-=0.15")
          .to(".pre__panel--top", { yPercent: -100, duration: 1.25, ease: "expo.inOut" }, "-=0.1")
          .to(".pre__panel--bottom", { yPercent: 100, duration: 1.25, ease: "expo.inOut" }, "<")
          .set(root.current, { pointerEvents: "none" }, "<0.4");
      };

      const tick = () => {
        if (exiting) return;
        const elapsed = (performance.now() - started) / 1000;
        // Displayed progress eases toward real progress, but never faster than the minimum cinematic time.
        const cap = Math.min(1, elapsed / minTime);
        shown.v += (Math.min(target, cap) - shown.v) * 0.12;
        if (Math.min(target, cap) >= 1 && shown.v > 0.995) shown.v = 1;
        const pct = Math.round(shown.v * 100);
        if (counter.current) counter.current.textContent = String(pct).padStart(3, "0");
        if (bar.current) bar.current.style.transform = `scaleX(${shown.v})`;
        if (shown.v === 1) exit();
      };
      gsap.ticker.add(tick);
      return () => {
        gsap.ticker.remove(tick);
        window.clearTimeout(failsafe);
        unsub();
      };
    },
    { scope: root },
  );

  if (gone) return null;

  return (
    <div ref={root} className="pre" role="status" aria-live="polite" aria-label="Loading portfolio">
      <div className="pre__panel pre__panel--top" />
      <div className="pre__panel pre__panel--bottom" />

      <div className="pre__meta pre__meta--tl label">
        <span>{person.initials}</span>
        <span>Case file · {person.caseId}</span>
      </div>
      <div className="pre__meta pre__meta--tr label">
        <span>Bengaluru</span>
        <span>{clock} IST</span>
      </div>

      <ol className="pre__log">
        {lines.map((l) => (
          <li key={l.id} className={l.done ? "is-done" : undefined}>
            <span className="pre__caret">›</span>
            <span className="pre__task">{l.label}</span>
            <span className="pre__leader" aria-hidden="true" />
            <span className="pre__status">{l.done ? (l.detail ?? "ok") : "…"}</span>
          </li>
        ))}
      </ol>

      <div className="pre__foot">
        <div className="pre__count-wrap" aria-hidden="true">
          <span ref={counter} className="pre__count">
            000
          </span>
        </div>
        <p className="pre__sign">
          <span>{person.name}</span>
          <span className="serif">{person.role}</span>
        </p>
      </div>
      <div ref={bar} className="pre__bar" />
    </div>
  );
}
