import type { Problem } from "../types";
import { rand } from "../tracer";

export const climbingStairs: Problem = {
  slug: "climbing-stairs",
  title: "Climbing Stairs (Fibonacci)",
  emoji: "🪜",
  topic: "dynamic-programming",
  level: "Easy",
  statement: "You climb 1 or 2 steps at a time. How many distinct ways are there to reach step n?",
  fields: [{ key: "n", label: "n", kind: "num" }],
  defaults: { n: "6" },
  validate: (i) => (i.n < 1 || i.n > 30 ? "Pick n between 1 and 30" : null),
  gen: (n) => ({ n }),
  sizes: [4, 8, 12, 16, 20, 24, 28],
  sizeLabel: "n",
  takeaway:
    "Plain recursion recomputes the same sub-answers again and again — look at the \"times called\" row explode. That's the DP signal: overlapping subproblems. Memoization caches each answer (O(n)), tabulation fills a table bottom-up (O(n)), and since each step needs only the last two, two variables are enough (O(1) space).",
  approaches: [
    {
      id: "recursion",
      name: "Plain recursion",
      badge: "Recursion",
      time: "O(2ⁿ)",
      space: "O(n)",
      idea: "ways(n) = ways(n−1) + ways(n−2). Simple… and exponentially slow.",
      maxN: 28,
      java: `int ways(int n) {
    if (n <= 2) return n;                 //@base
    return ways(n - 1) + ways(n - 2);     //@call
}`,
      cpp: `int ways(int n) {
    if (n <= 2) return n;                 //@base
    return ways(n - 1) + ways(n - 2);     //@call
}`,
      run: ({ n }, t) => {
        const calls = new Array(n + 1).fill(0);
        const stack: string[] = [];
        const table = () => ({
          title: "times called",
          colLabels: Array.from({ length: n }, (_, i) => `ways(${i + 1})`),
          rows: [calls.slice(1)],
        });
        const rec = (k: number): number => {
          t.op();
          calls[k]++;
          stack.push(`ways(${k})`);
          if (k <= 2) {
            t.snap(() => ({
              step: "base",
              msg: `ways(${k}) is a base case = ${k}.`,
              mood: "happy",
              stacks: [{ title: "call stack", kind: "stack", items: [...stack], highlight: stack.length - 1 }],
              table: { ...table(), active: [0, k - 1] },
              vars: { calls: t.ops },
            }));
            stack.pop();
            return k;
          }
          t.snap(() => ({
            step: "call",
            msg:
              calls[k] > 1
                ? `Computing ways(${k}) AGAIN (${calls[k]}× now)… wasted work! 😩`
                : `ways(${k}) needs ways(${k - 1}) + ways(${k - 2}).`,
            mood: calls[k] > 1 ? "sad" : "think",
            stacks: [{ title: "call stack", kind: "stack", items: [...stack], highlight: stack.length - 1 }],
            table: { ...table(), active: [0, k - 1] },
            vars: { calls: t.ops },
          }));
          const r = rec(k - 1) + rec(k - 2);
          stack.pop();
          return r;
        };
        const ans = rec(n);
        t.snap(() => ({
          step: "call",
          msg: `Answer ${ans}, but it took ${t.ops} calls! Every extra step multiplies the calls by ~1.6.`,
          mood: "wow",
          table: table(),
          vars: { calls: t.ops, answer: ans },
        }));
        return String(ans);
      },
    },
    {
      id: "memo",
      name: "Recursion + memo",
      badge: "DP",
      time: "O(n)",
      space: "O(n)",
      idea: "Same recursion, but store each answer the first time and reuse it.",
      java: `int[] memo = new int[n + 1];
int ways(int n) {
    if (n <= 2) return n;                         //@base
    if (memo[n] != 0) return memo[n];             //@hit
    return memo[n] = ways(n - 1) + ways(n - 2);   //@call
}`,
      cpp: `vector<int> memo(n + 1, 0);
int ways(int n) {
    if (n <= 2) return n;                         //@base
    if (memo[n] != 0) return memo[n];             //@hit
    return memo[n] = ways(n - 1) + ways(n - 2);   //@call
}`,
      run: ({ n }, t) => {
        const memo: (number | null)[] = new Array(n + 1).fill(null);
        const stack: string[] = [];
        const table = (k?: number) => ({
          title: "memo",
          colLabels: Array.from({ length: n }, (_, i) => String(i + 1)),
          rows: [memo.slice(1).map((v, i) => (i + 1 <= 2 ? i + 1 : v))],
          active: k ? ([0, k - 1] as [number, number]) : undefined,
        });
        const rec = (k: number): number => {
          t.op();
          stack.push(`ways(${k})`);
          if (k <= 2) {
            stack.pop();
            return k;
          }
          if (memo[k] !== null) {
            t.snap(() => ({
              step: "hit",
              msg: `ways(${k}) is already in the memo → ${memo[k]} instantly ⚡`,
              mood: "cool",
              stacks: [{ title: "call stack", kind: "stack", items: [...stack], highlight: stack.length - 1 }],
              table: table(k),
              vars: { calls: t.ops },
            }));
            stack.pop();
            return memo[k]!;
          }
          t.snap(() => ({
            step: "call",
            msg: `ways(${k}) not cached yet → compute it once.`,
            mood: "think",
            stacks: [{ title: "call stack", kind: "stack", items: [...stack], highlight: stack.length - 1 }],
            table: table(k),
            vars: { calls: t.ops },
          }));
          memo[k] = rec(k - 1) + rec(k - 2);
          t.snap(() => ({
            step: "call",
            msg: `Saved memo[${k}] = ${memo[k]}.`,
            mood: "happy",
            stacks: [{ title: "call stack", kind: "stack", items: [...stack], highlight: stack.length - 1 }],
            table: table(k),
            vars: { calls: t.ops },
          }));
          stack.pop();
          return memo[k]!;
        };
        const ans = rec(n);
        return String(ans);
      },
    },
    {
      id: "table",
      name: "Bottom-up table",
      badge: "DP",
      time: "O(n)",
      space: "O(n)",
      idea: "Fill dp[1], dp[2], … dp[n] in order with a loop. No recursion at all.",
      java: `int climbStairs(int n) {
    int[] dp = new int[n + 2];
    dp[1] = 1; dp[2] = 2;                     //@base
    for (int i = 3; i <= n; i++)              //@loop
        dp[i] = dp[i - 1] + dp[i - 2];        //@fill
    return dp[n];
}`,
      cpp: `int climbStairs(int n) {
    vector<int> dp(n + 2, 0);
    dp[1] = 1; dp[2] = 2;                     //@base
    for (int i = 3; i <= n; i++)              //@loop
        dp[i] = dp[i - 1] + dp[i - 2];        //@fill
    return dp[n];
}`,
      run: ({ n }, t) => {
        const dp: (number | null)[] = new Array(n + 1).fill(null);
        dp[1] = 1;
        if (n >= 2) dp[2] = 2;
        const table = (i?: number) => ({
          title: "dp[i] = ways to reach step i",
          colLabels: Array.from({ length: n }, (_, k) => String(k + 1)),
          rows: [dp.slice(1)],
          active: i ? ([0, i - 1] as [number, number]) : undefined,
          reads: i ? ([[0, i - 2], [0, i - 3]] as [number, number][]) : undefined,
        });
        t.snap(() => ({ step: "base", msg: "Base cases: 1 way to reach step 1, 2 ways to reach step 2.", mood: "happy", table: table() }));
        for (let i = 3; i <= n; i++) {
          t.op();
          dp[i] = dp[i - 1]! + dp[i - 2]!;
          t.snap(() => ({
            step: "fill",
            msg: `dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}`,
            mood: "think",
            table: table(i),
            vars: { i, ops: t.ops },
          }));
        }
        return String(n === 1 ? 1 : dp[n]);
      },
    },
    {
      id: "two-vars",
      name: "Two variables",
      badge: "Optimal",
      time: "O(n)",
      space: "O(1)",
      idea: "dp[i] only needs the previous two values, so keep just those.",
      java: `int climbStairs(int n) {
    if (n <= 2) return n;
    int prev2 = 1, prev1 = 2;                 //@base
    for (int i = 3; i <= n; i++) {            //@loop
        int cur = prev1 + prev2;              //@fill
        prev2 = prev1;
        prev1 = cur;
    }
    return prev1;
}`,
      cpp: `int climbStairs(int n) {
    if (n <= 2) return n;
    int prev2 = 1, prev1 = 2;                 //@base
    for (int i = 3; i <= n; i++) {            //@loop
        int cur = prev1 + prev2;              //@fill
        prev2 = prev1;
        prev1 = cur;
    }
    return prev1;
}`,
      run: ({ n }, t) => {
        if (n <= 2) return String(n);
        let p2 = 1,
          p1 = 2;
        t.snap(() => ({ step: "base", msg: "Only two numbers to remember.", mood: "cool", vars: { prev2: 1, prev1: 2 } }));
        for (let i = 3; i <= n; i++) {
          t.op();
          const cur = p1 + p2;
          p2 = p1;
          p1 = cur;
          const a = p2,
            b = p1;
          t.snap(() => ({ step: "fill", msg: `Step ${i}: ${b} ways. Shift the window forward.`, mood: "happy", vars: { i, prev2: a, prev1: b } }));
        }
        return String(p1);
      },
    },
  ],
};

export const coinChange: Problem = {
  slug: "coin-change",
  title: "Coin Change (Greedy vs DP)",
  emoji: "🪙",
  topic: "dynamic-programming",
  level: "Medium",
  statement: "Given coin denominations and an amount, return the fewest coins that make the amount (or −1).",
  fields: [
    { key: "coins", label: "coins", kind: "nums" },
    { key: "amount", label: "amount", kind: "num" },
  ],
  defaults: { coins: "1, 3, 4", amount: "6" },
  validate: (i) =>
    i.coins.some((c: number) => c <= 0) ? "Coins must be positive" : i.amount < 0 || i.amount > 60 ? "Pick amount 0–60" : null,
  gen: (n) => ({ coins: [1, 3, 4], amount: n }),
  sizes: [6, 10, 14, 18, 22, 26, 30, 60, 120, 240],
  sizeLabel: "amount",
  takeaway:
    "Greedy (always grab the biggest coin) is super fast but WRONG here: for 6 with [1,3,4] it picks 4+1+1 = 3 coins, while 3+3 = 2 coins. Plain recursion tries everything (exponential). DP solves each amount once: dp[x] = 1 + min(dp[x − coin]). Lesson: if you can find a counter-example to greedy, reach for DP.",
  approaches: [
    {
      id: "greedy",
      name: "Biggest coin first",
      badge: "Greedy",
      time: "O(c log c + amount)",
      space: "O(1)",
      idea: "Sort coins descending and take as many of the biggest as fit.",
      java: `int coinChange(int[] coins, int amount) {
    Integer[] c = Arrays.stream(coins).boxed().toArray(Integer[]::new);
    Arrays.sort(c, Collections.reverseOrder());   //@sort
    int count = 0;
    for (int coin : c)                            //@loop
        while (amount >= coin) {                  //@take
            amount -= coin; count++;
        }
    return amount == 0 ? count : -1;              //@result
}`,
      cpp: `int coinChange(vector<int> coins, int amount) {
    sort(coins.rbegin(), coins.rend());           //@sort
    int count = 0;
    for (int coin : coins)                        //@loop
        while (amount >= coin) {                  //@take
            amount -= coin; count++;
        }
    return amount == 0 ? count : -1;              //@result
}`,
      run: ({ coins, amount }, t) => {
        const c = [...coins].sort((a: number, b: number) => b - a);
        let left = amount,
          count = 0;
        const picked: number[] = [];
        t.snap(() => ({ step: "sort", msg: `Coins sorted big → small: ${c.join(", ")}`, arrays: [{ label: "coins", values: c }], vars: { left, count } }));
        for (let ci = 0; ci < c.length; ci++) {
          t.op();
          while (left >= c[ci]) {
            t.op();
            left -= c[ci];
            count++;
            picked.push(c[ci]);
            const l = left,
              p = [...picked];
            t.snap(() => ({
              step: "take",
              msg: `Grab ${c[ci]} → ${l} left.`,
              mood: "happy",
              arrays: [
                { label: "coins", values: c, tones: { [ci]: "active" } },
                { label: "picked", values: p },
              ],
              vars: { left: l, count: p.length },
            }));
          }
        }
        const ans = left === 0 ? count : -1;
        t.snap(() => ({
          step: "result",
          msg:
            ans === -1
              ? `Greedy got stuck with ${left} left → −1 (even if a real answer exists!)`
              : `Greedy says ${ans} coins: ${picked.join(" + ")}. Is that really the minimum? Check the DP tab 👀`,
          mood: ans === -1 ? "sad" : "think",
          arrays: [{ label: "picked", values: picked.length ? picked : ["∅"] }],
          vars: { answer: ans },
        }));
        return String(ans);
      },
    },
    {
      id: "recursion",
      name: "Try every coin (recursion)",
      badge: "Brute Force",
      time: "O(cᵃᵐᵒᵘⁿᵗ)",
      space: "O(amount)",
      idea: "min coins(x) = 1 + min over coins of coins(x − coin). Recomputes the same x many times.",
      maxN: 40,
      java: `int minCoins(int[] coins, int x) {
    if (x == 0) return 0;                          //@base
    int best = Integer.MAX_VALUE;
    for (int c : coins)                            //@loop
        if (c <= x) {
            int sub = minCoins(coins, x - c);      //@call
            if (sub != Integer.MAX_VALUE) best = Math.min(best, sub + 1);
        }
    return best;
}`,
      cpp: `int minCoins(vector<int>& coins, int x) {
    if (x == 0) return 0;                          //@base
    int best = INT_MAX;
    for (int c : coins)                            //@loop
        if (c <= x) {
            int sub = minCoins(coins, x - c);      //@call
            if (sub != INT_MAX) best = min(best, sub + 1);
        }
    return best;
}`,
      run: ({ coins, amount }, t) => {
        const calls = new Array(amount + 1).fill(0);
        const stack: string[] = [];
        const rec = (x: number): number => {
          t.op();
          calls[x]++;
          stack.push(`f(${x})`);
          if (x > 0)
            t.snap(() => ({
              step: "call",
              msg: calls[x] > 1 ? `f(${x}) again — ${calls[x]}× now 😩` : `f(${x}): try each coin.`,
              mood: calls[x] > 1 ? "sad" : "think",
              stacks: [{ title: "call stack", kind: "stack", items: [...stack], highlight: stack.length - 1 }],
              table: { title: "times f(x) was called", colLabels: calls.map((_, i) => String(i)), rows: [[...calls]], active: [0, x] },
              vars: { calls: t.ops },
            }));
          if (x === 0) {
            stack.pop();
            return 0;
          }
          let best = Infinity;
          for (const c of coins)
            if (c <= x) {
              const sub = rec(x - c);
              if (sub !== Infinity) best = Math.min(best, sub + 1);
            }
          stack.pop();
          return best;
        };
        const r = rec(amount);
        const ans = r === Infinity ? -1 : r;
        t.snap(() => ({
          step: "base",
          msg: `Correct answer ${ans}, but it took ${t.ops} calls. Too slow for big amounts.`,
          mood: "wow",
          table: { title: "times f(x) was called", colLabels: calls.map((_, i) => String(i)), rows: [[...calls]] },
        }));
        return String(ans);
      },
    },
    {
      id: "dp",
      name: "Bottom-up DP",
      badge: "DP",
      time: "O(amount · c)",
      space: "O(amount)",
      idea: "dp[x] = fewest coins for amount x, built from smaller amounts.",
      java: `int coinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1);                  // "infinity"
    dp[0] = 0;                                    //@base
    for (int x = 1; x <= amount; x++)             //@loop
        for (int c : coins)
            if (c <= x)
                dp[x] = Math.min(dp[x], dp[x - c] + 1); //@fill
    return dp[amount] > amount ? -1 : dp[amount]; //@result
}`,
      cpp: `int coinChange(vector<int>& coins, int amount) {
    vector<int> dp(amount + 1, amount + 1);       // "infinity"
    dp[0] = 0;                                    //@base
    for (int x = 1; x <= amount; x++)             //@loop
        for (int c : coins)
            if (c <= x)
                dp[x] = min(dp[x], dp[x - c] + 1); //@fill
    return dp[amount] > amount ? -1 : dp[amount]; //@result
}`,
      run: ({ coins, amount }, t) => {
        const INF = amount + 1;
        const dp = new Array(amount + 1).fill(INF);
        dp[0] = 0;
        const show = () => dp.map((v) => (v >= INF ? "∞" : v));
        const cols = dp.map((_, i) => String(i));
        t.snap(() => ({ step: "base", msg: "dp[0] = 0 coins. Everything else starts at ∞.", table: { title: "dp[x] = fewest coins for x", colLabels: cols, rows: [show()] } }));
        for (let x = 1; x <= amount; x++)
          for (const c of coins) {
            if (c > x) continue;
            t.op();
            const before = dp[x];
            dp[x] = Math.min(dp[x], dp[x - c] + 1);
            const improved = dp[x] < before;
            t.snap(() => ({
              step: "fill",
              msg: `x = ${x}, coin ${c}: dp[${x - c}] + 1 = ${dp[x - c] >= INF ? "∞" : dp[x - c] + 1}${improved ? ` → dp[${x}] = ${dp[x]} ⭐` : " (no better)"}`,
              mood: improved ? "happy" : "think",
              table: { title: "dp[x] = fewest coins for x", colLabels: cols, rows: [show()], active: [0, x], reads: [[0, x - c]] },
              vars: { x, coin: c },
            }));
          }
        const ans = dp[amount] >= INF ? -1 : dp[amount];
        t.snap(() => ({
          step: "result",
          msg: `DP answer: ${ans} coin(s). Guaranteed optimal ✔`,
          mood: "cool",
          table: { title: "dp[x] = fewest coins for x", colLabels: cols, rows: [show()], active: [0, amount] },
        }));
        return String(ans);
      },
    },
  ],
};

export const lcs: Problem = {
  slug: "lcs",
  title: "Longest Common Subsequence",
  emoji: "🧬",
  topic: "dynamic-programming",
  level: "Medium",
  statement: "Return the length of the longest subsequence that appears in both strings (characters in order, not necessarily adjacent).",
  fields: [
    { key: "a", label: "text1", kind: "text" },
    { key: "b", label: "text2", kind: "text" },
  ],
  defaults: { a: "ACBDE", b: "ABCDE" },
  validate: (i) => (!i.a || !i.b ? "Both strings needed" : i.a.length > 10 || i.b.length > 10 ? "Keep each ≤ 10 chars" : null),
  gen: (n) => {
    const r = () => Array.from({ length: n }, () => "ABCD"[rand(0, 3)]).join("");
    return { a: r(), b: r() };
  },
  sizes: [3, 5, 7, 9, 11, 20, 40, 80, 160],
  sizeLabel: "length",
  takeaway:
    "Two strings → 2D DP where dp[i][j] is the answer for the first i chars of A and first j of B. Match → diagonal + 1; otherwise best of top or left. The brute force recursion branches twice on every mismatch → exponential.",
  approaches: [
    {
      id: "recursion",
      name: "Plain recursion",
      badge: "Recursion",
      time: "O(2ᵐ⁺ⁿ)",
      space: "O(m + n)",
      idea: "Compare last chars: match → 1 + f(i−1, j−1), else max(f(i−1, j), f(i, j−1)).",
      maxN: 11,
      java: `int f(String a, String b, int i, int j) {
    if (i == 0 || j == 0) return 0;                        //@base
    if (a.charAt(i - 1) == b.charAt(j - 1))
        return 1 + f(a, b, i - 1, j - 1);                  //@match
    return Math.max(f(a, b, i - 1, j), f(a, b, i, j - 1)); //@split
}`,
      cpp: `int f(string& a, string& b, int i, int j) {
    if (i == 0 || j == 0) return 0;                        //@base
    if (a[i - 1] == b[j - 1])
        return 1 + f(a, b, i - 1, j - 1);                  //@match
    return max(f(a, b, i - 1, j), f(a, b, i, j - 1));      //@split
}`,
      run: ({ a, b }, t) => {
        const m = a.length,
          n = b.length;
        const calls = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
        const rec = (i: number, j: number): number => {
          t.op();
          calls[i][j]++;
          const match = i > 0 && j > 0 && a[i - 1] === b[j - 1];
          t.snap(() => ({
            step: i === 0 || j === 0 ? "base" : match ? "match" : "split",
            msg:
              i === 0 || j === 0
                ? `f(${i}, ${j}): an empty string → 0`
                : calls[i][j] > 1
                  ? `f(${i}, ${j}) recomputed (${calls[i][j]}×) 😩`
                  : match
                    ? `'${a[i - 1]}' = '${b[j - 1]}' → 1 + f(${i - 1}, ${j - 1})`
                    : `'${a[i - 1]}' ≠ '${b[j - 1]}' → branch into two calls`,
            mood: calls[i][j] > 1 ? "sad" : "think",
            table: {
              title: "times f(i, j) was called",
              rowLabels: ["∅", ...a],
              colLabels: ["∅", ...b],
              rows: calls.map((r) => [...r]),
              active: [i, j],
            },
            vars: { calls: t.ops },
          }));
          if (i === 0 || j === 0) return 0;
          if (match) return 1 + rec(i - 1, j - 1);
          return Math.max(rec(i - 1, j), rec(i, j - 1));
        };
        return String(rec(m, n));
      },
    },
    {
      id: "table",
      name: "2D DP table",
      badge: "DP",
      time: "O(m · n)",
      space: "O(m · n)",
      idea: "Fill dp row by row; each cell looks at the diagonal, top and left.",
      java: `int lcs(String a, String b) {
    int m = a.length(), n = b.length();
    int[][] dp = new int[m + 1][n + 1];               //@base
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++)                  //@loop
            if (a.charAt(i - 1) == b.charAt(j - 1))
                dp[i][j] = dp[i - 1][j - 1] + 1;      //@match
            else
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]); //@split
    return dp[m][n];                                  //@result
}`,
      cpp: `int lcs(string a, string b) {
    int m = a.size(), n = b.size();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0)); //@base
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++)                  //@loop
            if (a[i - 1] == b[j - 1])
                dp[i][j] = dp[i - 1][j - 1] + 1;      //@match
            else
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]); //@split
    return dp[m][n];                                  //@result
}`,
      run: ({ a, b }, t) => {
        const m = a.length,
          n = b.length;
        const dp: (number | null)[][] = Array.from({ length: m + 1 }, (_, i) =>
          Array.from({ length: n + 1 }, (_, j) => (i === 0 || j === 0 ? 0 : null)),
        );
        const tbl = (active?: [number, number], reads?: [number, number][]) => ({
          title: "dp[i][j]",
          rowLabels: ["∅", ...a],
          colLabels: ["∅", ...b],
          rows: dp.map((r) => [...r]),
          active,
          reads,
        });
        t.snap(() => ({ step: "base", msg: "Row 0 and column 0 are 0 — LCS with an empty string.", table: tbl() }));
        for (let i = 1; i <= m; i++)
          for (let j = 1; j <= n; j++) {
            t.op();
            const match = a[i - 1] === b[j - 1];
            dp[i][j] = match ? dp[i - 1][j - 1]! + 1 : Math.max(dp[i - 1][j]!, dp[i][j - 1]!);
            t.snap(() => ({
              step: match ? "match" : "split",
              msg: match
                ? `'${a[i - 1]}' = '${b[j - 1]}' → diagonal ${dp[i - 1][j - 1]} + 1 = ${dp[i][j]}`
                : `'${a[i - 1]}' ≠ '${b[j - 1]}' → max(top ${dp[i - 1][j]}, left ${dp[i][j - 1]}) = ${dp[i][j]}`,
              mood: match ? "happy" : "think",
              table: tbl([i, j], match ? [[i - 1, j - 1]] : [[i - 1, j], [i, j - 1]]),
              vars: { i, j },
            }));
          }
        t.snap(() => ({ step: "result", msg: `Bottom-right cell = ${dp[m][n]} 🎉`, mood: "cool", table: tbl([m, n]) }));
        return String(dp[m][n]);
      },
    },
  ],
};
