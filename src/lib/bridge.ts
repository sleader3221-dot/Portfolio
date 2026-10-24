/**
 * Mutable state shared between the DOM choreography (ScrollTrigger) and the WebGL loop.
 * Written by scroll/pointer callbacks, read every frame — no React renders involved.
 */
export const bridge = {
  /** 0 latent print · 1 neural core · 2 helix · 3 topography · 4 portal (fractional while morphing) */
  morph: 0,
  /** 0 → 1 assembly of the particle field after the preloader. */
  intro: 0,
  /** 0 → 1 camera push through the portal at the very end of the page. */
  dive: 0,
  /** Field opacity, dimmed behind dense content. */
  dim: 1,
  /** Normalised pointer, -1..1, and whether it is over the window. */
  pointer: { x: 0, y: 0, active: false },
};
