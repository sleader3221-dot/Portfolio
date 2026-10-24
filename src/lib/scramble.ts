const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&/<>*+=";

/**
 * Decrypt-style text reveal: characters cycle through glyphs and lock in left to right.
 * Returns a cancel function.
 */
export function scramble(el: HTMLElement, finalText: string, duration = 900): () => void {
  const start = performance.now();
  let raf = 0;
  const tick = (now: number) => {
    const p = Math.min(1, (now - start) / duration);
    const locked = Math.floor(p * finalText.length);
    let out = "";
    for (let i = 0; i < finalText.length; i++) {
      const ch = finalText[i] ?? "";
      out += i < locked || ch === " " ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0];
    }
    el.textContent = out;
    if (p < 1) raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => {
    cancelAnimationFrame(raf);
    el.textContent = finalText;
  };
}
