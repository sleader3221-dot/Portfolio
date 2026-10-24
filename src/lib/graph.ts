import { disciplines, projects, skills, type SkillDomain } from "../data/profile";

export type NodeKind = "project" | "skill" | "hub";
export type GNode = {
  id: string;
  label: string;
  kind: NodeKind;
  domain?: SkillDomain;
  color: string;
  r: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  fixed: boolean;
};
export type GEdge = { a: number; b: number };

export const DOMAIN_COLOR: Record<SkillDomain, string> = {
  "AI / ML": "#ff5a1f",
  Software: "#ece7de",
  Security: "#8f7dff",
  Data: "#e3a64a",
  Infra: "#9fc2a8",
};

/** Builds the skill graph from profile data: projects and discipline hubs link to the skills they use. */
export function buildGraph() {
  const nodes: GNode[] = [];
  const edges: GEdge[] = [];
  const index = new Map<string, number>();
  const lookup = new Map<string, number>();
  const unmapped: string[] = [];

  const add = (n: Omit<GNode, "x" | "y" | "vx" | "vy" | "fixed">) => {
    const i = nodes.length;
    const a = (i / 40) * Math.PI * 2 * 3.1;
    nodes.push({ ...n, x: Math.cos(a) * (80 + i * 6), y: Math.sin(a) * (80 + i * 6), vx: 0, vy: 0, fixed: false });
    index.set(n.id, i);
    return i;
  };

  skills.forEach((s) => {
    const i = add({ id: `s:${s.name}`, label: s.name, kind: "skill", domain: s.domain, color: DOMAIN_COLOR[s.domain], r: 3 });
    [s.name, ...(s.aliases ?? [])].forEach((k) => lookup.set(k.toLowerCase(), i));
  });

  const link = (from: number, items: readonly string[]) => {
    const seen = new Set<number>();
    items.forEach((item) => {
      const to = lookup.get(item.toLowerCase());
      if (to === undefined) return void unmapped.push(item);
      if (seen.has(to)) return;
      seen.add(to);
      edges.push({ a: from, b: to });
    });
  };

  projects.forEach((p) => link(add({ id: `p:${p.id}`, label: p.title, kind: "project", color: p.accent, r: 9 }), p.stack));
  disciplines.forEach((d) => link(add({ id: `h:${d.id}`, label: d.title, kind: "hub", color: "#ece7de", r: 7 }), d.tools));

  // Node size follows degree: the more builds a skill shows up in, the heavier it is.
  const degree = new Array(nodes.length).fill(0) as number[];
  edges.forEach((e) => {
    degree[e.a]!++;
    degree[e.b]!++;
  });
  nodes.forEach((n, i) => {
    if (n.kind === "skill") n.r = 3 + Math.sqrt(degree[i]!) * 2.1;
  });

  if (import.meta.env.DEV && unmapped.length) console.warn("[graph] unmapped stack items:", unmapped);

  const neighbours = nodes.map(() => new Set<number>());
  edges.forEach((e) => {
    neighbours[e.a]!.add(e.b);
    neighbours[e.b]!.add(e.a);
  });

  return { nodes, edges, neighbours, degree, index };
}

/** A small, dependency-free force simulation: repulsion, springs, gentle gravity, velocity damping. */
export function step(nodes: GNode[], edges: GEdge[], alpha: number, w: number, h: number) {
  const n = nodes.length;
  for (let i = 0; i < n; i++) {
    const a = nodes[i]!;
    for (let j = i + 1; j < n; j++) {
      const b = nodes[j]!;
      let dx = b.x - a.x, dy = b.y - a.y;
      let d2 = dx * dx + dy * dy;
      if (d2 < 1) {
        dx = Math.random() - 0.5;
        dy = Math.random() - 0.5;
        d2 = 1;
      }
      const d = Math.sqrt(d2);
      const min = a.r + b.r + 44;
      const f = ((a.kind === "project" || b.kind === "project" ? 9000 : 4600) / d2 + (d < min ? (min - d) * 0.6 : 0)) * alpha;
      const fx = (dx / d) * f, fy = (dy / d) * f;
      a.vx -= fx;
      a.vy -= fy;
      b.vx += fx;
      b.vy += fy;
    }
  }
  for (const e of edges) {
    const a = nodes[e.a]!, b = nodes[e.b]!;
    const dx = b.x - a.x, dy = b.y - a.y;
    const d = Math.sqrt(dx * dx + dy * dy) || 1;
    const rest = a.kind === "hub" || b.kind === "hub" ? 170 : 130;
    const f = (d - rest) * 0.012 * alpha;
    const fx = (dx / d) * f, fy = (dy / d) * f;
    a.vx += fx;
    a.vy += fy;
    b.vx -= fx;
    b.vy -= fy;
  }
  const sx = w / 2, sy = h / 2;
  const aspect = w / Math.max(1, h);
  for (const p of nodes) {
    p.vx += ((sx - p.x) * 0.0016 * alpha) / Math.max(1, aspect * 0.8);
    p.vy += (sy - p.y) * 0.0034 * alpha * Math.max(1, aspect * 0.6);
    if (p.fixed) {
      p.vx = p.vy = 0;
      continue;
    }
    p.vx *= 0.82;
    p.vy *= 0.82;
    p.x += p.vx;
    p.y += p.vy;
    const pad = p.r + 18;
    p.x = Math.min(w - pad, Math.max(pad, p.x));
    p.y = Math.min(h - pad, Math.max(pad, p.y));
  }
}
