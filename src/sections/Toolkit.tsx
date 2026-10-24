import { useEffect, useMemo, useRef, useState } from "react";
import { useGSAP } from "../lib/gsap";
import { reveal } from "../lib/reveal";
import { reducedMotion } from "../lib/env";
import { buildGraph, DOMAIN_COLOR, step } from "../lib/graph";
import SectionHead from "../components/SectionHead";
import { skills, type SkillDomain } from "../data/profile";
import "./Toolkit.css";

const DOMAINS = Object.keys(DOMAIN_COLOR) as SkillDomain[];

export default function Toolkit() {
  const root = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const graph = useMemo(() => buildGraph(), []);
  const [focus, setFocus] = useState<number | null>(null);
  const [domain, setDomain] = useState<SkillDomain | null>(null);
  const focusRef = useRef<number | null>(null);
  const domainRef = useRef<SkillDomain | null>(null);

  useGSAP(() => reveal(root.current!), { scope: root });

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const { nodes, edges, neighbours } = graph;
    let w = 0, h = 0, dpr = 1;
    let alpha = 1;
    let raf = 0;
    let visible = false;
    let placed = false;
    let drag: number | null = null;
    let hover: number | null = null;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const pw = w, ph = h;
      w = r.width;
      h = r.height;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      if (!placed) {
        nodes.forEach((n) => {
          n.x += w / 2;
          n.y += h / 2;
        });
        placed = true;
        settle();
        alpha = 0.18;
      } else if (pw && ph) {
        nodes.forEach((n) => {
          n.x *= w / pw;
          n.y *= h / ph;
        });
      }
      alpha = Math.max(alpha, 0.25);
      draw();
    };

    const settle = () => {
      for (let i = 0; i < 400; i++) step(nodes, edges, 1 - i / 400, w, h);
    };

    const active = () => focusRef.current ?? hover;

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const f = active();
      const dom = domainRef.current;
      const lit = (i: number) => {
        if (f !== null) return i === f || neighbours[f]!.has(i);
        if (dom) return nodes[i]!.domain === dom || [...neighbours[i]!].some((j) => nodes[j]!.domain === dom && nodes[i]!.kind !== "skill");
        return true;
      };

      for (const e of edges) {
        const a = nodes[e.a]!, b = nodes[e.b]!;
        const hot = f !== null ? e.a === f || e.b === f : dom ? a.domain === dom || b.domain === dom : false;
        ctx.strokeStyle = hot ? (f !== null ? nodes[f]!.color : DOMAIN_COLOR[dom!]) : "rgba(236,231,222,0.09)";
        ctx.globalAlpha = hot ? 0.75 : f !== null || dom ? 0.35 : 1;
        ctx.lineWidth = hot ? 1.2 : 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      nodes.forEach((n, i) => {
        const on = lit(i);
        ctx.globalAlpha = on ? 1 : 0.16;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        if (n.kind === "skill") {
          ctx.fillStyle = n.color;
          ctx.fill();
        } else {
          ctx.fillStyle = "#08080a";
          ctx.fill();
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = n.color;
          if (n.kind === "hub") ctx.setLineDash([3, 3]);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.beginPath();
          ctx.arc(n.x, n.y, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = n.color;
          ctx.fill();
        }
        if (i === f) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r + 7, 0, Math.PI * 2);
          ctx.strokeStyle = n.color;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        const big = n.kind !== "skill";
        ctx.font = big ? `italic 400 ${n.kind === "project" ? 21 : 16}px "Instrument Serif", serif` : `500 10.5px "JetBrains Mono Variable", monospace`;
        ctx.fillStyle = on ? (big ? "#ece7de" : "rgba(236,231,222,0.78)") : "rgba(236,231,222,0.5)";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        const text = big ? n.label : n.label.toUpperCase();
        ctx.fillText(text, n.x + n.r + 8, n.y + (big ? 1 : 0.5));
      });
      ctx.globalAlpha = 1;
    };

    const loop = () => {
      raf = 0;
      if (!visible) return;
      if (alpha > 0.02 || drag !== null) {
        step(nodes, edges, alpha, w, h);
        alpha *= 0.992;
      }
      draw();
      raf = requestAnimationFrame(loop);
    };
    const kick = () => {
      if (!raf && visible) raf = requestAnimationFrame(loop);
    };

    const pick = (x: number, y: number) => {
      let best: number | null = null;
      let bd = Infinity;
      nodes.forEach((n, i) => {
        const d = Math.hypot(n.x - x, n.y - y);
        if (d < n.r + 12 && d < bd) {
          bd = d;
          best = i;
        }
      });
      return best;
    };
    const local = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top] as const;
    };
    const onMove = (e: PointerEvent) => {
      const [x, y] = local(e);
      if (drag !== null) {
        const n = nodes[drag]!;
        n.x = x;
        n.y = y;
        alpha = Math.max(alpha, 0.35);
        kick();
        return;
      }
      const hit = pick(x, y);
      if (hit !== hover) {
        hover = hit;
        if (hit !== null) canvas.dataset.cursor = "Drag";
        else delete canvas.dataset.cursor;
        draw();
      }
    };
    const onDown = (e: PointerEvent) => {
      const [x, y] = local(e);
      const hit = pick(x, y);
      if (hit === null) {
        setFocus(null);
        return;
      }
      drag = hit;
      nodes[hit]!.fixed = true;
      canvas.setPointerCapture(e.pointerId);
      setFocus(hit);
    };
    const onUp = () => {
      if (drag !== null) nodes[drag]!.fixed = false;
      drag = null;
    };
    const onLeave = () => {
      hover = null;
      draw();
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      if (visible) {
        alpha = Math.max(alpha, reducedMotion ? 0 : 0.12);
        kick();
      }
    });
    io.observe(canvas);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.addEventListener("pointerleave", onLeave);
    (canvas as HTMLCanvasElement & { redraw?: () => void }).redraw = draw;

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [graph]);

  // The canvas loop reads focus through refs; sync them and redraw when the DOM side changes them.
  useEffect(() => {
    focusRef.current = focus;
    domainRef.current = domain;
    (canvasRef.current as (HTMLCanvasElement & { redraw?: () => void }) | null)?.redraw?.();
  }, [focus, domain]);

  const focused = focus !== null ? graph.nodes[focus] : null;
  const linked = focus !== null ? [...graph.neighbours[focus]!].map((i) => graph.nodes[i]!) : [];
  const selectSkill = (name: string) => setFocus(graph.index.get(`s:${name}`) ?? null);

  return (
    <section ref={root} id="toolkit" className="section toolkit" aria-labelledby="toolkit-title">
      <div className="wrap">
        <SectionHead index="04" label="Toolkit" aside={`${skills.length} tools · traced to shipped work`} />
        <div className="toolkit__intro">
          <h2 id="toolkit-title" className="toolkit__title" data-reveal="lines">
            Nothing listed <span className="serif">without a build behind it.</span>
          </h2>
          <p className="toolkit__lead" data-reveal="fade">
            Every tool here is wired to the projects that use it. Hover or drag a node to trace its links — or pick
            one from the index.
          </p>
        </div>

        <div className="toolkit__grid">
          <div className="toolkit__stage" data-reveal="fade">
            <canvas ref={canvasRef} className="toolkit__canvas" data-interactive aria-hidden="true" />
            <div className="toolkit__legend label" aria-hidden="true">
              <span><i className="lg lg--project" /> Project</span>
              <span><i className="lg lg--hub" /> Discipline</span>
              <span><i className="lg lg--skill" /> Tool · size = usage</span>
            </div>
          </div>

          <aside className="toolkit__panel" aria-live="polite">
            <div className="toolkit__readout">
              {focused ? (
                <>
                  <p className="label label--ember">
                    {focused.kind === "project" ? "Project" : focused.kind === "hub" ? "Discipline" : focused.domain}
                  </p>
                  <p className="toolkit__name">{focused.label}</p>
                  <p className="label">
                    {focused.kind === "skill" ? "Used in" : "Built with"} · {linked.length}
                  </p>
                  <ul className="toolkit__linked">
                    {linked.map((n) => (
                      <li key={n.id} style={{ color: n.kind === "skill" ? n.color : undefined }}>
                        {n.label}
                      </li>
                    ))}
                  </ul>
                  <button className="toolkit__clear label" onClick={() => setFocus(null)}>
                    Clear ×
                  </button>
                </>
              ) : (
                <>
                  <p className="label">Readout</p>
                  <p className="toolkit__name">Select a node</p>
                  <p className="toolkit__hint">
                    {graph.nodes.length} nodes · {graph.edges.length} links
                  </p>
                </>
              )}
            </div>

            <div className="toolkit__index">
              {DOMAINS.map((d) => (
                <div
                  key={d}
                  className="toolkit__domain"
                  onPointerEnter={() => setDomain(d)}
                  onPointerLeave={() => setDomain(null)}
                >
                  <p className="label" style={{ color: DOMAIN_COLOR[d] }}>
                    {d}
                  </p>
                  <ul>
                    {skills
                      .filter((s) => s.domain === d)
                      .map((s) => (
                        <li key={s.name}>
                          <button
                            className={focused?.label === s.name ? "is-on" : undefined}
                            onClick={() => selectSkill(s.name)}
                            onFocus={() => selectSkill(s.name)}
                          >
                            {s.name}
                          </button>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
