import type { CellTone, Problem } from "../types";
import { rand } from "../tracer";

const OPEN = "([{";
const PAIR: Record<string, string> = { ")": "(", "]": "[", "}": "{" };

export const validParentheses: Problem = {
  slug: "valid-parentheses",
  title: "Valid Parentheses",
  emoji: "🥞",
  topic: "stack-queue",
  level: "Easy",
  statement: "Given a string of ()[]{} characters, decide if every bracket is closed by the same type in the right order.",
  fields: [{ key: "s", label: "s", kind: "text" }],
  defaults: { s: "{[()()]}([])" },
  validate: (i) =>
    /^[()[\]{}]+$/.test(i.s) ? (i.s.length > 40 ? "Keep it ≤ 40 chars for the animation" : null) : "Use only ( ) [ ] { }",
  gen: (n) => {
    // deeply nested → the pair-removal brute force needs many passes
    const half = Math.floor(n / 2);
    const opens = Array.from({ length: half }, () => OPEN[rand(0, 2)]);
    const close = opens
      .slice()
      .reverse()
      .map((c) => ({ "(": ")", "[": "]", "{": "}" })[c]!);
    return { s: opens.join("") + close.join("") };
  },
  sizes: [8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096],
  takeaway:
    "Removing \"()\" pairs over and over works but re-scans the string many times (O(n²) for deep nesting). A stack remembers the most recent unmatched opener, so one pass is enough → O(n).",
  approaches: [
    {
      id: "replace",
      name: "Keep deleting matched pairs",
      badge: "Brute Force",
      time: "O(n²)",
      space: "O(n)",
      idea: "While the string contains (), [] or {}, delete them. Valid if it ends empty.",
      java: `boolean isValid(String s) {
    while (true) {                                        //@pass
        String t = s.replace("()", "").replace("[]", "").replace("{}", ""); //@remove
        if (t.equals(s)) break;                           //@stuck
        s = t;
    }
    return s.isEmpty();                                   //@result
}`,
      cpp: `bool isValid(string s) {
    while (true) {                                        //@pass
        size_t before = s.size();
        for (string p : {"()", "[]", "{}"}) {             //@remove
            size_t pos;
            while ((pos = s.find(p)) != string::npos) s.erase(pos, 2);
        }
        if (s.size() == before) break;                    //@stuck
    }
    return s.empty();                                     //@result
}`,
      run: ({ s }, t) => {
        let cur = s as string;
        let pass = 0;
        for (;;) {
          pass++;
          let next = "";
          let i = 0;
          const removed: number[] = [];
          while (i < cur.length) {
            t.op();
            if (i + 1 < cur.length && PAIR[cur[i + 1]] === cur[i]) {
              removed.push(i, i + 1);
              i += 2;
            } else {
              next += cur[i];
              i++;
            }
          }
          const c = cur,
            p = pass,
            r = removed;
          t.snap(() => ({
            step: r.length ? "remove" : "stuck",
            msg: r.length
              ? `Pass ${p}: scanned all ${c.length} chars and removed ${r.length / 2} adjacent pair(s).`
              : `Pass ${p}: nothing left to remove.`,
            mood: r.length ? "think" : next.length ? "sad" : "happy",
            arrays: [{ values: [...c], tones: Object.fromEntries(r.map((x) => [x, "warn" as CellTone])) }],
            vars: { pass: p, length: c.length },
          }));
          if (next === cur) break;
          cur = next;
          if (!cur.length) break;
        }
        const ok = cur.length === 0;
        t.snap(() => ({
          step: "result",
          msg: ok ? `Empty after ${pass} passes → valid ✔` : `Stuck with "${cur}" → invalid ✗`,
          mood: ok ? "happy" : "sad",
          arrays: [{ values: cur.length ? [...cur] : ["∅"] }],
        }));
        return String(ok);
      },
    },
    {
      id: "stack",
      name: "Stack of open brackets",
      badge: "Optimal",
      time: "O(n)",
      space: "O(n)",
      idea: "Push openers. A closer must match the top of the stack.",
      java: `boolean isValid(String s) {
    Deque<Character> st = new ArrayDeque<>();
    Map<Character, Character> pair = Map.of(')', '(', ']', '[', '}', '{');
    for (char c : s.toCharArray()) {                 //@loop
        if (c == '(' || c == '[' || c == '{')
            st.push(c);                              //@push
        else if (st.isEmpty() || st.pop() != pair.get(c))
            return false;                            //@bad
        //@pop
    }
    return st.isEmpty();                             //@result
}`,
      cpp: `bool isValid(string s) {
    stack<char> st;
    unordered_map<char, char> pair = {{')','('}, {']','['}, {'}','{'}};
    for (char c : s) {                               //@loop
        if (c == '(' || c == '[' || c == '{')
            st.push(c);                              //@push
        else {
            if (st.empty() || st.top() != pair[c])
                return false;                        //@bad
            st.pop();                                //@pop
        }
    }
    return st.empty();                               //@result
}`,
      run: ({ s }, t) => {
        const a = [...(s as string)];
        const st: string[] = [];
        for (let i = 0; i < a.length; i++) {
          const c = a[i];
          t.op();
          if (OPEN.includes(c)) {
            st.push(c);
            t.snap(() => ({
              step: "push",
              msg: `'${c}' opens something → push it on the stack.`,
              mood: "happy",
              arrays: [{ values: a, tones: { [i]: "active" }, pointers: { i } }],
              stacks: [{ title: "stack", kind: "stack", items: [...st], highlight: st.length - 1 }],
            }));
          } else {
            const top = st[st.length - 1];
            if (top !== PAIR[c]) {
              t.snap(() => ({
                step: "bad",
                msg: top ? `'${c}' should close '${PAIR[c]}' but the top is '${top}' ✗` : `'${c}' has nothing to close ✗`,
                mood: "sad",
                arrays: [{ values: a, tones: { [i]: "warn" }, pointers: { i } }],
                stacks: [{ title: "stack", kind: "stack", items: [...st], highlight: st.length - 1 }],
              }));
              return "false";
            }
            st.pop();
            t.snap(() => ({
              step: "pop",
              msg: `'${c}' matches top '${top}' → pop!`,
              mood: "happy",
              arrays: [{ values: a, tones: { [i]: "found" }, pointers: { i } }],
              stacks: [{ title: "stack", kind: "stack", items: [...st] }],
            }));
          }
        }
        const ok = st.length === 0;
        t.snap(() => ({
          step: "result",
          msg: ok ? "Stack is empty → everything matched ✔" : `Leftover openers ${st.join("")} → invalid ✗`,
          mood: ok ? "cool" : "sad",
          arrays: [{ values: a }],
          stacks: [{ title: "stack", kind: "stack", items: [...st] }],
        }));
        return String(ok);
      },
    },
  ],
};

export const nextGreater: Problem = {
  slug: "next-greater",
  title: "Next Greater Element",
  emoji: "📈",
  topic: "stack-queue",
  level: "Medium",
  statement: "For each element, find the first element to its right that is larger (or −1).",
  fields: [{ key: "nums", label: "nums", kind: "nums" }],
  defaults: { nums: "4, 2, 1, 5, 3, 2, 6, 1" },
  gen: (n) => ({ nums: Array.from({ length: n }, (_, i) => n - i + rand(0, 1)) }),
  sizes: [8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096],
  takeaway:
    "Brute force scans right from every element (O(n²) on decreasing data). The monotonic stack holds elements still waiting for an answer; a bigger newcomer answers all of them at once. Every index is pushed and popped once → O(n).",
  approaches: [
    {
      id: "brute",
      name: "Scan to the right",
      badge: "Brute Force",
      time: "O(n²)",
      space: "O(1)",
      idea: "For each i, walk j = i+1… until a[j] > a[i].",
      java: `int[] nextGreater(int[] a) {
    int[] res = new int[a.length];
    for (int i = 0; i < a.length; i++) {          //@outer
        res[i] = -1;
        for (int j = i + 1; j < a.length; j++)    //@inner
            if (a[j] > a[i]) { res[i] = a[j]; break; } //@found
    }
    return res;
}`,
      cpp: `vector<int> nextGreater(vector<int>& a) {
    vector<int> res(a.size(), -1);
    for (int i = 0; i < (int)a.size(); i++) {         //@outer
        for (int j = i + 1; j < (int)a.size(); j++)   //@inner
            if (a[j] > a[i]) { res[i] = a[j]; break; } //@found
    }
    return res;
}`,
      run: ({ nums: a }, t) => {
        const res = a.map(() => "?" as number | string);
        for (let i = 0; i < a.length; i++) {
          res[i] = -1;
          for (let j = i + 1; j < a.length; j++) {
            t.op();
            const hit = a[j] > a[i];
            if (hit) res[i] = a[j];
            const r = [...res];
            t.snap(() => ({
              step: hit ? "found" : "inner",
              msg: hit ? `${a[j]} > ${a[i]} → answer for index ${i} is ${a[j]}` : `${a[j]} isn't bigger than ${a[i]}…`,
              mood: hit ? "happy" : "think",
              arrays: [
                { label: "nums", values: a, tones: { [i]: "active", [j]: hit ? "found" : "compare" }, pointers: { i, j } },
                { label: "answer", values: r },
              ],
            }));
            if (hit) break;
          }
        }
        return `[${res.join(", ")}]`;
      },
    },
    {
      id: "mono",
      name: "Monotonic stack",
      badge: "Optimal",
      time: "O(n)",
      space: "O(n)",
      idea: "Stack keeps indexes in decreasing value order; a bigger value pops and answers them.",
      java: `int[] nextGreater(int[] a) {
    int[] res = new int[a.length];
    Arrays.fill(res, -1);
    Deque<Integer> st = new ArrayDeque<>();        // indexes waiting
    for (int i = 0; i < a.length; i++) {           //@loop
        while (!st.isEmpty() && a[i] > a[st.peek()])
            res[st.pop()] = a[i];                  //@pop
        st.push(i);                                //@push
    }
    return res;
}`,
      cpp: `vector<int> nextGreater(vector<int>& a) {
    vector<int> res(a.size(), -1);
    stack<int> st;                                 // indexes waiting
    for (int i = 0; i < (int)a.size(); i++) {      //@loop
        while (!st.empty() && a[i] > a[st.top()]) {
            res[st.top()] = a[i]; st.pop();        //@pop
        }
        st.push(i);                                //@push
    }
    return res;
}`,
      run: ({ nums: a }, t) => {
        const res: (number | string)[] = a.map(() => -1);
        const st: number[] = [];
        for (let i = 0; i < a.length; i++) {
          t.op();
          while (st.length && a[i] > a[st[st.length - 1]]) {
            t.op();
            const top = st.pop()!;
            res[top] = a[i];
            const r = [...res],
              s = [...st];
            t.snap(() => ({
              step: "pop",
              msg: `${a[i]} beats ${a[top]} (index ${top}) → pop it, its answer is ${a[i]}.`,
              mood: "wow",
              arrays: [
                { label: "nums", values: a, tones: { [i]: "active", [top]: "found" }, pointers: { i } },
                { label: "answer", values: r, tones: { [top]: "found" } },
              ],
              stacks: [{ title: "stack (index:value)", kind: "stack", items: s.map((x) => `${x}:${a[x]}`) }],
            }));
          }
          st.push(i);
          const r = [...res],
            s = [...st];
          t.snap(() => ({
            step: "push",
            msg: `Push index ${i} (${a[i]}) — it's waiting for something bigger.`,
            mood: "think",
            arrays: [
              { label: "nums", values: a, tones: { [i]: "active" }, pointers: { i } },
              { label: "answer", values: r },
            ],
            stacks: [{ title: "stack (index:value)", kind: "stack", items: s.map((x) => `${x}:${a[x]}`), highlight: s.length - 1 }],
          }));
        }
        return `[${res.join(", ")}]`;
      },
    },
  ],
};

