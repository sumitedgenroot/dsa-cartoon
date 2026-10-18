import type { CellTone, Problem } from "../types";
import { rand } from "../tracer";

const DIRS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

export const islands: Problem = {
  slug: "islands",
  title: "Number of Islands",
  emoji: "🏝️",
  topic: "graphs",
  level: "Medium",
  statement: "Count the islands in a grid of 1s (land) and 0s (water). Land connects up/down/left/right.",
  fields: [{ key: "grid", label: "grid (rows of 0/1)", kind: "grid" }],
  defaults: { grid: "11000\n11010\n00100\n00011\n10011" },
  validate: (i) => (!i.grid.length ? "Grid is empty" : i.grid.length * i.grid[0].length > 100 ? "Keep the grid ≤ 100 cells" : null),
  gen: (n) => {
    const side = Math.max(2, Math.round(Math.sqrt(n)));
    return { grid: Array.from({ length: side }, () => Array.from({ length: side }, () => (Math.random() < 0.45 ? 1 : 0))) };
  },
  sizes: [16, 64, 256, 1024, 4096, 16384, 65536],
  sizeLabel: "cells",
  takeaway:
    "Every island is a connected component of a graph whose nodes are land cells. Start a DFS (stack/recursion) or BFS (queue) from each unvisited land cell and \"sink\" everything reachable. Both visit each cell a constant number of times → O(rows × cols). BFS also gives shortest distances; DFS is shorter to write.",
  approaches: [
    {
      id: "dfs",
      name: "DFS (sink the island)",
      badge: "Classic",
      time: "O(R·C)",
      space: "O(R·C)",
      idea: "On a 1, count it and recursively turn its whole island into water.",
      java: `int numIslands(char[][] g) {
    int count = 0;
    for (int r = 0; r < g.length; r++)
        for (int c = 0; c < g[0].length; c++)
            if (g[r][c] == '1') {             //@scan
                count++;                      //@count
                sink(g, r, c);
            }
    return count;
}
void sink(char[][] g, int r, int c) {
    if (r < 0 || c < 0 || r >= g.length || c >= g[0].length || g[r][c] == '0') return;
    g[r][c] = '0';                            //@visit
    sink(g, r + 1, c); sink(g, r - 1, c);
    sink(g, r, c + 1); sink(g, r, c - 1);
}`,
      cpp: `void sink(vector<vector<char>>& g, int r, int c) {
    if (r < 0 || c < 0 || r >= (int)g.size() || c >= (int)g[0].size() || g[r][c] == '0') return;
    g[r][c] = '0';                            //@visit
    sink(g, r + 1, c); sink(g, r - 1, c);
    sink(g, r, c + 1); sink(g, r, c - 1);
}
int numIslands(vector<vector<char>>& g) {
    int count = 0;
    for (int r = 0; r < (int)g.size(); r++)
        for (int c = 0; c < (int)g[0].size(); c++)
            if (g[r][c] == '1') {             //@scan
                count++;                      //@count
                sink(g, r, c);
            }
    return count;
}`,
      run: ({ grid }, t) => {
        const g: number[][] = grid.map((r: number[]) => [...r]);
        const R = g.length,
          C = g[0].length;
        const label: (number | null)[][] = g.map((r) => r.map(() => null));
        let count = 0;
        const stack: string[] = [];
        const view = () => ({ cells: g.map((r) => [...r]), labels: label.map((r) => [...r]) });
        // iterative DFS with an explicit stack so huge race grids don't overflow the JS call stack
        const sink = (sr: number, sc: number) => {
          const st: [number, number][] = [[sr, sc]];
          while (st.length) {
            const [r, c] = st.pop()!;
            stack.pop();
            t.op();
            if (r < 0 || c < 0 || r >= R || c >= C || g[r][c] !== 1 && g[r][c] !== 3) continue;
            g[r][c] = 4;
            label[r][c] = count;
            t.snap(() => ({
              step: "visit",
              msg: `Visit (${r}, ${c}) and sink it. Explore its 4 neighbours (go deep first).`,
              mood: "think",
              grid: view(),
              stacks: [{ title: "DFS stack", kind: "stack", items: [...stack] }],
              vars: { islands: count },
            }));
            g[r][c] = 2;
            for (const [dr, dc] of DIRS) {
              const nr = r + dr,
                nc = c + dc;
              if (nr >= 0 && nc >= 0 && nr < R && nc < C && g[nr][nc] === 1) {
                g[nr][nc] = 3;
                st.push([nr, nc]);
                stack.push(`(${nr},${nc})`);
              }
            }
          }
        };
        for (let r = 0; r < R; r++)
          for (let c = 0; c < C; c++) {
            t.op();
            if (g[r][c] === 1) {
              count++;
              const cnt = count;
              t.snap(() => ({
                step: "count",
                msg: `New land at (${r}, ${c}) → island #${cnt}! 🏝️`,
                mood: "wow",
                grid: view(),
                vars: { islands: cnt },
              }));
              stack.push(`(${r},${c})`);
              sink(r, c);
            }
          }
        t.snap(() => ({ step: "count", msg: `Scanned every cell: ${count} island(s).`, mood: "cool", grid: view(), vars: { islands: count } }));
        return String(count);
      },
    },
    {
      id: "bfs",
      name: "BFS (flood with a queue)",
      badge: "Classic",
      time: "O(R·C)",
      space: "O(min(R, C))",
      idea: "On a 1, count it and spread level by level with a queue.",
      java: `int numIslands(char[][] g) {
    int count = 0, R = g.length, C = g[0].length;
    int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
    for (int r = 0; r < R; r++)
        for (int c = 0; c < C; c++) {
            if (g[r][c] != '1') continue;     //@scan
            count++;                          //@count
            Queue<int[]> q = new ArrayDeque<>();
            q.offer(new int[]{r, c}); g[r][c] = '0';
            while (!q.isEmpty()) {
                int[] cur = q.poll();         //@visit
                for (int[] d : dirs) {
                    int nr = cur[0] + d[0], nc = cur[1] + d[1];
                    if (nr >= 0 && nc >= 0 && nr < R && nc < C && g[nr][nc] == '1') {
                        g[nr][nc] = '0';      // mark when ENQUEUED
                        q.offer(new int[]{nr, nc}); //@enqueue
                    }
                }
            }
        }
    return count;
}`,
      cpp: `int numIslands(vector<vector<char>>& g) {
    int count = 0, R = g.size(), C = g[0].size();
    int dirs[4][2] = {{1,0},{-1,0},{0,1},{0,-1}};
    for (int r = 0; r < R; r++)
        for (int c = 0; c < C; c++) {
            if (g[r][c] != '1') continue;     //@scan
            count++;                          //@count
            queue<pair<int,int>> q;
            q.push({r, c}); g[r][c] = '0';
            while (!q.empty()) {
                auto [cr, cc] = q.front(); q.pop();  //@visit
                for (auto& d : dirs) {
                    int nr = cr + d[0], nc = cc + d[1];
                    if (nr >= 0 && nc >= 0 && nr < R && nc < C && g[nr][nc] == '1') {
                        g[nr][nc] = '0';      // mark when ENQUEUED
                        q.push({nr, nc});     //@enqueue
                    }
                }
            }
        }
    return count;
}`,
      run: ({ grid }, t) => {
        const g: number[][] = grid.map((r: number[]) => [...r]);
        const R = g.length,
          C = g[0].length;
        const label: (number | null)[][] = g.map((r) => r.map(() => null));
        let count = 0;
        const view = () => ({ cells: g.map((r) => [...r]), labels: label.map((r) => [...r]) });
        for (let r = 0; r < R; r++)
          for (let c = 0; c < C; c++) {
            t.op();
            if (g[r][c] !== 1) continue;
            count++;
            const cnt = count;
            const q: [number, number, number][] = [[r, c, 0]];
            let head = 0;
            g[r][c] = 3;
            t.snap(() => ({ step: "count", msg: `New land at (${r}, ${c}) → island #${cnt}! Start a BFS ripple.`, mood: "wow", grid: view(), vars: { islands: cnt } }));
            while (head < q.length) {
              const [cr, cc, d] = q[head++];
              t.op();
              g[cr][cc] = 4;
              label[cr][cc] = d;
              t.snap(() => ({
                step: "visit",
                msg: `Dequeue (${cr}, ${cc}) — distance ${d} from where the island was found.`,
                mood: "think",
                grid: view(),
                stacks: [{ title: "BFS queue (front → back)", kind: "queue", items: q.slice(head).map(([a, b]) => `(${a},${b})`) }],
                vars: { islands: cnt },
              }));
              g[cr][cc] = 2;
              for (const [dr, dc] of DIRS) {
                const nr = cr + dr,
                  nc = cc + dc;
                if (nr >= 0 && nc >= 0 && nr < R && nc < C && g[nr][nc] === 1) {
                  g[nr][nc] = 3;
                  q.push([nr, nc, d + 1]);
                }
              }
            }
          }
        t.snap(() => ({ step: "count", msg: `Scanned every cell: ${count} island(s). Numbers show BFS distance.`, mood: "cool", grid: view(), vars: { islands: count } }));
        return String(count);
      },
    },
  ],
};

/* ---------- Linked list reversal ---------- */

export const reverseList: Problem = {
  slug: "reverse-list",
  title: "Reverse a Linked List",
  emoji: "🔁",
  topic: "linked-list",
  level: "Easy",
  statement: "Reverse a singly linked list and return the new head.",
  fields: [{ key: "nums", label: "list values", kind: "nums" }],
  defaults: { nums: "1, 2, 3, 4, 5" },
  validate: (i) => (i.nums.length > 12 ? "Keep it ≤ 12 nodes for the animation" : !i.nums.length ? "Need at least 1 node" : null),
  gen: (n) => ({ nums: Array.from({ length: n }, () => rand(1, 99)) }),
  sizes: [8, 32, 128, 512, 2048, 8192, 32768],
  takeaway:
    "Both versions flip each arrow exactly once → O(n) time. The iterative version uses three pointers and O(1) space; the recursive one is elegant but uses O(n) call-stack space (and can overflow on huge lists).",
  approaches: [
    {
      id: "iterative",
      name: "Iterative (prev / curr / next)",
      badge: "Optimal",
      time: "O(n)",
      space: "O(1)",
      idea: "Walk the list, saving next before flipping curr.next to prev.",
      java: `ListNode reverse(ListNode head) {
    ListNode prev = null, curr = head;
    while (curr != null) {           //@loop
        ListNode next = curr.next;   //@save
        curr.next = prev;            //@flip
        prev = curr;                 //@move
        curr = next;
    }
    return prev;                     //@result
}`,
      cpp: `ListNode* reverse(ListNode* head) {
    ListNode *prev = nullptr, *curr = head;
    while (curr) {                   //@loop
        ListNode* next = curr->next; //@save
        curr->next = prev;           //@flip
        prev = curr;                 //@move
        curr = next;
    }
    return prev;                     //@result
}`,
      run: ({ nums }, t) => {
        const n = nums.length;
        const next: (number | null)[] = nums.map((_: number, i: number) => (i + 1 < n ? i + 1 : null));
        let prev: number | null = null,
          curr: number | null = 0;
        const view = (extra: Record<string, number | null>, tones: Record<number, CellTone> = {}) => ({
          values: nums,
          next: [...next],
          pointers: { prev, curr, ...extra },
          tones,
        });
        t.snap(() => ({ step: "loop", msg: "Start: prev = null, curr = head.", list: view({}) }));
        while (curr !== null) {
          t.op();
          const nx: number | null = next[curr];
          t.snap(() => ({ step: "save", msg: `Save next = ${nx === null ? "null" : nums[nx]} so we don't lose the rest of the list.`, mood: "think", list: view({ next: nx }, { [curr!]: "active" }) }));
          next[curr] = prev;
          t.snap(() => ({ step: "flip", msg: `Flip! ${nums[curr!]}.next now points back to ${prev === null ? "null" : nums[prev]}.`, mood: "wow", list: view({ next: nx }, { [curr!]: "found" }) }));
          prev = curr;
          curr = nx;
          t.snap(() => ({ step: "move", msg: "Move prev and curr one step forward.", list: view({}) }));
        }
        t.snap(() => ({ step: "result", msg: `curr is null → prev (${nums[prev!]}) is the new head 🎉`, mood: "cool", list: view({}, { [prev!]: "found" }) }));
        const out: number[] = [];
        for (let p: number | null = prev; p !== null; p = next[p]) out.push(nums[p]);
        return out.join(" → ");
      },
    },
    {
      id: "recursive",
      name: "Recursive",
      badge: "Recursion",
      time: "O(n)",
      space: "O(n)",
      idea: "Reverse the rest, then make the next node point back to me.",
      java: `ListNode reverse(ListNode head) {
    if (head == null || head.next == null) return head; //@base
    ListNode newHead = reverse(head.next);              //@call
    head.next.next = head;                              //@flip
    head.next = null;
    return newHead;
}`,
      cpp: `ListNode* reverse(ListNode* head) {
    if (!head || !head->next) return head;              //@base
    ListNode* newHead = reverse(head->next);            //@call
    head->next->next = head;                            //@flip
    head->next = nullptr;
    return newHead;
}`,
      run: ({ nums }, t) => {
        const n = nums.length;
        const next: (number | null)[] = nums.map((_: number, i: number) => (i + 1 < n ? i + 1 : null));
        const stack: string[] = [];
        const rec = (h: number | null): number | null => {
          t.op();
          if (h === null || next[h] === null) {
            t.snap(() => ({
              step: "base",
              msg: `Last node ${h === null ? "null" : nums[h]} — it becomes the new head.`,
              mood: "happy",
              list: { values: nums, next: [...next], pointers: { head: h }, tones: h === null ? {} : { [h]: "found" } },
              stacks: [{ title: "call stack", kind: "stack", items: [...stack] }],
            }));
            return h;
          }
          stack.push(`reverse(${nums[h]})`);
          t.snap(() => ({
            step: "call",
            msg: `reverse(${nums[h]}) first reverses everything after it…`,
            mood: "think",
            list: { values: nums, next: [...next], pointers: { head: h }, tones: { [h]: "active" } },
            stacks: [{ title: "call stack", kind: "stack", items: [...stack], highlight: stack.length - 1 }],
          }));
          const nh = rec(next[h]);
          const nx = next[h]!;
          next[nx] = h;
          next[h] = null;
          t.snap(() => ({
            step: "flip",
            msg: `Back in reverse(${nums[h]}): make ${nums[nx]} point back to ${nums[h]}.`,
            mood: "wow",
            list: { values: nums, next: [...next], pointers: { head: h, newHead: nh }, tones: { [h]: "found", [nx]: "found" } },
            stacks: [{ title: "call stack", kind: "stack", items: [...stack], highlight: stack.length - 1 }],
          }));
          stack.pop();
          return nh;
        };
        const head = rec(0);
        const out: number[] = [];
        for (let p = head; p !== null; p = next[p]) out.push(nums[p]);
        return out.join(" → ");
      },
    },
  ],
};

/* ---------- Tree traversals ---------- */

const ORDER_INFO: Record<string, string> = {
  inorder: "Left → Root → Right",
  preorder: "Root → Left → Right",
  postorder: "Left → Right → Root",
};

function dfsTraversal(kind: "inorder" | "preorder" | "postorder") {
  return ({ tree }: { tree: (number | null)[] }, t: import("../tracer").Tracer) => {
    const out: (number | string)[] = [];
    const tones: Record<number, CellTone> = {};
    const stack: string[] = [];
    const snap = (i: number, msg: string, step: string) =>
      t.snap(() => ({
        step,
        msg,
        mood: step === "visit" ? "happy" : "think",
        tree: { title: ORDER_INFO[kind], values: tree, tones: { ...tones, [i]: step === "visit" ? "found" : "active" }, output: [...out] },
        stacks: [{ title: "call stack", kind: "stack", items: [...stack], highlight: stack.length - 1 }],
      }));
    const rec = (i: number) => {
      if (i >= tree.length || tree[i] === null) return;
      t.op();
      stack.push(String(tree[i]));
      const visit = () => {
        out.push(tree[i]!);
        tones[i] = "done";
        snap(i, `Visit ${tree[i]} → output it.`, "visit");
      };
      if (kind === "preorder") visit();
      else snap(i, `At ${tree[i]}: go LEFT first.`, "left");
      rec(2 * i + 1);
      if (kind === "inorder") visit();
      else if (kind === "postorder") snap(i, `Back at ${tree[i]}: now go RIGHT.`, "right");
      rec(2 * i + 2);
      if (kind === "postorder") visit();
      stack.pop();
    };
    rec(0);
    return `[${out.join(", ")}]`;
  };
}

const travCode = (kind: string, a: string, b: string, c: string, lang: "java" | "cpp") =>
  lang === "java"
    ? `void ${kind}(TreeNode node, List<Integer> out) {
    if (node == null) return;
${[a, b, c]
  .map((s) =>
    s === "root"
      ? "    out.add(node.val);                 //@visit"
      : s === "left"
        ? `    ${kind}(node.left, out);           //@left`
        : `    ${kind}(node.right, out);          //@right`,
  )
  .join("\n")}
}`
    : `void ${kind}(TreeNode* node, vector<int>& out) {
    if (!node) return;
${[a, b, c]
  .map((s) =>
    s === "root"
      ? "    out.push_back(node->val);          //@visit"
      : s === "left"
        ? `    ${kind}(node->left, out);          //@left`
        : `    ${kind}(node->right, out);         //@right`,
  )
  .join("\n")}
}`;

export const treeTraversal: Problem = {
  slug: "tree-traversal",
  title: "Binary Tree Traversals",
  emoji: "🌳",
  topic: "trees",
  level: "Easy",
  statement: "Visit every node of the tree. The order you visit in changes everything.",
  fields: [{ key: "tree", label: "tree (level order, use null)", kind: "nums", hint: "e.g. 4, 2, 6, 1, 3, null, 7" }],
  defaults: { tree: "8, 4, 12, 2, 6, 10, 14, 1, 3, 5, 7" },
  validate: (i) => (i.tree.length > 31 ? "Keep the tree ≤ 31 slots (5 levels)" : i.tree[0] === null || !i.tree.length ? "Root can't be null" : null),
  gen: (n) => ({ tree: Array.from({ length: n }, (_, i) => i + 1) }),
  sizes: [7, 31, 127, 511, 2047, 8191, 32767],
  sizeLabel: "nodes",
  takeaway:
    "All traversals are O(n) — they differ only in WHEN the root is processed. Inorder of a BST gives sorted values. Preorder copies/serializes a tree. Postorder computes from the bottom up (heights, deleting). Level order (BFS) handles \"per level\" questions.",
  approaches: [
    {
      id: "inorder",
      name: "Inorder (DFS)",
      badge: "Classic",
      time: "O(n)",
      space: "O(h)",
      idea: ORDER_INFO.inorder + " — sorted order for a BST!",
      java: travCode("inorder", "left", "root", "right", "java"),
      cpp: travCode("inorder", "left", "root", "right", "cpp"),
      run: dfsTraversal("inorder") as never,
    },
    {
      id: "preorder",
      name: "Preorder (DFS)",
      badge: "Classic",
      time: "O(n)",
      space: "O(h)",
      idea: ORDER_INFO.preorder + " — copy / serialize a tree.",
      java: travCode("preorder", "root", "left", "right", "java"),
      cpp: travCode("preorder", "root", "left", "right", "cpp"),
      run: dfsTraversal("preorder") as never,
    },
    {
      id: "postorder",
      name: "Postorder (DFS)",
      badge: "Classic",
      time: "O(n)",
      space: "O(h)",
      idea: ORDER_INFO.postorder + " — children before parent (bottom-up).",
      java: travCode("postorder", "left", "right", "root", "java"),
      cpp: travCode("postorder", "left", "right", "root", "cpp"),
      run: dfsTraversal("postorder") as never,
    },
    {
      id: "level",
      name: "Level order (BFS)",
      badge: "Classic",
      time: "O(n)",
      space: "O(w)",
      idea: "Queue: process level by level, left to right.",
      java: `List<Integer> levelOrder(TreeNode root) {
    List<Integer> out = new ArrayList<>();
    Queue<TreeNode> q = new ArrayDeque<>();
    q.offer(root);
    while (!q.isEmpty()) {
        TreeNode n = q.poll();                     //@visit
        out.add(n.val);
        if (n.left != null) q.offer(n.left);       //@enqueue
        if (n.right != null) q.offer(n.right);
    }
    return out;
}`,
      cpp: `vector<int> levelOrder(TreeNode* root) {
    vector<int> out;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        TreeNode* n = q.front(); q.pop();          //@visit
        out.push_back(n->val);
        if (n->left) q.push(n->left);              //@enqueue
        if (n->right) q.push(n->right);
    }
    return out;
}`,
      run: ({ tree }, t) => {
        const out: (number | string)[] = [];
        const tones: Record<number, CellTone> = {};
        const q = [0];
        let head = 0;
        while (head < q.length) {
          const i = q[head++];
          t.op();
          out.push(tree[i]);
          tones[i] = "done";
          for (const c of [2 * i + 1, 2 * i + 2]) if (c < tree.length && tree[c] !== null) q.push(c);
          t.snap(() => ({
            step: "visit",
            msg: `Dequeue ${tree[i]}, output it, enqueue its children.`,
            mood: "happy",
            tree: { title: "Level by level", values: tree, tones: { ...tones, [i]: "found", ...Object.fromEntries(q.slice(head).map((x) => [x, "compare" as CellTone])) }, output: [...out] },
            stacks: [{ title: "queue (front → back)", kind: "queue", items: q.slice(head).map((x) => String(tree[x])) }],
          }));
        }
        return `[${out.join(", ")}]`;
      },
    },
  ],
};
