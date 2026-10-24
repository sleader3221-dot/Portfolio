/**
 * Real loading tasks the preloader reports on. Each task resolves once; progress is weighted.
 */
type Task = { id: string; label: string; weight: number; done: boolean; detail?: string };
type Listener = (tasks: readonly Task[], progress: number) => void;

const tasks: Task[] = [];
const listeners = new Set<Listener>();

const progress = () => {
  const total = tasks.reduce((s, t) => s + t.weight, 0) || 1;
  return tasks.reduce((s, t) => s + (t.done ? t.weight : 0), 0) / total;
};
const emit = () => listeners.forEach((l) => l(tasks, progress()));

export const loader = {
  /** Register a task; returns a resolver. Registering the same id twice returns the same resolver. */
  task(id: string, label: string, weight = 1) {
    let t = tasks.find((x) => x.id === id);
    if (!t) {
      t = { id, label, weight, done: false };
      tasks.push(t);
      emit();
    }
    const ref = t;
    return (detail?: string) => {
      if (ref.done) return;
      ref.done = true;
      ref.detail = detail;
      emit();
    };
  },
  track<T>(id: string, label: string, p: Promise<T>, weight = 1, detail?: (v: T) => string) {
    const done = this.task(id, label, weight);
    p.then((v) => done(detail?.(v)), () => done("skipped"));
    return p;
  },
  subscribe(l: Listener) {
    listeners.add(l);
    l(tasks, progress());
    return () => void listeners.delete(l);
  },
};
