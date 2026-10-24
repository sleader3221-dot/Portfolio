import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "../lib/gsap";
import { useStore } from "../lib/store";
import { scrollToTarget } from "../lib/scroll";
import { sections } from "../data/profile";
import "./Rail.css";

/** Right-edge exhibit index: where you are, how far you've read, one click to any exhibit. */
export default function Rail() {
  const root = useRef<HTMLElement>(null);
  const active = useStore((s) => s.section);
  const phase = useStore((s) => s.phase);

  useGSAP(
    () => {
      const fill = root.current?.querySelector<HTMLElement>(".rail__fill");
      if (!fill) return;
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => gsap.set(fill, { scaleY: self.progress }),
      });
    },
    { scope: root },
  );

  return (
    <nav ref={root} className={`rail ${phase === "loading" ? "" : "is-in"}`} aria-label="Exhibit index">
      <span className="rail__track" aria-hidden="true">
        <span className="rail__fill" />
      </span>
      <ol>
        {sections.map((s) => (
          <li key={s.id} className={s.id === active ? "is-active" : undefined}>
            <a
              href={`#${s.id}`}
              aria-current={s.id === active ? "true" : undefined}
              onClick={(e) => {
                e.preventDefault();
                scrollToTarget(`#${s.id}`);
              }}
              data-cursor={s.label}
            >
              <span className="rail__label label">{s.label}</span>
              <span className="rail__idx label">{s.index}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
