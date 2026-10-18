// Tiny line-based highlighter for Java / C++ snippets.

const KEYWORDS = new Set(
  (
    "abstract auto bool boolean break case catch char class const constexpr continue default delete do double else enum " +
    "explicit extends false final finally float for friend if implements import include inline int interface long namespace " +
    "new nullptr null operator override package private protected public return short signed sizeof static struct super " +
    "switch template this throw throws true try typedef typename unsigned using var virtual void volatile while yield"
  ).split(" "),
);

const TYPES = new Set(
  (
    "String Integer Long Character Boolean Double List ArrayList LinkedList Map HashMap TreeMap Set HashSet TreeSet " +
    "Deque ArrayDeque Queue PriorityQueue Stack Arrays Collections Comparator Math Object Iterator StringBuilder " +
    "ListNode TreeNode Node Trie UnionFind System vector string unordered_map unordered_set map set pair stack queue " +
    "deque priority_queue greater less size_t std cout cin endl array tuple optional function shared_ptr unique_ptr"
  ).split(" "),
);

export type Token = { t: string; c?: string };

export function highlightLines(code: string): Token[][] {
  const lines = code.split("\n");
  let inBlock = false;
  return lines.map((line) => {
    const out: Token[] = [];
    let i = 0;
    const push = (t: string, c?: string) => {
      if (!t) return;
      const last = out[out.length - 1];
      if (last && last.c === c) last.t += t;
      else out.push({ t, c });
    };
    while (i < line.length) {
      if (inBlock) {
        const end = line.indexOf("*/", i);
        if (end === -1) {
          push(line.slice(i), "tok-com");
          i = line.length;
        } else {
          push(line.slice(i, end + 2), "tok-com");
          i = end + 2;
          inBlock = false;
        }
        continue;
      }
      const rest = line.slice(i);
      if (rest.startsWith("//")) {
        push(rest, "tok-com");
        break;
      }
      if (rest.startsWith("/*")) {
        inBlock = true;
        continue;
      }
      if (rest.startsWith("#")) {
        const m = rest.match(/^#\w+/);
        if (m) {
          push(m[0], "tok-pre");
          i += m[0].length;
          continue;
        }
      }
      const ch = line[i];
      if (ch === '"' || ch === "'") {
        let j = i + 1;
        while (j < line.length && line[j] !== ch) {
          if (line[j] === "\\") j++;
          j++;
        }
        push(line.slice(i, j + 1), "tok-str");
        i = j + 1;
        continue;
      }
      if (/[0-9]/.test(ch) && !/[\w]/.test(line[i - 1] || "")) {
        const m = rest.match(/^[0-9][0-9_]*(\.[0-9]+)?[LlfF]?/);
        if (m) {
          push(m[0], "tok-num");
          i += m[0].length;
          continue;
        }
      }
      if (/[A-Za-z_]/.test(ch)) {
        const m = rest.match(/^[A-Za-z_]\w*/)!;
        const w = m[0];
        const after = line.slice(i + w.length);
        if (KEYWORDS.has(w)) push(w, "tok-kw");
        else if (TYPES.has(w)) push(w, "tok-type");
        else if (/^\s*\(/.test(after)) push(w, "tok-fn");
        else push(w);
        i += w.length;
        continue;
      }
      push(ch);
      i++;
    }
    return out;
  });
}

/** Strips `//@step` markers from code and returns clean code + step → line index map. */
export function parseSteps(code: string): { code: string; steps: Record<string, number[]> } {
  const steps: Record<string, number[]> = {};
  const lines = code.replace(/^\n+|\s+$/g, "").split("\n").map((line, idx) => {
    const m = line.match(/\s*\/\/@([\w,-]+)\s*$/);
    if (!m) return line;
    for (const s of m[1].split(",")) (steps[s] ||= []).push(idx);
    return line.slice(0, m.index);
  });
  return { code: lines.join("\n"), steps };
}
