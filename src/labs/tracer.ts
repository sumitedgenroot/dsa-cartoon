import type { Frame } from "./types";

export class Tracer {
  ops = 0;
  frames: Frame[] = [];
  truncated = false;

  constructor(
    public record = true,
    public max = 700,
  ) {}

  op(k = 1) {
    this.ops += k;
  }

  /** Records a frame. The builder only runs when recording, so race runs stay fast. */
  snap(build: () => Omit<Frame, "ops">) {
    if (!this.record) return;
    if (this.frames.length >= this.max) {
      this.truncated = true;
      return;
    }
    this.frames.push({ ...build(), ops: this.ops });
  }
}

/** Merge sort that counts comparisons on the tracer — used where an approach sorts first. */
export function countedSort<T>(arr: T[], cmp: (a: T, b: T) => number, t: Tracer): T[] {
  const a = arr.slice();
  const tmp = new Array<T>(a.length);
  const rec = (l: number, r: number) => {
    if (r - l < 1) return;
    const m = (l + r) >> 1;
    rec(l, m);
    rec(m + 1, r);
    let i = l,
      j = m + 1,
      k = l;
    while (i <= m && j <= r) {
      t.op();
      tmp[k++] = cmp(a[i], a[j]) <= 0 ? a[i++] : a[j++];
    }
    while (i <= m) tmp[k++] = a[i++];
    while (j <= r) tmp[k++] = a[j++];
    for (let x = l; x <= r; x++) a[x] = tmp[x];
  };
  rec(0, a.length - 1);
  return a;
}

/** Binary min-heap with op counting (sift steps). */
export class CountedHeap {
  h: number[] = [];
  constructor(private t: Tracer) {}
  get size() {
    return this.h.length;
  }
  peek() {
    return this.h[0];
  }
  push(x: number) {
    const h = this.h;
    h.push(x);
    let i = h.length - 1;
    this.t.op();
    while (i > 0) {
      const p = (i - 1) >> 1;
      this.t.op();
      if (h[p] <= h[i]) break;
      [h[p], h[i]] = [h[i], h[p]];
      i = p;
    }
  }
  pop() {
    const h = this.h;
    const top = h[0];
    const last = h.pop()!;
    this.t.op();
    if (h.length) {
      h[0] = last;
      let i = 0;
      for (;;) {
        const l = 2 * i + 1,
          r = l + 1;
        let m = i;
        this.t.op();
        if (l < h.length && h[l] < h[m]) m = l;
        if (r < h.length && h[r] < h[m]) m = r;
        if (m === i) break;
        [h[m], h[i]] = [h[i], h[m]];
        i = m;
      }
    }
    return top;
  }
}

export const rand = (lo: number, hi: number) => lo + Math.floor(Math.random() * (hi - lo + 1));
export const randArr = (n: number, lo: number, hi: number) => Array.from({ length: n }, () => rand(lo, hi));
export const range = (n: number) => Array.from({ length: n }, (_, i) => i);
