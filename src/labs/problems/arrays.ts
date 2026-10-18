import type { CellTone, Problem } from "../types";
import { countedSort, rand, randArr } from "../tracer";

const mapEntries = (m: Map<number | string, number>) =>
  [...m.entries()].map(([k, v]) => [String(k), String(v)] as [string, string]);

export const twoSum: Problem = {
  slug: "two-sum",
  title: "Two Sum",
  emoji: "🎯",
  topic: "hashing",
  level: "Easy",
  statement:
    "Given an array nums and a target, return the indices of the two numbers that add up to target. Each input has exactly one answer.",
  fields: [
    { key: "nums", label: "nums", kind: "nums" },
    { key: "target", label: "target", kind: "num" },
  ],
  defaults: { nums: "3, 9, 14, 2, 7, 11, 5", target: "25" },
  validate: (i) => (i.nums.length < 2 ? "Need at least 2 numbers" : null),
  gen: (n) => {
    const nums = randArr(n, 1, n * 10);
    // plant the answer near the end so every approach does real work
    const a = n - 2,
      b = n - 1;
    nums[a] = 10 * n + 1;
    nums[b] = 10 * n + 2;
    return { nums, target: 20 * n + 3 };
  },
  sizes: [8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096],
  takeaway:
    "Brute force checks every pair (O(n²)). HashMap remembers what you've seen so the complement lookup is O(1) → O(n) time but O(n) space. Sorting + two pointers is O(n log n) and needs O(1) extra space if you don't need original indices — perfect when the array is ALREADY sorted (Two Sum II).",
  approaches: [
    {
      id: "brute",
      name: "Check every pair",
      badge: "Brute Force",
      time: "O(n²)",
      space: "O(1)",
      idea: "Try all pairs (i, j) with two nested loops.",
      maxN: 4096,
      java: `int[] twoSum(int[] a, int target) {
    for (int i = 0; i < a.length; i++) {          //@outer
        for (int j = i + 1; j < a.length; j++) {  //@inner
            if (a[i] + a[j] == target)             //@check
                return new int[]{i, j};            //@found
        }
    }
    return new int[]{-1, -1};                      //@none
}`,
      cpp: `vector<int> twoSum(vector<int>& a, int target) {
    for (int i = 0; i < (int)a.size(); i++) {          //@outer
        for (int j = i + 1; j < (int)a.size(); j++) {  //@inner
            if (a[i] + a[j] == target)                  //@check
                return {i, j};                          //@found
        }
    }
    return {-1, -1};                                    //@none
}`,
      run: ({ nums: a, target }, t) => {
        for (let i = 0; i < a.length; i++) {
          t.snap(() => ({
            step: "outer",
            msg: `Fix i = ${i} (value ${a[i]}). Now try every j after it.`,
            mood: "think",
            arrays: [{ values: a, tones: { [i]: "active" }, pointers: { i } }],
          }));
          for (let j = i + 1; j < a.length; j++) {
            t.op();
            const s = a[i] + a[j];
            t.snap(() => ({
              step: "check",
              msg:
                s === target
                  ? `${a[i]} + ${a[j]} = ${s} 🎉 That's the target!`
                  : `${a[i]} + ${a[j]} = ${s} ≠ ${target}. Next j…`,
              mood: s === target ? "wow" : "think",
              arrays: [{ values: a, tones: { [i]: "active", [j]: s === target ? "found" : "compare" }, pointers: { i, j } }],
              vars: { i, j, "a[i]+a[j]": s, target },
            }));
            if (s === target) {
              t.snap(() => ({
                step: "found",
                msg: `Found it after ${t.ops} comparisons. For n = ${a.length} the worst case is n(n-1)/2 = ${(a.length * (a.length - 1)) / 2}.`,
                mood: "happy",
                arrays: [{ values: a, tones: { [i]: "found", [j]: "found" }, pointers: { i, j } }],
              }));
              return `[${i}, ${j}]`;
            }
          }
        }
        t.snap(() => ({ step: "none", msg: "No pair found.", mood: "sad", arrays: [{ values: a }] }));
        return "[-1, -1]";
      },
    },
    {
      id: "hashmap",
      name: "HashMap of seen values",
      badge: "Optimal",
      time: "O(n)",
      space: "O(n)",
      idea: "For each x, ask the map: have I already seen target − x?",
      java: `int[] twoSum(int[] a, int target) {
    Map<Integer, Integer> seen = new HashMap<>();
    for (int i = 0; i < a.length; i++) {          //@loop
        int need = target - a[i];                 //@need
        if (seen.containsKey(need))               //@lookup
            return new int[]{seen.get(need), i};  //@found
        seen.put(a[i], i);                        //@put
    }
    return new int[]{-1, -1};
}`,
      cpp: `vector<int> twoSum(vector<int>& a, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < (int)a.size(); i++) {     //@loop
        int need = target - a[i];                 //@need
        if (seen.count(need))                     //@lookup
            return {seen[need], i};               //@found
        seen[a[i]] = i;                           //@put
    }
    return {-1, -1};
}`,
      run: ({ nums: a, target }, t) => {
        const seen = new Map<number, number>();
        for (let i = 0; i < a.length; i++) {
          const need = target - a[i];
          t.op();
          const hit = seen.has(need);
          t.snap(() => ({
            step: "lookup",
            msg: hit
              ? `I need ${need}… and it's in the map at index ${seen.get(need)}! 🎉`
              : `a[${i}] = ${a[i]} → I need ${need}. Not in the map yet.`,
            mood: hit ? "wow" : "think",
            arrays: [
              {
                values: a,
                tones: { [i]: hit ? "found" : "active", ...(hit ? { [seen.get(need)!]: "found" as CellTone } : {}) },
                pointers: { i },
              },
            ],
            maps: [{ title: "seen (value → index)", entries: mapEntries(seen), highlight: hit ? [String(need)] : [], miss: hit ? undefined : String(need) }],
            vars: { i, "a[i]": a[i], need },
          }));
          if (hit) {
            t.snap(() => ({
              step: "found",
              msg: `Done in a single pass: ${t.ops} map operations instead of up to ${(a.length * (a.length - 1)) / 2} pair checks.`,
              mood: "cool",
              arrays: [{ values: a, tones: { [i]: "found", [seen.get(need)!]: "found" } }],
              maps: [{ title: "seen (value → index)", entries: mapEntries(seen), highlight: [String(need)] }],
            }));
            return `[${seen.get(need)}, ${i}]`;
          }
          seen.set(a[i], i);
          t.op();
          t.snap(() => ({
            step: "put",
            msg: `Remember ${a[i]} → index ${i} for later.`,
            arrays: [{ values: a, tones: { [i]: "done" }, pointers: { i } }],
            maps: [{ title: "seen (value → index)", entries: mapEntries(seen), highlight: [String(a[i])] }],
          }));
        }
        return "[-1, -1]";
      },
    },
    {
      id: "two-pointer",
      name: "Sort + two pointers",
      badge: "Better",
      time: "O(n log n)",
      space: "O(n)",
      idea: "Sort (value, index) pairs, then squeeze l and r toward each other.",
      java: `int[] twoSum(int[] a, int target) {
    int n = a.length;
    int[][] p = new int[n][2];               // {value, original index}
    for (int i = 0; i < n; i++) p[i] = new int[]{a[i], i};
    Arrays.sort(p, (x, y) -> x[0] - y[0]);   //@sort
    int l = 0, r = n - 1;
    while (l < r) {                          //@loop
        int sum = p[l][0] + p[r][0];         //@check
        if (sum == target) return new int[]{p[l][1], p[r][1]}; //@found
        else if (sum < target) l++;          //@left
        else r--;                            //@right
    }
    return new int[]{-1, -1};
}`,
      cpp: `vector<int> twoSum(vector<int>& a, int target) {
    int n = a.size();
    vector<pair<int,int>> p;                 // {value, original index}
    for (int i = 0; i < n; i++) p.push_back({a[i], i});
    sort(p.begin(), p.end());                //@sort
    int l = 0, r = n - 1;
    while (l < r) {                          //@loop
        int sum = p[l].first + p[r].first;   //@check
        if (sum == target) return {p[l].second, p[r].second}; //@found
        else if (sum < target) l++;          //@left
        else r--;                            //@right
    }
    return {-1, -1};
}`,
      run: ({ nums: a, target }, t) => {
        const p = countedSort<[number, number]>(
          a.map((v: number, i: number) => [v, i] as [number, number]),
          (x, y) => x[0] - y[0],
          t,
        );
        const vals = p.map((x) => x[0]);
        const sub = p.map((x) => `#${x[1]}`);
        t.snap(() => ({
          step: "sort",
          msg: `Sorted first (${t.ops} comparisons). Small numbers on the left, big on the right. Grey tags = original index.`,
          mood: "happy",
          arrays: [
            { label: "original", values: a, tones: {} },
            { label: "sorted", values: vals, sub },
          ],
        }));
        let l = 0,
          r = p.length - 1;
        while (l < r) {
          t.op();
          const s = vals[l] + vals[r];
          const tones: Record<number, CellTone> = { [l]: "active", [r]: "compare" };
          for (let k = 0; k < l; k++) tones[k] = "dim";
          for (let k = r + 1; k < vals.length; k++) tones[k] = "dim";
          if (s === target) {
            t.snap(() => ({
              step: "found",
              msg: `${vals[l]} + ${vals[r]} = ${s} 🎉 Original indices are ${p[l][1]} and ${p[r][1]}.`,
              mood: "wow",
              arrays: [{ label: "sorted", values: vals, sub, tones: { ...tones, [l]: "found", [r]: "found" }, pointers: { l, r } }],
              vars: { l, r, sum: s, target },
            }));
            return `[${Math.min(p[l][1], p[r][1])}, ${Math.max(p[l][1], p[r][1])}]`;
          }
          const small = s < target;
          t.snap(() => ({
            step: small ? "left" : "right",
            msg: small
              ? `${vals[l]} + ${vals[r]} = ${s} < ${target}. Too small → move l right for a bigger number.`
              : `${vals[l]} + ${vals[r]} = ${s} > ${target}. Too big → move r left for a smaller number.`,
            mood: "think",
            arrays: [{ label: "sorted", values: vals, sub, tones, pointers: { l, r } }],
            vars: { l, r, sum: s, target },
          }));
          if (small) l++;
          else r--;
        }
        return "[-1, -1]";
      },
    },
  ],
};

export const maxSumK: Problem = {
  slug: "max-sum-k",
  title: "Max Sum Subarray of Size K",
  emoji: "🪟",
  topic: "sliding-window",
  level: "Easy",
  statement: "Find the maximum sum of any contiguous subarray of exactly k elements.",
  fields: [
    { key: "nums", label: "nums", kind: "nums" },
    { key: "k", label: "k", kind: "num" },
  ],
  defaults: { nums: "2, 1, 5, 1, 3, 2, 9, 4, 1", k: "3" },
  validate: (i) => (i.k < 1 || i.k > i.nums.length ? "k must be between 1 and the array length" : null),
  gen: (n) => ({ nums: randArr(n, -50, 50), k: Math.max(1, Math.floor(n / 2)) }),
  sizes: [8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096],
  takeaway:
    "Re-adding k numbers for every window wastes work: neighbouring windows share k−1 elements. The sliding window adds the new element and subtracts the one that left → O(n). (The race uses k = n/2, which makes the brute force quadratic.)",
  approaches: [
    {
      id: "brute",
      name: "Re-sum every window",
      badge: "Brute Force",
      time: "O(n·k)",
      space: "O(1)",
      idea: "For each start index, add up the next k numbers.",
      java: `int maxSum(int[] a, int k) {
    int best = Integer.MIN_VALUE;
    for (int i = 0; i + k <= a.length; i++) {   //@outer
        int sum = 0;
        for (int j = i; j < i + k; j++)         //@inner
            sum += a[j];                        //@add
        best = Math.max(best, sum);             //@best
    }
    return best;
}`,
      cpp: `int maxSum(vector<int>& a, int k) {
    int best = INT_MIN;
    for (int i = 0; i + k <= (int)a.size(); i++) {  //@outer
        int sum = 0;
        for (int j = i; j < i + k; j++)             //@inner
            sum += a[j];                            //@add
        best = max(best, sum);                      //@best
    }
    return best;
}`,
      run: ({ nums: a, k }, t) => {
        let best = -Infinity;
        for (let i = 0; i + k <= a.length; i++) {
          let sum = 0;
          for (let j = i; j < i + k; j++) {
            t.op();
            sum += a[j];
            const s = sum;
            t.snap(() => ({
              step: "add",
              msg: `Window starting at ${i}: add a[${j}] = ${a[j]} → sum ${s}`,
              mood: "think",
              arrays: [{ values: a, window: [i, i + k - 1], tones: { [j]: "active" }, pointers: { j } }],
              vars: { i, j, sum: s, best: best === -Infinity ? "−∞" : best },
            }));
          }
          const improved = sum > best;
          best = Math.max(best, sum);
          t.snap(() => ({
            step: "best",
            msg: improved ? `Window sum ${sum} is the new best! ⭐` : `Window sum ${sum}, best stays ${best}.`,
            mood: improved ? "happy" : "think",
            arrays: [{ values: a, window: [i, i + k - 1] }],
            vars: { i, sum, best },
          }));
        }
        return String(best);
      },
    },
    {
      id: "window",
      name: "Sliding window",
      badge: "Optimal",
      time: "O(n)",
      space: "O(1)",
      idea: "Slide by one: add the entering element, subtract the leaving one.",
      java: `int maxSum(int[] a, int k) {
    int sum = 0;
    for (int i = 0; i < k; i++) sum += a[i];   //@first
    int best = sum;
    for (int i = k; i < a.length; i++) {       //@loop
        sum += a[i] - a[i - k];                //@slide
        best = Math.max(best, sum);            //@best
    }
    return best;
}`,
      cpp: `int maxSum(vector<int>& a, int k) {
    int sum = 0;
    for (int i = 0; i < k; i++) sum += a[i];   //@first
    int best = sum;
    for (int i = k; i < (int)a.size(); i++) {  //@loop
        sum += a[i] - a[i - k];                //@slide
        best = max(best, sum);                 //@best
    }
    return best;
}`,
      run: ({ nums: a, k }, t) => {
        let sum = 0;
        for (let i = 0; i < k; i++) {
          t.op();
          sum += a[i];
        }
        let best = sum;
        t.snap(() => ({
          step: "first",
          msg: `First window [0..${k - 1}] sums to ${sum}. Now we just slide!`,
          mood: "happy",
          arrays: [{ values: a, window: [0, k - 1] }],
          vars: { sum, best },
        }));
        for (let i = k; i < a.length; i++) {
          t.op();
          sum += a[i] - a[i - k];
          const improved = sum > best;
          best = Math.max(best, sum);
          const s = sum;
          t.snap(() => ({
            step: "slide",
            msg: `+${a[i]} enters, −${a[i - k]} leaves → sum ${s}${improved ? " ⭐ new best!" : ""}`,
            mood: improved ? "wow" : "happy",
            arrays: [{ values: a, window: [i - k + 1, i], tones: { [i]: "found", [i - k]: "warn" } }],
            vars: { sum: s, best },
          }));
        }
        return String(best);
      },
    },
  ],
};

export const longestUnique: Problem = {
  slug: "longest-unique",
  title: "Longest Substring Without Repeats",
  emoji: "🔠",
  topic: "sliding-window",
  level: "Medium",
  statement: "Given a string s, find the length of the longest substring without repeating characters.",
  fields: [{ key: "s", label: "s", kind: "text" }],
  defaults: { s: "abcabcbb" },
  validate: (i) => (i.s.length === 0 ? "Type a string" : i.s.length > 40 ? "Keep it ≤ 40 chars for the animation" : null),
  gen: (n) => ({ s: Array.from({ length: n }, () => String.fromCharCode(97 + rand(0, 25))).join("") }),
  sizes: [8, 16, 32, 64, 128, 256, 512, 1024, 2048],
  takeaway:
    "Checking every substring is O(n³). Expanding from each start and stopping at the first repeat is O(n·m) — with only 26 letters that's already linear-ish (watch the race!). The sliding window never moves left backwards, so each char is added and removed once → O(n).",
  approaches: [
    {
      id: "brute",
      name: "Check every substring",
      badge: "Brute Force",
      time: "O(n³)",
      space: "O(m)",
      idea: "For every (i, j), scan s[i..j] with a set to see if it's all unique.",
      maxN: 256,
      java: `int lengthOfLongestSubstring(String s) {
    int best = 0;
    for (int i = 0; i < s.length(); i++)               //@outer
        for (int j = i; j < s.length(); j++)           //@inner
            if (allUnique(s, i, j))                    //@check
                best = Math.max(best, j - i + 1);      //@best
    return best;
}
boolean allUnique(String s, int i, int j) {
    Set<Character> set = new HashSet<>();
    for (int k = i; k <= j; k++)
        if (!set.add(s.charAt(k))) return false;
    return true;
}`,
      cpp: `bool allUnique(const string& s, int i, int j) {
    unordered_set<char> st;
    for (int k = i; k <= j; k++)
        if (!st.insert(s[k]).second) return false;
    return true;
}
int lengthOfLongestSubstring(string s) {
    int best = 0;
    for (int i = 0; i < (int)s.size(); i++)            //@outer
        for (int j = i; j < (int)s.size(); j++)        //@inner
            if (allUnique(s, i, j))                    //@check
                best = max(best, j - i + 1);           //@best
    return best;
}`,
      run: ({ s }, t) => {
        const a = [...(s as string)];
        let best = 0;
        for (let i = 0; i < a.length; i++)
          for (let j = i; j < a.length; j++) {
            const set = new Set<string>();
            let ok = true;
            for (let k = i; k <= j; k++) {
              t.op();
              if (set.has(a[k])) {
                ok = false;
                break;
              }
              set.add(a[k]);
            }
            if (ok && j - i + 1 > best) best = j - i + 1;
            t.snap(() => ({
              step: ok ? "best" : "check",
              msg: ok ? `"${a.slice(i, j + 1).join("")}" is unique (len ${j - i + 1}). best = ${best}` : `"${a.slice(i, j + 1).join("")}" has a repeat ✗`,
              mood: ok ? "happy" : "sad",
              arrays: [{ values: a, window: [i, j], tones: ok ? {} : { [j]: "warn" } }],
              vars: { i, j, best },
            }));
          }
        return String(best);
      },
    },
    {
      id: "expand",
      name: "Expand from each start",
      badge: "Better",
      time: "O(n·m)",
      space: "O(m)",
      idea: "From each i, grow j until the first repeat, then restart at i+1.",
      java: `int lengthOfLongestSubstring(String s) {
    int best = 0;
    for (int i = 0; i < s.length(); i++) {           //@outer
        Set<Character> seen = new HashSet<>();
        for (int j = i; j < s.length(); j++) {       //@inner
            if (!seen.add(s.charAt(j))) break;       //@repeat
            best = Math.max(best, j - i + 1);        //@best
        }
    }
    return best;
}`,
      cpp: `int lengthOfLongestSubstring(string s) {
    int best = 0;
    for (int i = 0; i < (int)s.size(); i++) {        //@outer
        unordered_set<char> seen;
        for (int j = i; j < (int)s.size(); j++) {    //@inner
            if (!seen.insert(s[j]).second) break;    //@repeat
            best = max(best, j - i + 1);             //@best
        }
    }
    return best;
}`,
      run: ({ s }, t) => {
        const a = [...(s as string)];
        let best = 0;
        for (let i = 0; i < a.length; i++) {
          const seen = new Set<string>();
          for (let j = i; j < a.length; j++) {
            t.op();
            if (seen.has(a[j])) {
              t.snap(() => ({
                step: "repeat",
                msg: `'${a[j]}' repeats → stop and restart from i = ${i + 1}. (All that work gets thrown away!)`,
                mood: "sad",
                arrays: [{ values: a, window: [i, j - 1], tones: { [j]: "warn" }, pointers: { i, j } }],
                maps: [{ title: "seen", kind: "set", entries: [...seen].map((c) => [c, ""]), highlight: [a[j]] }],
                vars: { i, j, best },
              }));
              break;
            }
            seen.add(a[j]);
            best = Math.max(best, j - i + 1);
            t.snap(() => ({
              step: "best",
              msg: `Add '${a[j]}'. Window "${a.slice(i, j + 1).join("")}" length ${j - i + 1}, best = ${best}`,
              mood: "happy",
              arrays: [{ values: a, window: [i, j], tones: { [j]: "active" }, pointers: { i, j } }],
              maps: [{ title: "seen", kind: "set", entries: [...seen].map((c) => [c, ""]), highlight: [a[j]] }],
              vars: { i, j, best },
            }));
          }
        }
        return String(best);
      },
    },
    {
      id: "window",
      name: "Sliding window + set",
      badge: "Optimal",
      time: "O(n)",
      space: "O(m)",
      idea: "Right pointer adds chars; on a repeat, move left forward until the window is valid again.",
      java: `int lengthOfLongestSubstring(String s) {
    Set<Character> window = new HashSet<>();
    int left = 0, best = 0;
    for (int right = 0; right < s.length(); right++) {  //@loop
        char c = s.charAt(right);
        while (window.contains(c)) {                    //@shrink
            window.remove(s.charAt(left));
            left++;
        }
        window.add(c);                                  //@add
        best = Math.max(best, right - left + 1);        //@best
    }
    return best;
}`,
      cpp: `int lengthOfLongestSubstring(string s) {
    unordered_set<char> window;
    int left = 0, best = 0;
    for (int right = 0; right < (int)s.size(); right++) {  //@loop
        char c = s[right];
        while (window.count(c)) {                          //@shrink
            window.erase(s[left]);
            left++;
        }
        window.insert(c);                                  //@add
        best = max(best, right - left + 1);                //@best
    }
    return best;
}`,
      run: ({ s }, t) => {
        const a = [...(s as string)];
        const win = new Set<string>();
        let left = 0,
          best = 0;
        for (let right = 0; right < a.length; right++) {
          const c = a[right];
          t.op();
          while (win.has(c)) {
            t.op();
            const l = left;
            t.snap(() => ({
              step: "shrink",
              msg: `'${c}' is already inside → drop '${a[l]}' from the left.`,
              mood: "think",
              arrays: [{ values: a, window: [l, right - 1], tones: { [l]: "warn", [right]: "compare" }, pointers: { left: l, right } }],
              maps: [{ title: "window", kind: "set", entries: [...win].map((x) => [x, ""]), highlight: [a[l]] }],
              vars: { left: l, right, best },
            }));
            win.delete(a[left]);
            left++;
          }
          win.add(c);
          const improved = right - left + 1 > best;
          best = Math.max(best, right - left + 1);
          const l = left;
          t.snap(() => ({
            step: "best",
            msg: `Add '${c}'. Window "${a.slice(l, right + 1).join("")}" (len ${right - l + 1})${improved ? " ⭐ new best!" : ""}`,
            mood: improved ? "wow" : "happy",
            arrays: [{ values: a, window: [l, right], tones: { [right]: "active" }, pointers: { left: l, right } }],
            maps: [{ title: "window", kind: "set", entries: [...win].map((x) => [x, ""]), highlight: [c] }],
            vars: { left: l, right, best },
          }));
        }
        return String(best);
      },
    },
  ],
};

export const searchSorted: Problem = {
  slug: "search-sorted",
  title: "Search in a Sorted Array",
  emoji: "🔍",
  topic: "binary-search",
  level: "Easy",
  statement: "Given a sorted array and a target, return its index or −1.",
  fields: [
    { key: "nums", label: "nums (sorted)", kind: "nums" },
    { key: "target", label: "target", kind: "num" },
  ],
  defaults: { nums: "2, 5, 8, 12, 16, 23, 38, 56, 72, 91, 99, 104, 120", target: "91" },
  validate: (i) => {
    for (let k = 1; k < i.nums.length; k++) if (i.nums[k] < i.nums[k - 1]) return "Binary search needs a sorted array";
    return null;
  },
  gen: (n) => {
    const nums: number[] = [];
    let v = 0;
    for (let i = 0; i < n; i++) nums.push((v += rand(1, 5)));
    return { nums, target: v + 1 }; // absent → worst case for both
  },
  sizes: [16, 64, 256, 1024, 4096, 16384, 65536, 262144, 1048576],
  takeaway:
    "Linear search looks at every element: 1 million items → 1 million checks. Binary search halves the range each time: 1 million items → about 20 checks. Sorted input should always make you think binary search.",
  approaches: [
    {
      id: "linear",
      name: "Linear scan",
      badge: "Brute Force",
      time: "O(n)",
      space: "O(1)",
      idea: "Walk from left to right until you find it.",
      java: `int search(int[] a, int target) {
    for (int i = 0; i < a.length; i++)   //@loop
        if (a[i] == target) return i;    //@check
    return -1;                           //@none
}`,
      cpp: `int search(vector<int>& a, int target) {
    for (int i = 0; i < (int)a.size(); i++)  //@loop
        if (a[i] == target) return i;        //@check
    return -1;                               //@none
}`,
      run: ({ nums: a, target }, t) => {
        for (let i = 0; i < a.length; i++) {
          t.op();
          const hit = a[i] === target;
          t.snap(() => ({
            step: "check",
            msg: hit ? `a[${i}] = ${a[i]} — found it! 🎉` : `a[${i}] = ${a[i]} ≠ ${target}, keep walking…`,
            mood: hit ? "wow" : "think",
            arrays: [{ values: a, tones: { ...Object.fromEntries(Array.from({ length: i }, (_, k) => [k, "dim"])), [i]: hit ? "found" : "active" }, pointers: { i } }],
            vars: { i, checks: t.ops },
          }));
          if (hit) return String(i);
        }
        t.snap(() => ({ step: "none", msg: "Not found.", mood: "sad", arrays: [{ values: a }] }));
        return "-1";
      },
    },
    {
      id: "binary",
      name: "Binary search",
      badge: "Optimal",
      time: "O(log n)",
      space: "O(1)",
      idea: "Look at the middle and throw away the half that can't contain the target.",
      java: `int search(int[] a, int target) {
    int lo = 0, hi = a.length - 1;
    while (lo <= hi) {                           //@loop
        int mid = lo + (hi - lo) / 2;            //@mid
        if (a[mid] == target) return mid;        //@found
        else if (a[mid] < target) lo = mid + 1;  //@right
        else hi = mid - 1;                       //@left
    }
    return -1;                                   //@none
}`,
      cpp: `int search(vector<int>& a, int target) {
    int lo = 0, hi = a.size() - 1;
    while (lo <= hi) {                           //@loop
        int mid = lo + (hi - lo) / 2;            //@mid
        if (a[mid] == target) return mid;        //@found
        else if (a[mid] < target) lo = mid + 1;  //@right
        else hi = mid - 1;                       //@left
    }
    return -1;                                   //@none
}`,
      run: ({ nums: a, target }, t) => {
        let lo = 0,
          hi = a.length - 1;
        const dimOutside = (l: number, h: number) => {
          const tones: Record<number, CellTone> = {};
          for (let k = 0; k < a.length; k++) if (k < l || k > h) tones[k] = "dim";
          return tones;
        };
        while (lo <= hi) {
          t.op();
          const mid = lo + Math.floor((hi - lo) / 2);
          const l = lo,
            h = hi;
          if (a[mid] === target) {
            t.snap(() => ({
              step: "found",
              msg: `a[mid] = ${a[mid]} — found in only ${t.ops} checks! log₂(${a.length}) ≈ ${Math.log2(a.length).toFixed(1)}`,
              mood: "cool",
              arrays: [{ values: a, tones: { ...dimOutside(l, h), [mid]: "found" }, pointers: { lo: l, mid, hi: h } }],
              vars: { lo: l, mid, hi: h },
            }));
            return String(mid);
          }
          const goRight = a[mid] < target;
          t.snap(() => ({
            step: goRight ? "right" : "left",
            msg: goRight
              ? `a[${mid}] = ${a[mid]} < ${target} → the answer is on the RIGHT. Throw away the left half!`
              : `a[${mid}] = ${a[mid]} > ${target} → the answer is on the LEFT. Throw away the right half!`,
            mood: "think",
            arrays: [{ values: a, tones: { ...dimOutside(l, h), [mid]: "active" }, pointers: { lo: l, mid, hi: h } }],
            vars: { lo: l, mid, hi: h, remaining: h - l + 1 },
          }));
          if (goRight) lo = mid + 1;
          else hi = mid - 1;
        }
        t.snap(() => ({ step: "none", msg: "lo passed hi — not found.", mood: "sad", arrays: [{ values: a, tones: dimOutside(1, 0) }] }));
        return "-1";
      },
    },
  ],
};

export const subarraySumK: Problem = {
  slug: "subarray-sum-k",
  title: "Subarray Sum Equals K",
  emoji: "➕",
  topic: "prefix-sum",
  level: "Medium",
  statement: "Count the contiguous subarrays whose sum equals k. Numbers can be negative.",
  fields: [
    { key: "nums", label: "nums", kind: "nums" },
    { key: "k", label: "k", kind: "num" },
  ],
  defaults: { nums: "1, 2, 3, -2, 2, 1, 3", k: "3" },
  gen: (n) => ({ nums: randArr(n, -3, 5), k: 4 }),
  sizes: [8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096],
  takeaway:
    "With negative numbers a sliding window can't decide when to shrink. Prefix sums turn \"sum(i..j) = k\" into \"prefix[j] − prefix[i] = k\", and a HashMap counts matching earlier prefixes in O(1).",
  approaches: [
    {
      id: "brute",
      name: "All start/end pairs",
      badge: "Brute Force",
      time: "O(n²)",
      space: "O(1)",
      idea: "For each start i, extend j and keep a running sum.",
      java: `int subarraySum(int[] a, int k) {
    int count = 0;
    for (int i = 0; i < a.length; i++) {     //@outer
        int sum = 0;
        for (int j = i; j < a.length; j++) { //@inner
            sum += a[j];
            if (sum == k) count++;           //@check
        }
    }
    return count;
}`,
      cpp: `int subarraySum(vector<int>& a, int k) {
    int count = 0;
    for (int i = 0; i < (int)a.size(); i++) {     //@outer
        int sum = 0;
        for (int j = i; j < (int)a.size(); j++) { //@inner
            sum += a[j];
            if (sum == k) count++;                //@check
        }
    }
    return count;
}`,
      run: ({ nums: a, k }, t) => {
        let count = 0;
        for (let i = 0; i < a.length; i++) {
          let sum = 0;
          for (let j = i; j < a.length; j++) {
            t.op();
            sum += a[j];
            const hit = sum === k;
            if (hit) count++;
            const s = sum,
              c = count;
            t.snap(() => ({
              step: "check",
              msg: hit ? `sum(${i}..${j}) = ${s} = k ✔ count = ${c}` : `sum(${i}..${j}) = ${s}`,
              mood: hit ? "happy" : "think",
              arrays: [{ values: a, window: [i, j], tones: hit ? Object.fromEntries(Array.from({ length: j - i + 1 }, (_, x) => [i + x, "found"])) : {} }],
              vars: { i, j, sum: s, count: c },
            }));
          }
        }
        return String(count);
      },
    },
    {
      id: "prefix",
      name: "Prefix sum + HashMap",
      badge: "Optimal",
      time: "O(n)",
      space: "O(n)",
      idea: "At each index, count earlier prefixes equal to (sum − k).",
      java: `int subarraySum(int[] a, int k) {
    Map<Integer, Integer> count = new HashMap<>();
    count.put(0, 1);                                //@init
    int sum = 0, ans = 0;
    for (int x : a) {                               //@loop
        sum += x;                                   //@sum
        ans += count.getOrDefault(sum - k, 0);      //@lookup
        count.merge(sum, 1, Integer::sum);          //@put
    }
    return ans;
}`,
      cpp: `int subarraySum(vector<int>& a, int k) {
    unordered_map<int, int> count;
    count[0] = 1;                                   //@init
    int sum = 0, ans = 0;
    for (int x : a) {                               //@loop
        sum += x;                                   //@sum
        if (count.count(sum - k)) ans += count[sum - k]; //@lookup
        count[sum]++;                               //@put
    }
    return ans;
}`,
      run: ({ nums: a, k }, t) => {
        const count = new Map<number, number>([[0, 1]]);
        let sum = 0,
          ans = 0;
        t.snap(() => ({
          step: "init",
          msg: "Start with prefix 0 seen once (the empty prefix).",
          arrays: [{ values: a }],
          maps: [{ title: "prefix sum → times seen", entries: mapEntries(count) }],
        }));
        for (let i = 0; i < a.length; i++) {
          sum += a[i];
          t.op();
          const got = count.get(sum - k) ?? 0;
          ans += got;
          const s = sum,
            an = ans;
          t.snap(() => ({
            step: "lookup",
            msg: got
              ? `prefix = ${s}. Need ${s} − ${k} = ${s - k}: seen ${got}× → ${got} new subarray(s)! ans = ${an}`
              : `prefix = ${s}. Need ${s - k} — never seen.`,
            mood: got ? "wow" : "think",
            arrays: [{ values: a, tones: { [i]: got ? "found" : "active" }, pointers: { i } }],
            maps: [{ title: "prefix sum → times seen", entries: mapEntries(count), highlight: got ? [String(s - k)] : [], miss: got ? undefined : String(s - k) }],
            vars: { sum: s, "sum-k": s - k, ans: an },
          }));
          count.set(sum, (count.get(sum) ?? 0) + 1);
          t.op();
        }
        t.snap(() => ({
          step: "put",
          msg: `Done: ${ans} subarrays in one pass.`,
          mood: "cool",
          arrays: [{ values: a }],
          maps: [{ title: "prefix sum → times seen", entries: mapEntries(count) }],
        }));
        return String(ans);
      },
    },
  ],
};
