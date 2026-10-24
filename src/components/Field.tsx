import { useEffect, useRef } from "react";
import { bridge } from "../lib/bridge";
import { deviceTier, reducedMotion } from "../lib/env";
import { loader } from "../lib/loader";

const COUNTS = { high: 64000, mid: 38000, low: 20000 } as const;
const DPR = { high: 1.75, mid: 1.5, low: 1.25 } as const;

/** Fixed full-viewport WebGL layer. Three.js is code-split and loaded while the preloader runs. */
export default function Field() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const done = loader.task("gl", "Compiling evidence field", 3);
    let stage: import("../gl/Stage").Stage | null = null;
    let disposed = false;

    import("../gl/Stage")
      .then(({ Stage }) => {
        if (disposed) return;
        const tier = deviceTier();
        stage = new Stage(canvas, COUNTS[tier], DPR[tier], !reducedMotion);
        stage.start();
        done(`${COUNTS[tier].toLocaleString("en-IN")} pts`);
      })
      .catch(() => {
        canvas.style.display = "none";
        done("2D fallback");
      });

    const onResize = () => stage?.resize();
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      bridge.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      bridge.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
      bridge.pointer.active = true;
    };
    const onLeave = () => (bridge.pointer.active = false);
    const onVisibility = () => (document.hidden ? stage?.stop() : stage?.start());

    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      disposed = true;
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      stage?.dispose();
    };
  }, []);

  return <canvas ref={ref} className="field" aria-hidden="true" />;
}
