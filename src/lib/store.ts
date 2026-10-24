import { useSyncExternalStore } from "react";
import type { SectionId } from "../data/profile";

type State = { phase: "loading" | "intro" | "ready"; section: SectionId; menuOpen: boolean };

let state: State = { phase: "loading", section: "top", menuOpen: false };
const listeners = new Set<() => void>();

export const store = {
  get: () => state,
  set(patch: Partial<State>) {
    const next = { ...state, ...patch };
    if (Object.keys(patch).every((k) => next[k as keyof State] === state[k as keyof State])) return;
    state = next;
    listeners.forEach((l) => l());
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export function useStore<T>(select: (s: State) => T): T {
  return useSyncExternalStore(store.subscribe, () => select(state), () => select(state));
}
