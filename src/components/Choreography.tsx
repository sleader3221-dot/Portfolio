import { useEffect } from "react";
import { ScrollTrigger, useGSAP } from "../lib/gsap";
import { bridge } from "../lib/bridge";
import { store } from "../lib/store";
import { lockScroll, startScroll } from "../lib/scroll";
import { reducedMotion } from "../lib/env";
import { sections, type SectionId } from "../data/profile";

/** Sections where the field changes form, in order: core → helix → topography → portal. */
const MORPH_ANCHORS = ["#subject", "#method", "#evidence", "#contact"];

/** How visible the field is behind each section's content. */
const DIM: Record<SectionId, number> = {
  top: 0.9,
  subject: 0.55,
  method: 0.75,
  evidence: 0.5,
  toolkit: 0.28,
  record: 0.45,
  contact: 0.95,
};

/**
 * Wires the page's scroll to the WebGL field and the app store. Mounted last, so every pin above
 * it already exists and all of its measurements include pin spacing.
 */
export default function Choreography() {
  useEffect(() => {
    startScroll();
    lockScroll(true);
    const unsub = store.subscribe(() => {
      if (store.get().phase !== "loading" && !store.get().menuOpen) {
        lockScroll(false);
        ScrollTrigger.refresh();
      }
    });
    document.fonts.ready.then(() => ScrollTrigger.refresh());
    return () => void unsub();
  }, []);

  useGSAP(() => {
    const progress = MORPH_ANCHORS.map(() => 0);
    const write = () => (bridge.morph = progress.reduce((a, b) => a + b, 0));

    MORPH_ANCHORS.forEach((sel, i) => {
      ScrollTrigger.create({
        trigger: sel,
        start: "top 90%",
        end: "top 10%",
        onUpdate: (self) => {
          progress[i] = reducedMotion ? Math.round(self.progress) : self.progress;
          write();
        },
        onRefresh: (self) => {
          progress[i] = self.progress;
          write();
        },
      });
    });

    sections.forEach((s) => {
      ScrollTrigger.create({
        trigger: `#${s.id}`,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => {
          if (!self.isActive) return;
          store.set({ section: s.id });
          bridge.dim = DIM[s.id];
        },
      });
    });

    ScrollTrigger.create({
      trigger: "#contact",
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => (bridge.dive = reducedMotion ? 0 : self.progress * 0.72),
    });
  });

  return null;
}
