/**
 * Procedural point-cloud "forms" the evidence field morphs between.
 * Every form is generated from a seeded PRNG, so the site renders identically on every visit.
 *
 *   0 · Latent print   — a synthetic fingerprint (identity, forensics)
 *   1 · Neural core    — a noise-displaced shell laced with synaptic arcs (AI)
 *   2 · Double helix   — two strands, AI + DFIR, bridged by rungs (method)
 *   3 · Topography     — contour lines of an evidence landscape (work)
 *   4 · Portal         — a ring and the tunnel behind it (contact)
 */

export type Forms = { positions: Float32Array[]; rand: Float32Array; count: number };

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Compact 3D value noise with smooth interpolation; plenty for shaping static geometry.
function hash3(x: number, y: number, z: number) {
  let h = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(z, 2147483647);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}
const fade = (t: number) => t * t * (3 - 2 * t);
function noise3(x: number, y: number, z: number) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const xf = fade(x - xi), yf = fade(y - yi), zf = fade(z - zi);
  const l = (a: number, b: number, t: number) => a + (b - a) * t;
  const c = (dx: number, dy: number, dz: number) => hash3(xi + dx, yi + dy, zi + dz);
  return (
    l(
      l(l(c(0, 0, 0), c(1, 0, 0), xf), l(c(0, 1, 0), c(1, 1, 0), xf), yf),
      l(l(c(0, 0, 1), c(1, 0, 1), xf), l(c(0, 1, 1), c(1, 1, 1), xf), yf),
      zf,
    ) *
      2 -
    1
  );
}
const fbm2 = (x: number, y: number) =>
  noise3(x, y, 0.5) * 0.55 + noise3(x * 2.1, y * 2.1, 3.7) * 0.28 + noise3(x * 4.3, y * 4.3, 9.1) * 0.17;

const smooth = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

function fingerprint(out: Float32Array, n: number, rnd: () => number) {
  const cx = 0.03, cy = 0.2, freq = 10.5;
  let i = 0;
  while (i < n) {
    const x = rnd() * 2.2 - 1.1;
    const y = rnd() * 2.9 - 1.45;
    // Elliptical pad with an organic edge, denser towards the core.
    const edge = (x / 1.0) ** 2 + (y / 1.38) ** 2 + noise3(x * 3, y * 3, 1) * 0.08;
    if (edge > 1) continue;
    if (rnd() > 1.15 - edge * 0.55) continue;

    const dx = x - cx, dy = y - cy;
    const ang = Math.atan2(dy, dx);
    const r = Math.hypot(dx, dy * 0.86);
    // Whorl around the core that relaxes into arches below the delta.
    const whorl = r * (1 + 0.16 * Math.sin(ang * 2 + 0.7)) + fbm2(x * 2.2, y * 2.2) * 0.05;
    const arch = -dy * 0.9 + 0.34 * x * x + Math.sin(x * 2.4) * 0.05 + 0.55;
    const phase = whorl + (arch - whorl) * smooth(-0.15, -0.85, dy);

    const ridge = Math.cos(phase * freq * Math.PI * 2);
    if (ridge < 0.5) continue;
    // Ridge endings & bifurcations: minutiae are what make a print unique.
    if (noise3(x * 6.5, y * 6.5, 7) > 0.58) continue;

    const o = i * 3;
    out[o] = x * 1.25 + (rnd() - 0.5) * 0.008;
    out[o + 1] = y * 1.25 + (rnd() - 0.5) * 0.008;
    out[o + 2] = -0.5 * (x * x + y * y) + (rnd() - 0.5) * 0.03;
    i++;
  }
}

function neuralCore(out: Float32Array, n: number, rnd: () => number) {
  const R = 1.45;
  const unit = () => {
    const z = rnd() * 2 - 1, t = rnd() * Math.PI * 2, s = Math.sqrt(1 - z * z);
    return [s * Math.cos(t), s * Math.sin(t), z] as const;
  };
  const shell = Math.floor(n * 0.62);
  for (let i = 0; i < shell; i++) {
    const [ux, uy, uz] = unit();
    const d = R * (1 + 0.16 * noise3(ux * 1.8 + 3, uy * 1.8, uz * 1.8)) + (rnd() - 0.5) * 0.03;
    out.set([ux * d, uy * d, uz * d], i * 3);
  }
  // Synaptic arcs that dip through the interior between two surface points.
  let i = shell;
  while (i < n) {
    const a = unit(), b = unit();
    const len = 40 + Math.floor(rnd() * 60);
    for (let k = 0; k < len && i < n; k++, i++) {
      const t = k / (len - 1);
      const x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t, z = a[2] + (b[2] - a[2]) * t;
      const m = Math.hypot(x, y, z) || 1;
      const sag = R * (1 - 0.42 * Math.sin(Math.PI * t));
      out.set([(x / m) * sag + (rnd() - 0.5) * 0.02, (y / m) * sag + (rnd() - 0.5) * 0.02, (z / m) * sag], i * 3);
    }
  }
}

function helix(out: Float32Array, n: number, rnd: () => number) {
  const R = 0.78, k = 1.55, L = 4.6;
  for (let i = 0; i < n; i++) {
    const pick = rnd();
    let x: number, y: number, z: number;
    if (pick < 0.5) {
      x = (rnd() * 2 - 1) * L;
      const ph = x * k + (rnd() < 0.5 ? 0 : Math.PI);
      const j = R + (rnd() - 0.5) * 0.07;
      y = Math.cos(ph) * j;
      z = Math.sin(ph) * j;
    } else if (pick < 0.82) {
      const step = 0.29;
      x = Math.round(((rnd() * 2 - 1) * L) / step) * step;
      const t = rnd();
      const ph = x * k;
      y = Math.cos(ph) * R * (1 - 2 * t) + (rnd() - 0.5) * 0.02;
      z = Math.sin(ph) * R * (1 - 2 * t) + (rnd() - 0.5) * 0.02;
    } else {
      x = (rnd() * 2 - 1) * L * 1.1;
      const a = rnd() * Math.PI * 2, r = R * (1.3 + rnd() * 1.4);
      y = Math.cos(a) * r;
      z = Math.sin(a) * r;
    }
    out.set([x, y, z], i * 3);
  }
}

function topography(out: Float32Array, n: number, rnd: () => number) {
  let i = 0;
  while (i < n) {
    const x = (rnd() * 2 - 1) * 7;
    const z = rnd() * -9 + 2.5;
    const h = fbm2(x * 0.22 + 4, z * 0.22 + 2);
    const contour = Math.abs(((h * 9) % 1 + 1) % 1 - 0.5);
    const onLine = contour < 0.07;
    if (!onLine && rnd() > 0.05) continue;
    out.set([x, h * 1.5 - 1.35, z], i * 3);
    i++;
  }
}

function portal(out: Float32Array, n: number, rnd: () => number) {
  const R = 2.05;
  for (let i = 0; i < n; i++) {
    const a = rnd() * Math.PI * 2;
    const pick = rnd();
    let r: number, z: number;
    if (pick < 0.5) {
      const g = (rnd() + rnd() + rnd() - 1.5) * 0.11;
      r = R + g;
      z = (rnd() + rnd() - 1) * 0.08;
    } else if (pick < 0.68) {
      r = R + Math.pow(rnd(), 2.2) * 1.6;
      z = (rnd() - 0.5) * 0.4;
    } else {
      z = -rnd() * 14;
      r = R * (0.92 + Math.sin(z * 0.7) * 0.06) + (rnd() - 0.5) * 0.05;
    }
    out.set([Math.cos(a) * r, Math.sin(a) * r, z], i * 3);
  }
}

export function buildForms(count: number): Forms {
  const rnd = mulberry32(0x4b4d41); // "KMA"
  const makers = [fingerprint, neuralCore, helix, topography, portal];
  const positions = makers.map((make) => {
    const arr = new Float32Array(count * 3);
    make(arr, count, rnd);
    return arr;
  });
  // Shuffle every form after the first so particles travel far between shapes — the scatter is the drama.
  for (let f = 1; f < positions.length; f++) {
    const arr = positions[f]!;
    for (let i = count - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      for (let c = 0; c < 3; c++) {
        const t = arr[i * 3 + c]!;
        arr[i * 3 + c] = arr[j * 3 + c]!;
        arr[j * 3 + c] = t;
      }
    }
  }
  const rand = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) {
    const big = rnd() < 0.04;
    rand.set([rnd(), big ? 1.6 + rnd() * 1.4 : 0.45 + rnd() * 0.75, rnd(), rnd()], i * 4);
  }
  return { positions, rand, count };
}
