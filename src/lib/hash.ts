/** SHA-256 hex digest — used to fingerprint the case file, the way ProofSIFT seals evidence. */
export async function sha256(text: string): Promise<string> {
  if (!crypto?.subtle) return "unavailable-insecure-context";
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
