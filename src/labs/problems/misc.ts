import type { CellTone, Input, Problem } from "../types";
import { countedSort, CountedHeap, rand, randArr } from "../tracer";
import type { Tracer } from "../tracer";

const bin = (x: number) => (x >>> 0).toString(2).padStart(8, "0").slice(-8);

export const singleNumber: Problem = {
  slug: "single-number",
  title: "Single Number",
  emoji: "🦄",
  topic: "bit-manipulation",
  level: "Easy",
  statement: "Every number appears twice except one. Find the lonely one.",
  fields: [{ key: "nums", label: "nums", kind: "nums" }],
  defaults: { nums: "4, 1, 2, 1, 2, 7, 4" },
  gen: (n) => {
    const half = Math.max(1, Math.floor(n / 2));
    const base = Array.from({ length: half }, (_, i) => i + 1);
    const nums = [...base, ...base, 10 * n];
    for (let i = nums.length - 1; i > 0; i--) {
      const j = rand(0, i);
      [nums[i], nums[j]] = [nums[j], nums[i]];
    }
    return { nums };
  },
  sizes: [8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192],
  takeaway:
    "A HashMap count works in O(n) time but O(n) space. Sorting puts pairs side by side (O(n log n)). XOR is the magic trick: a ^ a = 0 and a ^ 0 = a, so all pairs cancel and the single number survives — O(n) time, O(1) space.",
  approaches: [
    {
      id: "map",
      name: "Count with a HashMap",
      badge: "Better",
      time: "O(n)",
      space: "O(n)",
      idea: "Count every value, return the one with count 1.",
      java: `int singleNumber(int[] nums) {
    Map<Integer, Integer> cnt = new HashMap<>();
    for (int x : nums) cnt.merge(x, 1, Integer::sum);   //@count
    for (var e : cnt.entrySet())                        //@scan
        if (e.getValue() == 1) return e.getKey();       //@found
    return -1;
}`,
      cpp: `int singleNumber(vector<int>& nums) {
    unordered_map<int, int> cnt;
    for (int x : nums) cnt[x]++;                        //@count
    for (auto& [k, v] : cnt)                            //@scan
        if (v == 1) return k;                           //@found
    return -1;
}`,
      run: ({ nums: a }, t) => {
        const cnt = new Map<number, number>();
        for (let i = 0; i < a.length; i++) {
          t.op();
          cnt.set(a[i], (cnt.get(a[i]) ?? 0) + 1);
          t.snap(() => ({
            step: "count",
            msg: `count[${a[i]}] = ${cnt.get(a[i])}`,
            arrays: [{ values: a, tones: { [i]: "active" }, pointers: { i } }],
            maps: [{ title: "count", entries: [...cnt].map(([k, v]) => [String(k), String(v)]), highlight: [String(a[i])] }],
          }));
        }
        for (const [k, v] of cnt) {
          t.op();
          if (v === 1) {
            t.snap(() => ({
              step: "found",
              msg: `${k} appears once → that's our unicorn 🦄 (but we used a whole map of memory).`,
              mood: "happy",
              arrays: [{ values: a, tones: Object.fromEntries(a.map((x: number, i: number) => [i, x === k ? "found" : "dim"])) }],
              maps: [{ title: "count", entries: [...cnt].map(([kk, vv]) => [String(kk), String(vv)]), highlight: [String(k)] }],
            }));
            return String(k);
          }
        }
        return "-1";
      },
    },
    {
      id: "sort",
      name: "Sort, then check pairs",
      badge: "Better",
      time: "O(n log n)",
      space: "O(1)",
      idea: "After sorting, pairs sit next to each other. Jump 2 at a time.",
      java: `int singleNumber(int[] a) {
    Arrays.sort(a);                                     //@sort
    for (int i = 0; i + 1 < a.length; i += 2)           //@loop
        if (a[i] != a[i + 1]) return a[i];              //@found
    return a[a.length - 1];
}`,
      cpp: `int singleNumber(vector<int>& a) {
    sort(a.begin(), a.end());                           //@sort
    for (int i = 0; i + 1 < (int)a.size(); i += 2)      //@loop
        if (a[i] != a[i + 1]) return a[i];              //@found
    return a.back();
}`,
      run: ({ nums }, t) => {
        const a = countedSort<number>(nums, (x, y) => x - y, t);
        t.snap(() => ({ step: "sort", msg: `Sorted with ${t.ops} comparisons. Pairs are now neighbours.`, arrays: [{ values: a }] }));
        for (let i = 0; i + 1 < a.length; i += 2) {
          t.op();
          const ok = a[i] === a[i + 1];
          t.snap(() => ({
            step: ok ? "loop" : "found",
            msg: ok ? `${a[i]} & ${a[i + 1]} are a pair ✔` : `${a[i]} ≠ ${a[i + 1]} → ${a[i]} is alone!`,
            mood: ok ? "think" : "wow",
            arrays: [{ values: a, tones: ok ? { [i]: "done", [i + 1]: "done" } : { [i]: "found" }, pointers: { i } }],
          }));
          if (!ok) return String(a[i]);
        }
        return String(a[a.length - 1]);
      },
    },
    {
      id: "xor",
      name: "XOR everything",
      badge: "Optimal",
      time: "O(n)",
      space: "O(1)",
      idea: "x ^ x = 0, so pairs cancel; what's left is the single number.",
      java: `int singleNumber(int[] nums) {
    int result = 0;
    for (int x : nums)        //@loop
        result ^= x;          //@xor
    return result;            //@result
}`,
      cpp: `int singleNumber(vector<int>& nums) {
    int result = 0;
    for (int x : nums)        //@loop
        result ^= x;          //@xor
    return result;            //@result
}`,
      run: ({ nums: a }, t) => {
        let r = 0;
        for (let i = 0; i < a.length; i++) {
          t.op();
          const before = r;
          r ^= a[i];
          const after = r;
          t.snap(() => ({
            step: "xor",
            msg: `${bin(before)} ^ ${bin(a[i])} = ${bin(after)}  (${after})`,
            mood: "think",
            arrays: [{ values: a, tones: { [i]: "active" }, pointers: { i } }],
            vars: { result: after, binary: bin(after) },
          }));
        }
        t.snap(() => ({ step: "result", msg: `All pairs cancelled → ${r} ✨ with zero extra memory.`, mood: "cool", vars: { result: r, binary: bin(r) } }));
        return String(r);
      },
    },
  ],
};

export const kthLargest: Problem = {
  slug: "kth-largest",
  title: "Kth Largest Element",
  emoji: "🏆",
  topic: "heap",
  level: "Medium",
  statement: "Return the kth largest element of the array.",
  fields: [
    { key: "nums", label: "nums", kind: "nums" },
    { key: "k", label: "k", kind: "num" },
  ],
  defaults: { nums: "3, 2, 1, 5, 6, 4, 9, 7", k: "3" },
  validate: (i) => (i.k < 1 || i.k > i.nums.length ? "k must be between 1 and n" : null),
  gen: (n) => ({ nums: randArr(n, 1, n * 4), k: Math.min(8, n) }),
  sizes: [16, 64, 256, 1024, 4096, 16384, 65536],
  takeaway:
    "Sorting everything is O(n log n) but you only need ONE element. A min-heap of size k keeps the k biggest seen so far — O(n log k), great when k is small or data streams in. Quickselect partitions like quicksort but recurses on one side only → O(n) on average.",
  approaches: [
    {
      id: "sort",
      name: "Sort the whole array",
      badge: "Brute Force",
      time: "O(n log n)",
      space: "O(1)",
      idea: "Sort ascending, answer is at index n − k.",
      java: `int findKthLargest(int[] a, int k) {
    Arrays.sort(a);                 //@sort
    return a[a.length - k];         //@result
}`,
      cpp: `int findKthLargest(vector<int>& a, int k) {
    sort(a.begin(), a.end());       //@sort
    return a[a.size() - k];         //@result
}`,
      run: ({ nums, k }, t) => {
        const a = countedSort<number>(nums, (x, y) => x - y, t);
        t.snap(() => ({
          step: "result",
          msg: `Sorted everything (${t.ops} comparisons) just to read index n − k = ${a.length - k} → ${a[a.length - k]}`,
          mood: "think",
          arrays: [{ values: a, tones: { [a.length - k]: "found" }, pointers: { "n-k": a.length - k } }],
        }));
        return String(a[a.length - k]);
      },
    },
    {
      id: "heap",
      name: "Min-heap of size k",
      badge: "Optimal",
      time: "O(n log k)",
      space: "O(k)",
      idea: "Push each number; if the heap grows past k, pop the smallest. Top = answer.",
      java: `int findKthLargest(int[] a, int k) {
    PriorityQueue<Integer> heap = new PriorityQueue<>();
    for (int x : a) {                       //@loop
        heap.offer(x);                      //@push
        if (heap.size() > k) heap.poll();   //@pop
    }
    return heap.peek();                     //@result
}`,
      cpp: `int findKthLargest(vector<int>& a, int k) {
    priority_queue<int, vector<int>, greater<int>> heap;
    for (int x : a) {                       //@loop
        heap.push(x);                       //@push
        if ((int)heap.size() > k) heap.pop(); //@pop
    }
    return heap.top();                      //@result
}`,
      run: ({ nums: a, k }, t) => {
        const h = new CountedHeap(t);
        for (let i = 0; i < a.length; i++) {
          h.push(a[i]);
          const snapH = [...h.h];
          t.snap(() => ({
            step: "push",
            msg: `Push ${a[i]}. Heap size ${snapH.length}${snapH.length > k ? ` > k = ${k}…` : ""}`,
            mood: "think",
            arrays: [{ values: a, tones: { [i]: "active" }, pointers: { i } }],
            tree: { title: "min-heap (smallest on top)", values: snapH, tones: { [snapH.indexOf(a[i])]: "active" } },
          }));
          if (h.size > k) {
            const out = h.pop();
            const snap2 = [...h.h];
            t.snap(() => ({
              step: "pop",
              msg: `Too many → kick out the smallest (${out}). It can't be in the top ${k}.`,
              mood: "happy",
              arrays: [{ values: a, tones: { [i]: "active" }, pointers: { i } }],
              tree: { title: "min-heap (smallest on top)", values: snap2, tones: { 0: "pivot" } },
            }));
          }
        }
        const top = h.peek();
        t.snap(() => ({
          step: "result",
          msg: `Heap holds the ${k} biggest numbers; its top ${top} is the ${k}th largest 🏆`,
          mood: "cool",
          tree: { title: "min-heap (smallest on top)", values: [...h.h], tones: { 0: "found" } },
        }));
        return String(top);
      },
    },
    {
      id: "quickselect",
      name: "Quickselect",
      badge: "Optimal",
      time: "O(n) avg, O(n²) worst",
      space: "O(1)",
      idea: "Partition around a pivot; only recurse into the side that contains index n − k.",
      java: `int findKthLargest(int[] a, int k) {
    int target = a.length - k, lo = 0, hi = a.length - 1;
    while (true) {
        int p = partition(a, lo, hi);       //@partition
        if (p == target) return a[p];       //@found
        else if (p < target) lo = p + 1;    //@right
        else hi = p - 1;                    //@left
    }
}
int partition(int[] a, int lo, int hi) {    // Lomuto, pivot = a[hi]
    int pivot = a[hi], i = lo;
    for (int j = lo; j < hi; j++)
        if (a[j] < pivot) swap(a, i++, j);
    swap(a, i, hi);
    return i;
}`,
      cpp: `int partition(vector<int>& a, int lo, int hi) {  // Lomuto, pivot = a[hi]
    int pivot = a[hi], i = lo;
    for (int j = lo; j < hi; j++)
        if (a[j] < pivot) swap(a[i++], a[j]);
    swap(a[i], a[hi]);
    return i;
}
int findKthLargest(vector<int>& a, int k) {
    int target = a.size() - k, lo = 0, hi = a.size() - 1;
    while (true) {
        int p = partition(a, lo, hi);       //@partition
        if (p == target) return a[p];       //@found
        else if (p < target) lo = p + 1;    //@right
        else hi = p - 1;                    //@left
    }
}`,
      run: ({ nums, k }, t) => {
        const a = [...nums];
        const target = a.length - k;
        let lo = 0,
          hi = a.length - 1;
        for (;;) {
          // random pivot avoids the O(n²) worst case on sorted input
          const r = rand(lo, hi);
          [a[r], a[hi]] = [a[hi], a[r]];
          const pivot = a[hi];
          let i = lo;
          for (let j = lo; j < hi; j++) {
            t.op();
            if (a[j] < pivot) {
              [a[i], a[j]] = [a[j], a[i]];
              i++;
            }
          }
          [a[i], a[hi]] = [a[hi], a[i]];
          const p = i,
            l = lo,
            h = hi,
            snapA = [...a];
          const tones: Record<number, CellTone> = {};
          for (let x = 0; x < snapA.length; x++) if (x < l || x > h) tones[x] = "dim";
          tones[p] = p === target ? "found" : "pivot";
          t.snap(() => ({
            step: p === target ? "found" : p < target ? "right" : "left",
            msg:
              p === target
                ? `Pivot ${pivot} landed exactly at index ${target} → it's the answer!`
                : `Pivot ${pivot} landed at ${p}. Smaller left, bigger right. Target index ${target} is on the ${p < target ? "right" : "left"} → ignore the other side.`,
            mood: p === target ? "wow" : "think",
            arrays: [{ values: snapA, tones, pointers: { lo: l, hi: h, p } }],
          }));
          if (p === target) return String(a[p]);
          if (p < target) lo = p + 1;
          else hi = p - 1;
        }
      },
    },
  ],
};

/* ---------- Sorting race ---------- */

type SortRun = (a: number[], t: Tracer) => void;

const snapBars = (t: Tracer, a: number[], step: string, msg: string, tones: Record<number, CellTone> = {}) =>
  t.snap(() => ({ step, msg, bars: { values: [...a], tones } }));

const sortedTail = (n: number, from: number): Record<number, CellTone> =>
  Object.fromEntries(Array.from({ length: n - from }, (_, k) => [from + k, "sorted" as CellTone]));

const bubble: SortRun = (a, t) => {
  const n = a.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - 1 - i; j++) {
      t.op();
      const sw = a[j] > a[j + 1];
      if (sw) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swapped = true;
      }
      snapBars(t, a, "compare", sw ? `${a[j + 1]} > ${a[j]} → swap!` : `${a[j]} ≤ ${a[j + 1]} OK`, {
        ...sortedTail(n, n - i),
        [j]: sw ? "warn" : "compare",
        [j + 1]: sw ? "warn" : "compare",
      });
    }
    if (!swapped) break;
  }
  snapBars(t, a, "done", "Sorted! Largest values bubbled to the end one by one.", sortedTail(n, 0));
};

const selection: SortRun = (a, t) => {
  const n = a.length;
  for (let i = 0; i < n - 1; i++) {
    let m = i;
    for (let j = i + 1; j < n; j++) {
      t.op();
      if (a[j] < a[m]) m = j;
      const mm = m;
      snapBars(t, a, "compare", `Looking for the minimum… current min ${a[mm]}`, {
        ...Object.fromEntries(Array.from({ length: i }, (_, k) => [k, "sorted" as CellTone])),
        [j]: "compare",
        [mm]: "pivot",
      });
    }
    [a[i], a[m]] = [a[m], a[i]];
    snapBars(t, a, "swap", `Put ${a[i]} at position ${i}.`, Object.fromEntries(Array.from({ length: i + 1 }, (_, k) => [k, "sorted" as CellTone])));
  }
  snapBars(t, a, "done", "Sorted! Always n²/2 comparisons, even on sorted input.", sortedTail(n, 0));
};

const insertion: SortRun = (a, t) => {
  const n = a.length;
  for (let i = 1; i < n; i++) {
    const key = a[i];
    let j = i - 1;
    while (j >= 0) {
      t.op();
      if (a[j] <= key) break;
      a[j + 1] = a[j];
      j--;
      const jj = j;
      snapBars(t, a, "shift", `Shift bigger values right to make room for ${key}`, { [jj + 1]: "active" });
    }
    a[j + 1] = key;
    snapBars(t, a, "insert", `Insert ${key} into the sorted left part.`, {
      ...Object.fromEntries(Array.from({ length: i + 1 }, (_, k) => [k, "done" as CellTone])),
      [j + 1]: "found",
    });
  }
  snapBars(t, a, "done", "Sorted! Insertion sort is very fast on nearly-sorted data.", sortedTail(n, 0));
};

const merge: SortRun = (a, t) => {
  const tmp = new Array(a.length);
  const rec = (l: number, r: number) => {
    if (l >= r) return;
    const m = (l + r) >> 1;
    rec(l, m);
    rec(m + 1, r);
    let i = l,
      j = m + 1,
      k = l;
    while (i <= m && j <= r) {
      t.op();
      tmp[k++] = a[i] <= a[j] ? a[i++] : a[j++];
    }
    while (i <= m) tmp[k++] = a[i++];
    while (j <= r) tmp[k++] = a[j++];
    for (let x = l; x <= r; x++) a[x] = tmp[x];
    snapBars(t, a, "merge", `Merged [${l}..${m}] and [${m + 1}..${r}]`, Object.fromEntries(Array.from({ length: r - l + 1 }, (_, x) => [l + x, "active" as CellTone])));
  };
  rec(0, a.length - 1);
  snapBars(t, a, "done", "Sorted! Merge sort is always n log n.", sortedTail(a.length, 0));
};

const quick: SortRun = (a, t) => {
  const rec = (lo: number, hi: number) => {
    if (lo >= hi) return;
    const r = lo + ((hi - lo) >> 1);
    [a[r], a[hi]] = [a[hi], a[r]];
    const pivot = a[hi];
    let i = lo;
    for (let j = lo; j < hi; j++) {
      t.op();
      if (a[j] < pivot) {
        [a[i], a[j]] = [a[j], a[i]];
        i++;
      }
    }
    [a[i], a[hi]] = [a[hi], a[i]];
    snapBars(t, a, "partition", `Pivot ${pivot} is now in its final place.`, {
      ...Object.fromEntries(Array.from({ length: hi - lo + 1 }, (_, x) => [lo + x, "compare" as CellTone])),
      [i]: "pivot",
    });
    rec(lo, i - 1);
    rec(i + 1, hi);
  };
  rec(0, a.length - 1);
  snapBars(t, a, "done", "Sorted! Quick sort: n log n on average, in place.", sortedTail(a.length, 0));
};

const sortApproach = (
  id: string,
  name: string,
  badge: "Brute Force" | "Better" | "Optimal" | "Classic",
  time: string,
  space: string,
  idea: string,
  fn: SortRun,
  java: string,
  cpp: string,
  maxN?: number,
) => ({
  id,
  name,
  badge,
  time,
  space,
  idea,
  maxN,
  java,
  cpp,
  run: ({ nums }: Input, t: Tracer) => {
    const a = [...nums];
    snapBars(t, a, "start", "Here's the unsorted array.");
    fn(a, t);
    return `[${a.join(", ")}]`;
  },
});

export const sortingRace: Problem = {
  slug: "sorting-race",
  title: "Sorting Race",
  emoji: "🏁",
  topic: "sorting",
  level: "Medium",
  statement: "Sort the array in ascending order. Same input, five algorithms — who wins?",
  fields: [{ key: "nums", label: "nums", kind: "nums" }],
  defaults: { nums: "38, 27, 43, 3, 9, 82, 10, 55, 19, 64, 1, 30" },
  validate: (i) => (i.nums.length > 40 ? "Keep it ≤ 40 numbers for the animation" : null),
  gen: (n) => ({ nums: randArr(n, 1, 1000) }),
  sizes: [8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192],
  takeaway:
    "Bubble, selection and insertion sort are O(n²): fine for 20 items, painful for 10,000. Merge and quick sort split the work (divide & conquer) → O(n log n). In interviews call Arrays.sort / std::sort, but know WHY it's n log n.",
  approaches: [
    sortApproach("bubble", "Bubble sort", "Brute Force", "O(n²)", "O(1)", "Swap neighbours that are out of order; big values bubble to the end.", bubble,
      `void bubbleSort(int[] a) {
    for (int i = 0; i < a.length - 1; i++)
        for (int j = 0; j < a.length - 1 - i; j++)
            if (a[j] > a[j + 1]) {                 //@compare
                int t = a[j]; a[j] = a[j + 1]; a[j + 1] = t;
            }
}`,
      `void bubbleSort(vector<int>& a) {
    for (int i = 0; i + 1 < (int)a.size(); i++)
        for (int j = 0; j + 1 < (int)a.size() - i; j++)
            if (a[j] > a[j + 1])                   //@compare
                swap(a[j], a[j + 1]);
}`, 4096),
    sortApproach("selection", "Selection sort", "Brute Force", "O(n²)", "O(1)", "Find the minimum of the unsorted part and put it in front.", selection,
      `void selectionSort(int[] a) {
    for (int i = 0; i < a.length - 1; i++) {
        int m = i;
        for (int j = i + 1; j < a.length; j++)
            if (a[j] < a[m]) m = j;                //@compare
        int t = a[i]; a[i] = a[m]; a[m] = t;       //@swap
    }
}`,
      `void selectionSort(vector<int>& a) {
    for (int i = 0; i + 1 < (int)a.size(); i++) {
        int m = i;
        for (int j = i + 1; j < (int)a.size(); j++)
            if (a[j] < a[m]) m = j;                //@compare
        swap(a[i], a[m]);                          //@swap
    }
}`, 4096),
    sortApproach("insertion", "Insertion sort", "Better", "O(n²)", "O(1)", "Grow a sorted prefix; insert each new card into place.", insertion,
      `void insertionSort(int[] a) {
    for (int i = 1; i < a.length; i++) {
        int key = a[i], j = i - 1;
        while (j >= 0 && a[j] > key) {
            a[j + 1] = a[j]; j--;                  //@shift
        }
        a[j + 1] = key;                            //@insert
    }
}`,
      `void insertionSort(vector<int>& a) {
    for (int i = 1; i < (int)a.size(); i++) {
        int key = a[i], j = i - 1;
        while (j >= 0 && a[j] > key) {
            a[j + 1] = a[j]; j--;                  //@shift
        }
        a[j + 1] = key;                            //@insert
    }
}`, 4096),
    sortApproach("merge", "Merge sort", "Optimal", "O(n log n)", "O(n)", "Split in halves, sort each, merge the two sorted halves.", merge,
      `void mergeSort(int[] a, int l, int r) {
    if (l >= r) return;
    int m = (l + r) / 2;
    mergeSort(a, l, m);
    mergeSort(a, m + 1, r);
    merge(a, l, m, r);                             //@merge
}`,
      `void mergeSort(vector<int>& a, int l, int r) {
    if (l >= r) return;
    int m = (l + r) / 2;
    mergeSort(a, l, m);
    mergeSort(a, m + 1, r);
    inplace_merge(a.begin() + l, a.begin() + m + 1, a.begin() + r + 1); //@merge
}`),
    sortApproach("quick", "Quick sort", "Optimal", "O(n log n) avg", "O(log n)", "Pick a pivot, put smaller left and bigger right, recurse on both sides.", quick,
      `void quickSort(int[] a, int lo, int hi) {
    if (lo >= hi) return;
    int p = partition(a, lo, hi);                  //@partition
    quickSort(a, lo, p - 1);
    quickSort(a, p + 1, hi);
}`,
      `void quickSort(vector<int>& a, int lo, int hi) {
    if (lo >= hi) return;
    int p = partition(a, lo, hi);                  //@partition
    quickSort(a, lo, p - 1);
    quickSort(a, p + 1, hi);
}`),
  ],
};
