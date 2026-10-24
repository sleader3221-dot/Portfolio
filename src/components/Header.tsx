import { useEffect, useRef } from "react";
import { gsap, useGSAP } from "../lib/gsap";
import { useStore, store } from "../lib/store";
import { lockScroll, scrollToTarget } from "../lib/scroll";
import { scramble } from "../lib/scramble";
import { useClock } from "../lib/useClock";
import { links, person, sections } from "../data/profile";
import "./Header.css";

export default function Header() {
  const section = useStore((s) => s.section);
  const open = useStore((s) => s.menuOpen);
  const phase = useStore((s) => s.phase);
  const clock = useClock();
  const labelRef = useRef<HTMLSpanElement>(null);
  const indexRef = useRef<HTMLSpanElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const current = sections.find((s) => s.id === section) ?? sections[0];

  // Decrypt the exhibit label whenever the active section changes.
  useEffect(() => {
    if (!labelRef.current || !indexRef.current) return;
    const a = scramble(labelRef.current, current.label, 650);
    const b = scramble(indexRef.current, current.index, 400);
    return () => {
      a();
      b();
    };
  }, [current]);

  useGSAP(
    () => {
      gsap.set(".menu", { clipPath: "inset(0% 0% 100% 0%)", visibility: "hidden" });
    },
    { scope: menuRef },
  );

  useEffect(() => {
    if (phase === "loading") return;
    gsap.fromTo(".hdr > *", { yPercent: -120, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.4, stagger: 0.08, delay: 0.5 });
  }, [phase]);

  // Called from event handlers only.
  function animateMenu(next: boolean) {
    const q = gsap.utils.selector(menuRef.current);
    const menu = q(".menu");
    gsap.killTweensOf([menu, q(".menu__link-inner"), q(".menu__aside > *")]);
    const tl = gsap.timeline({ defaults: { ease: "expo.inOut" } });
    if (next) {
      tl.set(menu, { visibility: "visible" })
        .to(menu, { clipPath: "inset(0% 0% 0% 0%)", duration: 1 })
        .fromTo(q(".menu__link-inner"), { yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: 0.05, ease: "expo.out" }, "-=0.55")
        .fromTo(q(".menu__aside > *"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.05, duration: 0.8, ease: "expo.out" }, "<0.2")
        .add(() => q<HTMLAnchorElement>(".menu__link")[0]?.focus());
    } else {
      tl.to(q(".menu__link-inner"), { yPercent: -110, duration: 0.6, stagger: 0.02, ease: "expo.in" })
        .to(menu, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.9 }, "-=0.25")
        .set(menu, { visibility: "hidden" });
    }
  }

  const setOpen = (next: boolean) => {
    store.set({ menuOpen: next });
    lockScroll(next);
    animateMenu(next);
    if (!next) buttonRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (open) {
      setOpen(false);
      window.setTimeout(() => scrollToTarget(`#${id}`), 450);
    } else scrollToTarget(`#${id}`);
  };

  return (
    <>
      <header className="hdr">
        <a href="#top" className="hdr__mark" onClick={go("top")} data-cursor="Top" aria-label={`${person.name} — back to top`}>
          <span className="hdr__mono">{person.initials}</span>
          <span className="label hdr__case">Case {person.caseId}</span>
        </a>

        <p className="hdr__now label" aria-hidden="true">
          <span className="hdr__now-k">Exhibit</span> <span ref={indexRef}>{current.index}</span>
          <span className="hdr__rule" />
          <span ref={labelRef} className="hdr__now-v">
            {current.label}
          </span>
        </p>

        <div className="hdr__right">
          <span className="label hdr__clock">
            <span className="dot" /> BLR {clock}
          </span>
          <button
            ref={buttonRef}
            className={`hdr__menu ${open ? "is-open" : ""}`}
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen(!open)}
          >
            <span className="label">{open ? "Close" : "Menu"}</span>
            <span className="hdr__burger" aria-hidden="true">
              <i />
              <i />
            </span>
          </button>
        </div>
      </header>

      <div ref={menuRef}>
        <nav id="site-menu" className="menu" aria-label="Sections" aria-hidden={!open} inert={!open}>
          <ol className="menu__list">
            {sections.slice(1).map((s) => (
              <li key={s.id}>
                <a className="menu__link" href={`#${s.id}`} onClick={go(s.id)} data-cursor="Go">
                  <span className="menu__link-inner">
                    <span className="menu__idx label">{s.index}</span>
                    <span className="menu__txt">{s.label}</span>
                  </span>
                </a>
              </li>
            ))}
          </ol>
          <aside className="menu__aside">
            <p className="label">Direct line</p>
            <a className="menu__mail" href={`mailto:${person.email}`} data-cursor="Write">
              {person.email}
            </a>
            <div className="menu__socials">
              <a href={links.github} target="_blank" rel="noreferrer">GitHub ↗</a>
              <a href={links.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
              <a href={links.devpost} target="_blank" rel="noreferrer">Devpost ↗</a>
            </div>
            <p className="label menu__status">
              <span className="dot" /> {person.availability} · {person.location}
            </p>
          </aside>
        </nav>
      </div>
    </>
  );
}
