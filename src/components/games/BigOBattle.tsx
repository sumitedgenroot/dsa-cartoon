"use client";

import { useEffect, useMemo, useState } from "react";
import { Code } from "@/components/CodeBlock";
import { useLang } from "@/lib/lang";
import { useHighScore } from "@/lib/progress";
import { MascotSays } from "@/components/Mascot";
import { celebrate, EndScreen, ScoreBar, shuffle, StartScreen, TimerBar } from "./kit";

const OPTIONS = ["O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n²)", "O(2ⁿ)"];

type Q = { java: string; cpp: string; answer: string; why: string };

const QUESTIONS: Q[] = [
  {
    java: `int first(int[] a) {\n    return a[0];\n}`,
    cpp: `int first(vector<int>& a) {\n    return a[0];\n}`,
    answer: "O(1)",
    why: "One array access, no matter how big the array is.",
  },
  {
    java: `int sum(int[] a) {\n    int s = 0;\n    for (int x : a) s += x;\n    return s;\n}`,
    cpp: `int sum(vector<int>& a) {\n    int s = 0;\n    for (int x : a) s += x;\n    return s;\n}`,
    answer: "O(n)",
    why: "A single loop over n elements.",
  },
  {
    java: `for (int i = 0; i < n; i++)\n    for (int j = 0; j < n; j++)\n        count++;`,
    cpp: `for (int i = 0; i < n; i++)\n    for (int j = 0; j < n; j++)\n        count++;`,
    answer: "O(n²)",
    why: "Loop inside a loop, both up to n → n × n.",
  },
  {
    java: `int i = n;\nwhile (i > 1) {\n    i = i / 2;\n    steps++;\n}`,
    cpp: `int i = n;\nwhile (i > 1) {\n    i /= 2;\n    steps++;\n}`,
    answer: "O(log n)",
    why: "Halving each time → how many times can you halve n? log₂ n.",
  },
  {
    java: `int fib(int n) {\n    if (n <= 1) return n;\n    return fib(n - 1) + fib(n - 2);\n}`,
    cpp: `int fib(int n) {\n    if (n <= 1) return n;\n    return fib(n - 1) + fib(n - 2);\n}`,
    answer: "O(2ⁿ)",
    why: "Two recursive branches per call, depth n, no memo → exponential.",
  },
  {
    java: `Arrays.sort(a);\nfor (int i = 1; i < a.length; i++)\n    if (a[i] == a[i - 1]) return true;`,
    cpp: `sort(a.begin(), a.end());\nfor (int i = 1; i < a.size(); i++)\n    if (a[i] == a[i - 1]) return true;`,
    answer: "O(n log n)",
    why: "Sort is n log n, the loop is n. The bigger term wins.",
  },
  {
    java: `for (int i = 0; i < n; i++)\n    for (int j = i; j < n; j++)\n        pairs++;`,
    cpp: `for (int i = 0; i < n; i++)\n    for (int j = i; j < n; j++)\n        pairs++;`,
    answer: "O(n²)",
    why: "n + (n−1) + … + 1 = n(n+1)/2 — still quadratic (constants dropped).",
  },
  {
    java: `for (int i = 0; i < n; i++) a++;\nfor (int j = 0; j < n; j++) b++;`,
    cpp: `for (int i = 0; i < n; i++) a++;\nfor (int j = 0; j < n; j++) b++;`,
    answer: "O(n)",
    why: "Two loops one AFTER the other: n + n = 2n → O(n). They add, not multiply.",
  },
  {
    java: `int lo = 0, hi = n - 1;\nwhile (lo <= hi) {\n    int mid = lo + (hi - lo) / 2;\n    if (a[mid] == t) return mid;\n    if (a[mid] < t) lo = mid + 1; else hi = mid - 1;\n}`,
    cpp: `int lo = 0, hi = n - 1;\nwhile (lo <= hi) {\n    int mid = lo + (hi - lo) / 2;\n    if (a[mid] == t) return mid;\n    if (a[mid] < t) lo = mid + 1; else hi = mid - 1;\n}`,
    answer: "O(log n)",
    why: "Binary search discards half the range every step.",
  },
  {
    java: `for (int i = 0; i < n; i++)\n    for (int j = 1; j < n; j *= 2)\n        work++;`,
    cpp: `for (int i = 0; i < n; i++)\n    for (int j = 1; j < n; j *= 2)\n        work++;`,
    answer: "O(n log n)",
    why: "Outer loop n times, inner loop doubles j → log n. Multiply: n log n.",
  },
  {
    java: `Map<Integer,Integer> m = new HashMap<>();\nfor (int x : a) m.merge(x, 1, Integer::sum);`,
    cpp: `unordered_map<int,int> m;\nfor (int x : a) m[x]++;`,
    answer: "O(n)",
    why: "n HashMap updates, each O(1) on average.",
  },
  {
    java: `void subsets(int i, List<Integer> cur) {\n    if (i == n) { print(cur); return; }\n    subsets(i + 1, cur);          // skip\n    cur.add(a[i]);\n    subsets(i + 1, cur);          // take\n    cur.remove(cur.size() - 1);\n}`,
    cpp: `void subsets(int i, vector<int>& cur) {\n    if (i == n) { print(cur); return; }\n    subsets(i + 1, cur);          // skip\n    cur.push_back(a[i]);\n    subsets(i + 1, cur);          // take\n    cur.pop_back();\n}`,
    answer: "O(2ⁿ)",
    why: "Each element is either taken or skipped → 2ⁿ subsets.",
  },
  {
    java: `int x = n * n + 5;\nint y = x % 7;\nreturn y * 3;`,
    cpp: `int x = n * n + 5;\nint y = x % 7;\nreturn y * 3;`,
    answer: "O(1)",
    why: "n appears in a formula, but there are no loops — constant work.",
  },
  {
    java: `PriorityQueue<Integer> pq = new PriorityQueue<>();\nfor (int x : a) pq.offer(x);\nwhile (!pq.isEmpty()) out.add(pq.poll());`,
    cpp: `priority_queue<int, vector<int>, greater<int>> pq;\nfor (int x : a) pq.push(x);\nwhile (!pq.empty()) { out.push_back(pq.top()); pq.pop(); }`,
    answer: "O(n log n)",
    why: "n pushes and n pops, each O(log n) → heap sort!",
  },
  {
    java: `int l = 0, r = n - 1;\nwhile (l < r) {\n    if (a[l] + a[r] > t) r--;\n    else l++;\n}`,
    cpp: `int l = 0, r = n - 1;\nwhile (l < r) {\n    if (a[l] + a[r] > t) r--;\n    else l++;\n}`,
    answer: "O(n)",
    why: "Each step moves one pointer inward; they meet after at most n steps.",
  },
  {
    java: `for (int i = 0; i < n; i++)\n    while (!st.isEmpty() && st.peek() < a[i])\n        st.pop();\n    st.push(a[i]);`,
    cpp: `for (int i = 0; i < n; i++) {\n    while (!st.empty() && st.top() < a[i]) st.pop();\n    st.push(a[i]);\n}`,
    answer: "O(n)",
    why: "Tricky! Each element is pushed once and popped at most once → amortized O(n) total.",
  },
  {
    java: `String s = "";\nfor (int i = 0; i < n; i++)\n    s += "a";   // Java String is immutable`,
    cpp: `string s = "";\nfor (int i = 0; i < n; i++)\n    s = s + "a";   // creates a new string`,
    answer: "O(n²)",
    why: "Each concatenation copies the whole string: 1 + 2 + … + n = O(n²).",
  },
  {
    java: `int[] dp = new int[n + 1];\ndp[1] = 1;\nfor (int i = 2; i <= n; i++)\n    dp[i] = dp[i - 1] + dp[i - 2];`,
    cpp: `vector<int> dp(n + 1);\ndp[1] = 1;\nfor (int i = 2; i <= n; i++)\n    dp[i] = dp[i - 1] + dp[i - 2];`,
    answer: "O(n)",
    why: "Fibonacci with a table: each value is computed once.",
  },
];

const ROUND_SECONDS = 15;

export default function BigOBattle() {
  const { lang } = useLang();
  const { best, submit } = useHighScore("big-o-battle");
  const [phase, setPhase] = useState<"start" | "play" | "end">("start");
  const [order, setOrder] = useState<Q[]>([]);
  const [qi, setQi] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [picked, setPicked] = useState<string | null>(null);
  const [left, setLeft] = useState(ROUND_SECONDS);
  const q = order[qi];

  const start = () => {
    setOrder(shuffle(QUESTIONS).slice(0, 12));
    setQi(0);
    setScore(0);
    setStreak(0);
    setLives(3);
    setPicked(null);
    setLeft(ROUND_SECONDS);
    setPhase("play");
  };

  useEffect(() => {
    if (phase !== "play" || picked) return;
    const id = setTimeout(() => {
      if (left <= 0.1) {
        setLeft(0);
        setPicked("⏰");
        setStreak(0);
        setLives((l) => l - 1);
      } else setLeft((l) => +(l - 0.1).toFixed(1));
    }, 100);
    return () => clearTimeout(id);
  }, [left, phase, picked]);

  const choose = (opt: string) => {
    if (picked) return;
    setPicked(opt);
    if (opt === q.answer) {
      const gained = 10 + Math.round(left) + streak * 5;
      setScore((s) => s + gained);
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
      setLives((l) => l - 1);
    }
  };

  const next = () => {
    if (lives <= 0 || qi + 1 >= order.length) {
      submit(score);
      setPhase("end");
      if (lives > 0) celebrate();
      return;
    }
    setQi((i) => i + 1);
    setPicked(null);
    setLeft(ROUND_SECONDS);
  };

  const opts = useMemo(() => OPTIONS, []);

  if (phase === "start")
    return (
      <StartScreen
        title="Big-O Battle ⏱️"
        rules={["Read the code and pick its time complexity.", `${ROUND_SECONDS} seconds per round — faster answers score more.`, "Streaks add bonus points. 3 wrong answers and it's over!", "Code follows your Java / C++ choice in the header."]}
        onStart={start}
      />
    );
  if (phase === "end")
    return (
      <EndScreen title={lives > 0 ? "Complexity champion! 🏆" : "Out of hearts!"} score={score} best={best} mood={lives > 0 ? "cool" : "sad"} onRestart={start}>
        <p className="text-ink-soft">Rule of thumb: count loops, watch for halving, and remember sequential blocks add while nested blocks multiply.</p>
      </EndScreen>
    );

  const correct = picked === q.answer;
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <ScoreBar score={score} best={best} lives={lives} extra={<span className="chip bg-bubble-soft text-sm">🔥 streak {streak}</span>} />
        <span className="font-mono text-sm text-muted">
          round {qi + 1}/{order.length}
        </span>
      </div>
      <TimerBar left={left} total={ROUND_SECONDS} />
      <Code code={lang === "java" ? q.java : q.cpp} title={`What's the time complexity? (${lang === "java" ? "Java" : "C++"})`} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {opts.map((o) => {
          const isAns = picked && o === q.answer;
          const isWrong = picked === o && o !== q.answer;
          return (
            <button
              key={o}
              onClick={() => choose(o)}
              disabled={!!picked}
              className={`btn py-3 font-mono text-lg disabled:opacity-100 ${isAns ? "bg-mint" : isWrong ? "bg-cherry" : "bg-white"}`}
            >
              {o}
            </button>
          );
        })}
      </div>
      {picked && (
        <div className="flex flex-col gap-3">
          <MascotSays mood={correct ? "happy" : "sad"}>
            {picked === "⏰" ? "Time's up! " : correct ? "Correct! " : `Nope — it's ${q.answer}. `}
            {q.why}
          </MascotSays>
          <button className="btn self-end bg-sun" onClick={next} autoFocus>
            {lives <= 0 || qi + 1 >= order.length ? "See results" : "Next →"}
          </button>
        </div>
      )}
    </div>
  );
}
