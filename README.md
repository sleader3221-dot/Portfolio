# Karthik M Achalakar — Case File KMA-2026

A cinematic WebGL portfolio for a Software, AI/ML & DFIR engineer, staged as a forensic case file.
v10 is a full rebuild. Nothing is left from the v1 template (the 3D character, the physics balls and the stock scroll effects are all gone).

## The concept

Every section is an exhibit in an investigation, and one GPU particle field follows you through it, changing shape as the story moves on:

| Exhibit | Section | The field becomes | Signature interaction |
|---|---|---|---|
| 00 | Case file (hero) | A procedurally generated **fingerprint** | A **UV-torch cursor** reveals hidden "latent ink" case notes |
| 01 | Subject | A **neural core** laced with synaptic arcs | The statement **declassifies**: redaction bars lift word by word as you scroll |
| 02 | Method | A **double helix** (AI + DFIR) | A pinned six-step sequence through the ProofSIFT loop |
| 03 | Evidence | A **topographic contour map** | A pinned horizontal gallery of eight exhibits with frame parallax and velocity skew |
| 04 | Toolkit | (dimmed) | A force-directed **knowledge graph** that links every skill to the shipped work behind it |
| 05 | Record | (dimmed) | A timeline whose spine draws itself as you scroll |
| 06 | Open a case | A **portal ring** | A variable-weight kinetic headline, then the camera dives through the portal |

Other details:
- A preloader that reports **real** loading tasks.
- A **SHA-256 seal**, computed in the browser from the profile data. It also drives the barcode on the evidence tag.
- A live Bengaluru clock.
- A contextual cursor and a velocity-reactive marquee.

## Stack

| Layer | Choice |
|---|---|
| Build | Vite 8 (Rolldown) · TypeScript 6 (strict, `noUncheckedIndexedAccess`) |
| UI | React 19.3 |
| WebGL | Three.js r186 with a hand-written GLSL point shader (5 baked forms blended on the GPU, simplex-noise turbulence, ray-distance pointer field) |
| Motion | GSAP 3.15 (ScrollTrigger, SplitText, matchMedia) · Lenis 1.3 smooth scroll on one shared ticker |
| Type | Inter Tight Variable · Instrument Serif · JetBrains Mono Variable (all self-hosted via Fontsource) |
| Lint | ESLint 10 · typescript-eslint · React Compiler hook rules |

## Engineering notes

- **One source of truth.** Every fact lives in `src/data/profile.ts`, with its sources listed at the top. Components only render it.
- **No React in the render loop.** ScrollTrigger and pointer handlers write to a mutable `bridge`. The WebGL loop reads and smooths it every frame.
- **Code-split 3D.** Three.js loads while the preloader runs. Shaders are compiled before the curtain opens, so the first frame never hitches.
- **Adaptive.** The particle count (64k / 38k / 20k) and pixel ratio follow the device. Rendering pauses when the tab is hidden, and the graph only simulates while it's on screen.
- **Accessible.** It has a skip link, landmarks, a keyboard menu (Esc closes it and focus returns to the button), and `aria-live` readouts. Under `prefers-reduced-motion` there are no pins, scrubbing or smooth scroll, and all content stays visible.
- **Small.** About 275 KB of gzipped JS in total, with Three.js in a separate 135 KB chunk. The project screenshots are WebP, about 540 KB for all eight.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build → dist/
npm run preview    # serve dist/
npm run lint
```

## Structure

```
src/
  data/profile.ts        every fact on the site (verified sources listed at the top)
  gl/                    Stage (renderer, camera shots), forms (procedural point clouds), shaders/
  lib/                   scroll engine, store, bridge, loader, reveal, graph sim, hash, helpers
  components/            Preloader, Header + menu, Rail, Cursor, Marquee, Field, Choreography
  sections/              Hero, Subject, Method, Evidence, Toolkit, Record, Contact
public/images/work/      fresh screenshots of each live project
```

## Updating content

- **Add or edit a project:** add an entry to `projects` in `src/data/profile.ts` and drop a 1600×1000 WebP into `public/images/work/`. The gallery, counters, graph edges and SHA-256 seal all update on their own.
- **Fix an unmapped tool:** a stack item that doesn't match any skill shows up as a console warning in dev. Add it as a skill or as an alias.

## Deploy

`vercel.json` is set up for Vite: SPA rewrites, immutable caching for hashed assets, and security headers (HSTS, `nosniff`, `DENY` framing, Permissions-Policy).
After the first deploy, change `og:image` in `index.html` to the absolute URL of your domain, because link previews need absolute URLs.

---

The v1 template is archived in `backup/v1/` (gitignored).
MIT licensed. See [LICENSE](LICENSE).
