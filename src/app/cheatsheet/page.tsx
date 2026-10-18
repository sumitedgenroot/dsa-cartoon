import type { Metadata } from "next";
import { Callout, PageHeader, SectionTitle } from "@/components/ui";
import { DualCode } from "@/components/CodeBlock";

export const metadata: Metadata = { title: "Cheatsheet" };

const COLLECTIONS = [
  { what: "Dynamic array", java: "ArrayList<Integer>", cpp: "vector<int>", ops: "add / get / set  ↔  push_back / [] " },
  { what: "Hash map", java: "HashMap<K, V>", cpp: "unordered_map<K, V>", ops: "put, get, getOrDefault, containsKey  ↔  [], find, count" },
  { what: "Hash set", java: "HashSet<T>", cpp: "unordered_set<T>", ops: "add, contains, remove  ↔  insert, count, erase" },
  { what: "Sorted map", java: "TreeMap<K, V>", cpp: "map<K, V>", ops: "floorKey / ceilingKey  ↔  lower_bound / upper_bound" },
  { what: "Sorted set", java: "TreeSet<T>", cpp: "set<T>", ops: "first, last, floor, ceiling  ↔  begin, rbegin, lower_bound" },
  { what: "Stack", java: "ArrayDeque<T> (push/pop/peek)", cpp: "stack<T> (push/pop/top)", ops: "C++ pop() returns void!" },
  { what: "Queue", java: "ArrayDeque<T> (offer/poll/peek)", cpp: "queue<T> (push/pop/front)", ops: "" },
  { what: "Deque", java: "ArrayDeque<T>", cpp: "deque<T>", ops: "offerFirst/Last  ↔  push_front/back" },
  { what: "Min-heap", java: "PriorityQueue<T>", cpp: "priority_queue<T, vector<T>, greater<T>>", ops: "Java default MIN, C++ default MAX" },
  { what: "Max-heap", java: "new PriorityQueue<>(Collections.reverseOrder())", cpp: "priority_queue<T>", ops: "" },
  { what: "Pair", java: "int[]{a, b} or record", cpp: "pair<int,int> / tuple", ops: "" },
  { what: "String builder", java: "StringBuilder", cpp: "string (mutable)", ops: "append / insert / reverse" },
];

const DS_OPS = [
  { ds: "Array", access: "O(1)", search: "O(n)", insert: "O(n)", del: "O(n)" },
  { ds: "Dynamic array (end)", access: "O(1)", search: "O(n)", insert: "O(1)*", del: "O(1)" },
  { ds: "Linked list", access: "O(n)", search: "O(n)", insert: "O(1)†", del: "O(1)†" },
  { ds: "Stack / Queue", access: "top O(1)", search: "O(n)", insert: "O(1)", del: "O(1)" },
  { ds: "Hash map / set", access: "—", search: "O(1) avg", insert: "O(1) avg", del: "O(1) avg" },
  { ds: "Balanced BST (TreeMap / map)", access: "O(log n)", search: "O(log n)", insert: "O(log n)", del: "O(log n)" },
  { ds: "Binary heap", access: "min O(1)", search: "O(n)", insert: "O(log n)", del: "O(log n)" },
  { ds: "Trie", access: "—", search: "O(L)", insert: "O(L)", del: "O(L)" },
  { ds: "Union-Find", access: "—", search: "≈O(1)", insert: "≈O(1)", del: "—" },
];

const SORTS = [
  { name: "Bubble", best: "O(n)", avg: "O(n²)", worst: "O(n²)", space: "O(1)", stable: "✅" },
  { name: "Selection", best: "O(n²)", avg: "O(n²)", worst: "O(n²)", space: "O(1)", stable: "❌" },
  { name: "Insertion", best: "O(n)", avg: "O(n²)", worst: "O(n²)", space: "O(1)", stable: "✅" },
  { name: "Merge", best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(n)", stable: "✅" },
  { name: "Quick", best: "O(n log n)", avg: "O(n log n)", worst: "O(n²)", space: "O(log n)", stable: "❌" },
  { name: "Heap", best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(1)", stable: "❌" },
  { name: "Counting", best: "O(n + k)", avg: "O(n + k)", worst: "O(n + k)", space: "O(k)", stable: "✅" },
];

const CURVES: { label: string; f: (x: number) => number; color: string }[] = [
  { label: "O(1)", f: () => 1, color: "#2f9e5b" },
  { label: "O(log n)", f: (x) => Math.log2(x), color: "#3aa76d" },
  { label: "O(n)", f: (x) => x, color: "#d9a400" },
  { label: "O(n log n)", f: (x) => x * Math.log2(x), color: "#f08a24" },
  { label: "O(n²)", f: (x) => x * x, color: "#e8505b" },
  { label: "O(2ⁿ)", f: (x) => 2 ** x, color: "#b5179e" },
];

function GrowthChart() {
  const W = 620,
    H = 300,
    L = 40,
    B = 30,
    maxX = 16,
    maxY = 64;
  const xs = (x: number) => L + (x / maxX) * (W - L - 110);
  const ys = (y: number) => H - B - (Math.min(y, maxY) / maxY) * (H - B - 12);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Growth of common complexities">
      <path d={`M ${L} 8 L ${L} ${H - B} L ${W - 100} ${H - B}`} stroke="#1f1d2b" strokeWidth="2.5" fill="none" />
      <text x={(W - 60) / 2} y={H - 6} textAnchor="middle" className="text-[12px] font-semibold" fill="#1f1d2b">
        n →
      </text>
      <text x={14} y={H / 2} textAnchor="middle" transform={`rotate(-90 14 ${H / 2})`} className="text-[12px] font-semibold" fill="#1f1d2b">
        work →
      </text>
      {CURVES.map((c) => {
        const pts: string[] = [];
        let last: [number, number] = [0, 0];
        for (let x = 1; x <= maxX; x += 0.1) {
          const y = c.f(x);
          if (y > maxY) break;
          last = [xs(x), ys(y)];
          pts.push(`${pts.length ? "L" : "M"} ${last[0].toFixed(1)} ${last[1].toFixed(1)}`);
        }
        return (
          <g key={c.label}>
            <path d={pts.join(" ")} stroke={c.color} strokeWidth="4" fill="none" strokeLinecap="round" />
            <text x={Math.min(last[0] + 6, W - 96)} y={Math.max(last[1] + 4, 16)} className="font-mono text-[12px] font-bold" fill={c.color}>
              {c.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

const SNIPPETS = [
  {
    title: "Fast input / output",
    java: `import java.util.*;
import java.io.*;

BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
StringTokenizer st = new StringTokenizer(br.readLine());
int n = Integer.parseInt(st.nextToken());
StringBuilder out = new StringBuilder();
out.append(n).append('\\n');
System.out.print(out);`,
    cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n; cin >> n;
    cout << n << '\\n';   // '\\n' is faster than endl
}`,
  },
  {
    title: "Arrays, sorting & binary search helpers",
    java: `int[] a = {5, 2, 9};
Arrays.sort(a);                              // ascending
int idx = Arrays.binarySearch(a, 9);         // index or negative
int[][] grid = new int[3][4];
Arrays.fill(a, -1);
int[] copy = Arrays.copyOf(a, a.length);
List<Integer> list = new ArrayList<>(List.of(3, 1, 2));
Collections.sort(list, Collections.reverseOrder());
int mx = Collections.max(list);`,
    cpp: `vector<int> a = {5, 2, 9};
sort(a.begin(), a.end());                    // ascending
bool has = binary_search(a.begin(), a.end(), 9);
auto it = lower_bound(a.begin(), a.end(), 6); // first >= 6
vector<vector<int>> grid(3, vector<int>(4, 0));
fill(a.begin(), a.end(), -1);
sort(a.rbegin(), a.rend());                  // descending
int mx = *max_element(a.begin(), a.end());
int total = accumulate(a.begin(), a.end(), 0);`,
  },
  {
    title: "Strings",
    java: `String s = "hello";
char c = s.charAt(0);
String sub = s.substring(1, 3);              // "el"
char[] arr = s.toCharArray(); Arrays.sort(arr);
String sorted = new String(arr);
boolean same = s.equals("hello");            // never use ==
int[] freq = new int[26];
for (char ch : s.toCharArray()) freq[ch - 'a']++;
String rev = new StringBuilder(s).reverse().toString();`,
    cpp: `string s = "hello";
char c = s[0];
string sub = s.substr(1, 2);                 // "el" (pos, len)
string sorted = s; sort(sorted.begin(), sorted.end());
bool same = (s == "hello");                  // == works in C++
int freq[26] = {0};
for (char ch : s) freq[ch - 'a']++;
string rev(s.rbegin(), s.rend());
int num = stoi("42"); string t = to_string(42);`,
  },
  {
    title: "Maps: counting & iteration",
    java: `Map<String, Integer> cnt = new HashMap<>();
cnt.merge("a", 1, Integer::sum);             // cnt[a]++
int v = cnt.getOrDefault("z", 0);
for (Map.Entry<String, Integer> e : cnt.entrySet())
    System.out.println(e.getKey() + "=" + e.getValue());
TreeMap<Integer, String> tm = new TreeMap<>();
Integer fk = tm.floorKey(10);                // largest key <= 10 (or null)`,
    cpp: `unordered_map<string, int> cnt;
cnt["a"]++;                                  // default 0
int v = cnt.count("z") ? cnt["z"] : 0;
for (auto& [key, val] : cnt)
    cout << key << "=" << val << "\\n";
map<int, string> tm;
auto it = tm.upper_bound(10);                // first key > 10
if (it != tm.begin()) { --it; /* largest key <= 10 */ }`,
  },
];

export default function CheatsheetPage() {
  return (
    <div className="flex flex-col gap-12">
      <PageHeader
        title="📝 The fridge-door cheatsheet"
        subtitle="Java ↔ C++ collections, Big-O tables, sorting facts and syntax snippets. Print it, stick it, revise it."
        mood="happy"
        tone="mint"
      />

      <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="card min-w-0 bg-white p-5">
          <SectionTitle emoji="📈">How fast things grow</SectionTitle>
          <GrowthChart />
        </div>
        <div className="flex flex-col gap-3">
          <Callout tone="mint" icon="🟢" title="Great">
            O(1), O(log n), O(n) — handles millions easily.
          </Callout>
          <Callout tone="sun" icon="🟡" title="Fine">
            O(n log n) — the sorting barrier; usually OK up to ~10⁶.
          </Callout>
          <Callout tone="peach" icon="🟠" title="Careful">
            O(n²) — OK for n ≈ 5,000, painful beyond 10⁴.
          </Callout>
          <Callout tone="cherry" icon="🔴" title="Only for tiny n">
            O(2ⁿ), O(n!) — n ≤ 20 / n ≤ 10. Usually a hint to use DP or pruning.
          </Callout>
        </div>
      </section>

      <section>
        <SectionTitle emoji="☕⚡">Java ↔ C++ collections</SectionTitle>
        <div className="card overflow-x-auto bg-white">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="border-b-[2.5px] border-ink bg-sun-soft text-left">
              <tr>
                <th className="px-4 py-3">What</th>
                <th className="px-4 py-3">☕ Java</th>
                <th className="px-4 py-3">⚡ C++ STL</th>
                <th className="px-4 py-3">Notes</th>
              </tr>
            </thead>
            <tbody>
              {COLLECTIONS.map((c) => (
                <tr key={c.what} className="border-t-2 border-line">
                  <td className="px-4 py-2.5 font-bold">{c.what}</td>
                  <td className="px-4 py-2.5 font-mono text-[13px]">{c.java}</td>
                  <td className="px-4 py-2.5 font-mono text-[13px]">{c.cpp}</td>
                  <td className="px-4 py-2.5 text-ink-soft">{c.ops}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="min-w-0">
          <SectionTitle emoji="🧰">Data structure operations</SectionTitle>
          <div className="card overflow-x-auto bg-white">
            <table className="w-full min-w-[520px] text-sm">
              <thead className="border-b-[2.5px] border-ink bg-sky-soft text-left">
                <tr>
                  <th className="px-3 py-2">Structure</th>
                  <th className="px-3 py-2">Access</th>
                  <th className="px-3 py-2">Search</th>
                  <th className="px-3 py-2">Insert</th>
                  <th className="px-3 py-2">Delete</th>
                </tr>
              </thead>
              <tbody className="font-mono text-[13px]">
                {DS_OPS.map((d) => (
                  <tr key={d.ds} className="border-t-2 border-line">
                    <td className="px-3 py-2 font-display font-semibold">{d.ds}</td>
                    <td className="px-3 py-2">{d.access}</td>
                    <td className="px-3 py-2">{d.search}</td>
                    <td className="px-3 py-2">{d.insert}</td>
                    <td className="px-3 py-2">{d.del}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="px-3 pb-2 text-xs text-muted">* amortized · † when you already hold the node</p>
          </div>
        </div>
        <div className="min-w-0">
          <SectionTitle emoji="📶">Sorting algorithms</SectionTitle>
          <div className="card overflow-x-auto bg-white">
            <table className="w-full min-w-[520px] text-sm">
              <thead className="border-b-[2.5px] border-ink bg-grape-soft text-left">
                <tr>
                  <th className="px-3 py-2">Sort</th>
                  <th className="px-3 py-2">Best</th>
                  <th className="px-3 py-2">Avg</th>
                  <th className="px-3 py-2">Worst</th>
                  <th className="px-3 py-2">Space</th>
                  <th className="px-3 py-2">Stable</th>
                </tr>
              </thead>
              <tbody className="font-mono text-[13px]">
                {SORTS.map((s) => (
                  <tr key={s.name} className="border-t-2 border-line">
                    <td className="px-3 py-2 font-display font-semibold">{s.name}</td>
                    <td className="px-3 py-2">{s.best}</td>
                    <td className="px-3 py-2">{s.avg}</td>
                    <td className="px-3 py-2">{s.worst}</td>
                    <td className="px-3 py-2">{s.space}</td>
                    <td className="px-3 py-2">{s.stable}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section>
        <SectionTitle emoji="⌨️">Syntax you&apos;ll type 100 times</SectionTitle>
        <div className="grid gap-6 lg:grid-cols-2">
          {SNIPPETS.map((s) => (
            <div key={s.title} className="flex min-w-0 flex-col gap-2">
              <h3 className="text-lg font-bold">{s.title}</h3>
              <DualCode java={s.java} cpp={s.cpp} title={s.title} />
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Callout tone="cherry" icon="🐛" title="Classic bugs">
          <ul className="flex flex-col gap-1">
            <li>• int overflow: sums and products of big values → use long / long long.</li>
            <li>• mid = (lo + hi) / 2 can overflow → lo + (hi − lo) / 2.</li>
            <li>• Java: compare Integer objects / Strings with .equals().</li>
            <li>• C++: priority_queue is a MAX-heap by default.</li>
            <li>• C++: mp[key] inserts a default entry when the key is missing.</li>
          </ul>
        </Callout>
        <Callout tone="sky" icon="🗓️" title="6-week plan">
          <ul className="flex flex-col gap-1">
            <li>• Week 1–2: arrays, two pointers, sliding window, hashing, binary search (~40 problems).</li>
            <li>• Week 3–4: linked list, stack, trees, BFS/DFS, backtracking (~40).</li>
            <li>• Week 5: DP, heap, advanced graphs (~30).</li>
            <li>• Week 6: mock interviews + redo the ones you got wrong.</li>
            <li>• 3–5 problems a day. Quality &gt; quantity.</li>
          </ul>
        </Callout>
      </section>
    </div>
  );
}
