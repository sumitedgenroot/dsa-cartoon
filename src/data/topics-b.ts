import type { Topic } from "./types";

export const TOPICS_B: Topic[] = [
  {
    slug: "heap",
    num: 12,
    title: "Heap / Priority Queue",
    emoji: "⛰️",
    tone: "bubble",
    tier: "Strong",
    tagline: "The smallest (or biggest) thing is always on top.",
    analogy:
      "A hospital emergency room: patients aren't seen in arrival order — the most critical patient is always called next, even if they just walked in. A new patient \"bubbles up\" to their right place in the line.",
    concept:
      "A heap is a complete binary tree stored in an array where every parent ≤ its children (min-heap). The top is the minimum in O(1); insert and remove-top are O(log n) because elements sift up/down one level at a time. Java's PriorityQueue is a min-heap; C++'s priority_queue is a MAX-heap by default.",
    whenToUse: [
      "Top K / Kth largest / Kth smallest.",
      "Repeatedly take the smallest/largest (Dijkstra, merge k sorted lists, scheduling).",
      "Running median (two heaps).",
    ],
    signals: ["top k", "kth largest", "kth smallest", "k closest", "median", "most frequent", "merge k"],
    thought:
      "Top K / Kth → Heap. Trick: for the Kth LARGEST keep a MIN-heap of size K — the top is the smallest of the K biggest = the answer. Space stays O(K) instead of O(N).",
    desi: "Kth LARGEST chahiye to MIN-heap of size K rakho (chhota top pe). Ulta Kth smallest ke liye max-heap of size K.",
    ops: [
      { op: "Min-heap", java: "new PriorityQueue<>()", cpp: "priority_queue<int, vector<int>, greater<int>>", time: "push/pop O(log n)" },
      { op: "Max-heap", java: "new PriorityQueue<>(Collections.reverseOrder())", cpp: "priority_queue<int>", time: "push/pop O(log n)" },
      { op: "Peek top", java: "pq.peek()", cpp: "pq.top()", time: "O(1)" },
      { op: "Build from n items", java: "new PriorityQueue<>(list)", cpp: "make_heap / constructor", time: "O(n)" },
    ],
    examples: [
      {
        title: "Kth Largest Element",
        java: `int findKthLargest(int[] a, int k) {
    PriorityQueue<Integer> minHeap = new PriorityQueue<>();
    for (int x : a) {
        minHeap.offer(x);
        if (minHeap.size() > k) minHeap.poll(); // drop the smallest
    }
    return minHeap.peek(); // top = kth largest
}`,
        cpp: `int findKthLargest(vector<int>& a, int k) {
    priority_queue<int, vector<int>, greater<int>> minHeap;
    for (int x : a) {
        minHeap.push(x);
        if ((int)minHeap.size() > k) minHeap.pop(); // drop the smallest
    }
    return minHeap.top(); // top = kth largest
}`,
        time: "O(n log k)",
        space: "O(k)",
      },
      {
        title: "Merge K sorted lists",
        java: `ListNode mergeKLists(ListNode[] lists) {
    PriorityQueue<ListNode> pq = new PriorityQueue<>((a, b) -> a.val - b.val);
    for (ListNode l : lists) if (l != null) pq.offer(l);
    ListNode dummy = new ListNode(0), tail = dummy;
    while (!pq.isEmpty()) {
        ListNode n = pq.poll();      // smallest head
        tail.next = n; tail = n;
        if (n.next != null) pq.offer(n.next);
    }
    return dummy.next;
}`,
        cpp: `ListNode* mergeKLists(vector<ListNode*>& lists) {
    auto cmp = [](ListNode* a, ListNode* b) { return a->val > b->val; };
    priority_queue<ListNode*, vector<ListNode*>, decltype(cmp)> pq(cmp);
    for (auto l : lists) if (l) pq.push(l);
    ListNode dummy(0); ListNode* tail = &dummy;
    while (!pq.empty()) {
        ListNode* n = pq.top(); pq.pop();  // smallest head
        tail->next = n; tail = n;
        if (n->next) pq.push(n->next);
    }
    return dummy.next;
}`,
        time: "O(N log k)",
        space: "O(k)",
      },
    ],
    gotchas: [
      "C++ priority_queue is a MAX-heap by default; Java PriorityQueue is a MIN-heap. Classic bug when switching languages!",
      "C++ custom comparator is reversed: return a > b for a min-heap.",
      "Comparator (a, b) -> a - b can overflow; use Integer.compare.",
    ],
    practice: [
      { name: "Kth Largest Element in an Array", level: "Medium" },
      { name: "Top K Frequent Elements", level: "Medium" },
      { name: "K Closest Points to Origin", level: "Medium" },
      { name: "Task Scheduler", level: "Medium" },
      { name: "Find Median from Data Stream", level: "Hard" },
    ],
    labs: ["kth-largest"],
  },
  {
    slug: "graphs",
    num: 13,
    title: "Graphs (BFS, DFS, Topo Sort, Dijkstra)",
    emoji: "🕸️",
    tone: "sky",
    tier: "Must",
    tagline: "Nodes + edges. Grids, maps, networks and dependencies are all graphs.",
    analogy:
      "BFS is like ripples in a pond — you reach everything 1 step away, then 2 steps, and so on (so the first time you reach something is the shortest path). DFS is like exploring a cave — go as deep as possible, then backtrack.",
    concept:
      "A graph is vertices connected by edges (directed or undirected, weighted or not). Trees are special graphs; grids are graphs where each cell connects to its 4 neighbours. Store it as an adjacency list. Always keep a visited set — graphs can have cycles.",
    whenToUse: [
      "Shortest path in an unweighted graph/grid → BFS.",
      "Reachability, connected components, cycle detection → DFS.",
      "Ordering with dependencies (courses, build systems) → Topological sort.",
      "Shortest path with positive weights → Dijkstra.",
    ],
    signals: ["grid", "islands", "connected", "network", "path", "neighbors", "prerequisites", "dependencies", "shortest path", "flights"],
    thought:
      "Connections / network / grid / islands / prerequisites → Graph. Unweighted shortest path → BFS. Reachable? cycle? components? → DFS. Order with dependencies → Topological sort. Weighted shortest path → Dijkstra. ALWAYS mark visited.",
    desi: "\"Connections / network / grid / islands / prerequisites\" dikhe → Graph. HAMESHA visited set rakho warna infinite loop.",
    examples: [
      {
        title: "Number of Islands (grid DFS)",
        java: `int numIslands(char[][] grid) {
    int count = 0;
    for (int r = 0; r < grid.length; r++)
        for (int c = 0; c < grid[0].length; c++)
            if (grid[r][c] == '1') {
                count++;
                sink(grid, r, c);   // turn the whole island to water
            }
    return count;
}
void sink(char[][] g, int r, int c) {
    if (r < 0 || c < 0 || r >= g.length || c >= g[0].length || g[r][c] == '0') return;
    g[r][c] = '0';                       // mark visited
    sink(g, r + 1, c); sink(g, r - 1, c);
    sink(g, r, c + 1); sink(g, r, c - 1);
}`,
        cpp: `void sink(vector<vector<char>>& g, int r, int c) {
    if (r < 0 || c < 0 || r >= (int)g.size() || c >= (int)g[0].size() || g[r][c] == '0') return;
    g[r][c] = '0';                       // mark visited
    sink(g, r + 1, c); sink(g, r - 1, c);
    sink(g, r, c + 1); sink(g, r, c - 1);
}
int numIslands(vector<vector<char>>& grid) {
    int count = 0;
    for (int r = 0; r < (int)grid.size(); r++)
        for (int c = 0; c < (int)grid[0].size(); c++)
            if (grid[r][c] == '1') { count++; sink(grid, r, c); }
    return count;
}`,
        time: "O(rows · cols)",
        space: "O(rows · cols)",
      },
      {
        title: "BFS shortest path (unweighted)",
        java: `int bfs(Map<Integer, List<Integer>> graph, int start, int target) {
    Queue<Integer> q = new LinkedList<>();
    Set<Integer> visited = new HashSet<>();
    q.offer(start); visited.add(start);
    int dist = 0;
    while (!q.isEmpty()) {
        int size = q.size();
        for (int i = 0; i < size; i++) {     // one level at a time
            int node = q.poll();
            if (node == target) return dist;
            for (int nb : graph.getOrDefault(node, List.of()))
                if (visited.add(nb)) q.offer(nb);
        }
        dist++;
    }
    return -1;
}`,
        cpp: `int bfs(unordered_map<int, vector<int>>& graph, int start, int target) {
    queue<int> q;
    unordered_set<int> visited;
    q.push(start); visited.insert(start);
    int dist = 0;
    while (!q.empty()) {
        int size = q.size();
        for (int i = 0; i < size; i++) {     // one level at a time
            int node = q.front(); q.pop();
            if (node == target) return dist;
            for (int nb : graph[node])
                if (visited.insert(nb).second) q.push(nb);
        }
        dist++;
    }
    return -1;
}`,
        time: "O(V + E)",
        space: "O(V)",
      },
      {
        title: "Topological Sort (Kahn's BFS) — Course Schedule",
        logic: "Count in-degrees (unfinished prerequisites). Start with nodes having 0, and each time you finish one, decrement its neighbours. If everything gets processed, there's no cycle.",
        java: `boolean canFinish(int n, int[][] prereqs) {
    List<List<Integer>> adj = new ArrayList<>();
    int[] indeg = new int[n];
    for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
    for (int[] p : prereqs) { adj.get(p[1]).add(p[0]); indeg[p[0]]++; }
    Queue<Integer> q = new LinkedList<>();
    for (int i = 0; i < n; i++) if (indeg[i] == 0) q.offer(i);
    int done = 0;
    while (!q.isEmpty()) {
        int cur = q.poll(); done++;
        for (int nx : adj.get(cur))
            if (--indeg[nx] == 0) q.offer(nx);
    }
    return done == n;
}`,
        cpp: `bool canFinish(int n, vector<vector<int>>& prereqs) {
    vector<vector<int>> adj(n);
    vector<int> indeg(n, 0);
    for (auto& p : prereqs) { adj[p[1]].push_back(p[0]); indeg[p[0]]++; }
    queue<int> q;
    for (int i = 0; i < n; i++) if (indeg[i] == 0) q.push(i);
    int done = 0;
    while (!q.empty()) {
        int cur = q.front(); q.pop(); done++;
        for (int nx : adj[cur])
            if (--indeg[nx] == 0) q.push(nx);
    }
    return done == n;
}`,
        time: "O(V + E)",
        space: "O(V + E)",
      },
      {
        title: "Dijkstra (weighted shortest path)",
        logic: "Always expand the closest unfinished node (min-heap), relax its edges. Doesn't work with negative weights — use Bellman-Ford there.",
        java: `int[] dijkstra(List<int[]>[] adj, int n, int src) {
    int[] dist = new int[n];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[src] = 0;
    PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]); // [dist, node]
    pq.offer(new int[]{0, src});
    while (!pq.isEmpty()) {
        int[] cur = pq.poll();
        int d = cur[0], u = cur[1];
        if (d > dist[u]) continue;            // stale entry
        for (int[] e : adj[u]) {              // e = [v, w]
            int v = e[0], w = e[1];
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.offer(new int[]{dist[v], v});
            }
        }
    }
    return dist;
}`,
        cpp: `vector<int> dijkstra(vector<vector<pair<int,int>>>& adj, int n, int src) {
    vector<int> dist(n, INT_MAX);
    dist[src] = 0;
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq; // {dist, node}
    pq.push({0, src});
    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d > dist[u]) continue;            // stale entry
        for (auto [v, w] : adj[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
}`,
        time: "O(E log V)",
        space: "O(V)",
      },
    ],
    gotchas: [
      "Mark visited when you ENQUEUE in BFS, not when you dequeue — otherwise nodes get added many times.",
      "Recursive DFS on a 1000×1000 grid can overflow the stack — use an explicit stack or BFS.",
      "Dijkstra fails with negative edge weights.",
    ],
    practice: [
      { name: "Number of Islands", level: "Medium" },
      { name: "Clone Graph", level: "Medium" },
      { name: "Rotting Oranges", level: "Medium" },
      { name: "Course Schedule", level: "Medium" },
      { name: "Pacific Atlantic Water Flow", level: "Medium" },
      { name: "Network Delay Time", level: "Medium" },
      { name: "Word Ladder", level: "Hard" },
    ],
    labs: ["islands"],
    games: ["maze-race"],
  },
  {
    slug: "union-find",
    num: 14,
    title: "Union-Find (Disjoint Set)",
    emoji: "🤝",
    tone: "peach",
    tier: "Good",
    tagline: "Who's in which group? Merge groups in almost O(1).",
    analogy:
      "Every friend group has a \"leader\". To check if two people are in the same group, ask each of them who their leader is. When two groups become friends, one leader agrees to follow the other.",
    concept:
      "Two operations: find(x) — which group's leader is x? union(a, b) — merge a's and b's groups. With path compression (everyone points directly to the leader after a lookup) and union by rank (attach the shorter tree under the taller one), each op is nearly O(1) — inverse Ackermann.",
    whenToUse: [
      "Number of connected components when edges arrive one by one.",
      "\"Are these two connected?\" queries.",
      "Cycle detection in an undirected graph.",
      "Kruskal's Minimum Spanning Tree.",
    ],
    signals: ["connected components", "groups", "merge accounts", "redundant connection", "provinces", "same group"],
    thought:
      "When groups merge dynamically and you keep asking \"same group?\" → Union-Find. BFS/DFS also finds components, but DSU shines when edges are added online one at a time.",
    desi: "Jab dynamically groups merge ho rahe hon aur \"same group me hain?\" poochna ho — Union-Find.",
    examples: [
      {
        title: "Full implementation",
        java: `class UnionFind {
    int[] parent, rank;
    int count;                         // number of components
    UnionFind(int n) {
        parent = new int[n]; rank = new int[n]; count = n;
        for (int i = 0; i < n; i++) parent[i] = i;
    }
    int find(int x) {                  // path compression
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }
    boolean union(int a, int b) {
        int ra = find(a), rb = find(b);
        if (ra == rb) return false;    // already together (cycle!)
        if (rank[ra] < rank[rb]) { int t = ra; ra = rb; rb = t; }
        parent[rb] = ra;               // attach shorter under taller
        if (rank[ra] == rank[rb]) rank[ra]++;
        count--;
        return true;
    }
}`,
        cpp: `struct UnionFind {
    vector<int> parent, rnk;
    int count;                         // number of components
    UnionFind(int n) : parent(n), rnk(n, 0), count(n) {
        iota(parent.begin(), parent.end(), 0);
    }
    int find(int x) {                  // path compression
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }
    bool unite(int a, int b) {
        int ra = find(a), rb = find(b);
        if (ra == rb) return false;    // already together (cycle!)
        if (rnk[ra] < rnk[rb]) swap(ra, rb);
        parent[rb] = ra;               // attach shorter under taller
        if (rnk[ra] == rnk[rb]) rnk[ra]++;
        count--;
        return true;
    }
};`,
        time: "~O(α(n)) per op",
        space: "O(n)",
      },
    ],
    gotchas: [
      "Without path compression and rank, find can degrade to O(n).",
      "`union` is a reserved word in C++ — name it unite.",
    ],
    practice: [
      { name: "Number of Provinces", level: "Medium" },
      { name: "Redundant Connection", level: "Medium" },
      { name: "Number of Connected Components in an Undirected Graph", level: "Medium" },
      { name: "Graph Valid Tree", level: "Medium" },
      { name: "Accounts Merge", level: "Medium" },
    ],
  },
  {
    slug: "dynamic-programming",
    num: 15,
    title: "Dynamic Programming",
    emoji: "🧠",
    tone: "grape",
    tier: "Must",
    tagline: "Solve each small problem once, write the answer down, reuse it forever.",
    analogy:
      "Someone asks you 1+1+1+1+1+1 = ? You count: 6. They add another +1 — you instantly say 7. You didn't recount; you REMEMBERED the 6. That's DP: remember answers to sub-problems.",
    concept:
      "DP = break a big problem into overlapping subproblems and store each answer so it's computed only once. If plain recursion recomputes the same states again and again (exponential), caching makes it polynomial. Two styles: top-down (recursion + memo) and bottom-up (fill a table with loops).",
    whenToUse: [
      "\"Number of ways\" to do something.",
      "\"Minimum / maximum cost / profit\" over a sequence of choices.",
      "\"Is it possible\" (true/false) with choices at each step.",
      "Brute-force recursion recomputes the same arguments (overlapping subproblems) and the best answer is built from best sub-answers (optimal substructure).",
    ],
    signals: ["number of ways", "minimum cost", "maximum profit", "longest", "can you reach", "partition", "subsequence", "edit distance"],
    thought:
      "5 steps: 1) State — what does dp[i] mean? 2) Recurrence — how does dp[i] come from smaller states? 3) Base case. 4) Order — top-down memo or bottom-up table. 5) Where is the answer? Write the recursion first, add memo, then convert to a table if you like.",
    desi: "Pehle recursion likho, phir memo add karo, phir chaho to tabulation banao. State define karo — dp[i] ka matlab kya?",
    template: [
      "1D sequence: climb stairs, house robber, decode ways",
      "2D grid: unique paths, min path sum",
      "Two strings: LCS, edit distance",
      "Knapsack: subset sum, coin change, partition",
      "Intervals: burst balloons, matrix chain",
      "State machine: buy/sell stock with cooldown",
    ],
    examples: [
      {
        title: "Climbing Stairs (intro DP)",
        logic: "To reach step i you came from i-1 or i-2, so ways(i) = ways(i-1) + ways(i-2). It's Fibonacci!",
        java: `int climbStairs(int n) {
    if (n <= 2) return n;
    int prev2 = 1, prev1 = 2;   // ways to reach step 1 and 2
    for (int i = 3; i <= n; i++) {
        int cur = prev1 + prev2;
        prev2 = prev1;
        prev1 = cur;
    }
    return prev1;
}`,
        cpp: `int climbStairs(int n) {
    if (n <= 2) return n;
    int prev2 = 1, prev1 = 2;   // ways to reach step 1 and 2
    for (int i = 3; i <= n; i++) {
        int cur = prev1 + prev2;
        prev2 = prev1;
        prev1 = cur;
    }
    return prev1;
}`,
        time: "O(n)",
        space: "O(1)",
      },
      {
        title: "0/1 Knapsack (classic 2D DP)",
        logic: "dp[i][w] = best value using the first i items with capacity w. Either skip item i, or take it if it fits.",
        java: `int knapsack(int[] wt, int[] val, int W) {
    int n = wt.length;
    int[][] dp = new int[n + 1][W + 1];
    for (int i = 1; i <= n; i++)
        for (int w = 0; w <= W; w++) {
            dp[i][w] = dp[i - 1][w];                       // skip
            if (wt[i - 1] <= w)                            // take
                dp[i][w] = Math.max(dp[i][w], val[i - 1] + dp[i - 1][w - wt[i - 1]]);
        }
    return dp[n][W];
}`,
        cpp: `int knapsack(vector<int>& wt, vector<int>& val, int W) {
    int n = wt.size();
    vector<vector<int>> dp(n + 1, vector<int>(W + 1, 0));
    for (int i = 1; i <= n; i++)
        for (int w = 0; w <= W; w++) {
            dp[i][w] = dp[i - 1][w];                       // skip
            if (wt[i - 1] <= w)                            // take
                dp[i][w] = max(dp[i][w], val[i - 1] + dp[i - 1][w - wt[i - 1]]);
        }
    return dp[n][W];
}`,
        time: "O(n · W)",
        space: "O(n · W)",
      },
      {
        title: "Longest Common Subsequence",
        java: `int lcs(String a, String b) {
    int m = a.length(), n = b.length();
    int[][] dp = new int[m + 1][n + 1];
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++)
            if (a.charAt(i - 1) == b.charAt(j - 1))
                dp[i][j] = dp[i - 1][j - 1] + 1;           // match
            else
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    return dp[m][n];
}`,
        cpp: `int lcs(string a, string b) {
    int m = a.size(), n = b.size();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++)
            if (a[i - 1] == b[j - 1])
                dp[i][j] = dp[i - 1][j - 1] + 1;           // match
            else
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
    return dp[m][n];
}`,
        time: "O(m · n)",
        space: "O(m · n)",
      },
      {
        title: "Coin Change (min coins)",
        java: `int coinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1);           // "infinity"
    dp[0] = 0;
    for (int x = 1; x <= amount; x++)
        for (int c : coins)
            if (c <= x) dp[x] = Math.min(dp[x], dp[x - c] + 1);
    return dp[amount] > amount ? -1 : dp[amount];
}`,
        cpp: `int coinChange(vector<int>& coins, int amount) {
    vector<int> dp(amount + 1, amount + 1); // "infinity"
    dp[0] = 0;
    for (int x = 1; x <= amount; x++)
        for (int c : coins)
            if (c <= x) dp[x] = min(dp[x], dp[x - c] + 1);
    return dp[amount] > amount ? -1 : dp[amount];
}`,
        time: "O(amount · coins)",
        space: "O(amount)",
      },
    ],
    gotchas: [
      "Greedy is NOT always right — coin change with [1,3,4] and amount 6: greedy gives 4+1+1 (3 coins), DP gives 3+3 (2 coins).",
      "Deep top-down recursion can overflow the stack; bottom-up avoids it.",
      "When dp[i] only depends on the last row/two values, compress space to O(n) or O(1).",
    ],
    practice: [
      { name: "Climbing Stairs", level: "Easy" },
      { name: "House Robber", level: "Medium" },
      { name: "Coin Change", level: "Medium" },
      { name: "Longest Increasing Subsequence", level: "Medium" },
      { name: "Word Break", level: "Medium" },
      { name: "Unique Paths", level: "Medium" },
      { name: "Partition Equal Subset Sum", level: "Medium" },
      { name: "Edit Distance", level: "Medium" },
    ],
    labs: ["climbing-stairs", "coin-change", "lcs"],
    games: ["coin-change"],
  },
  {
    slug: "greedy",
    num: 16,
    title: "Greedy Algorithms",
    emoji: "🤑",
    tone: "sun",
    tier: "Strong",
    tagline: "Take the best-looking option right now — when you can prove it's safe.",
    analogy:
      "Packing for a short trip by always grabbing the most useful item next. Works great for a backpack of equally sized items… but fails when one big item blocks two better small ones. Greedy is fast, but you must justify it.",
    concept:
      "At each step pick the locally optimal choice and never look back. When the problem has the \"greedy choice property\" (a local best is part of some global best), this is correct and usually O(n) or O(n log n). If you can find a counter-example, switch to DP.",
    whenToUse: [
      "Interval scheduling (pick the earliest finishing meeting).",
      "Jump game / gas station style reachability.",
      "Making change with \"canonical\" coins (1, 2, 5, 10…).",
      "After sorting, a simple rule clearly works.",
    ],
    signals: ["maximum number of", "minimum number of", "schedule", "intervals", "jump", "earliest", "assign"],
    thought:
      "Before going greedy ask: \"Can today's best choice block a better future?\" If you can't find a counter-example and a sort + simple rule appears, greedy is likely right. Justify it in one line in the interview.",
    desi: "Greedy try karne se pehle socho: \"kya abhi ka best choice future ko block to nahi karega?\" Agar greedy fail ho, DP lagti hai.",
    examples: [
      {
        title: "Jump Game (can you reach the end?)",
        logic: "Track the farthest index reachable so far. If you ever stand beyond it, you're stuck.",
        java: `boolean canJump(int[] nums) {
    int farthest = 0;
    for (int i = 0; i < nums.length; i++) {
        if (i > farthest) return false;   // can't even get here
        farthest = Math.max(farthest, i + nums[i]);
    }
    return true;
}`,
        cpp: `bool canJump(vector<int>& nums) {
    int farthest = 0;
    for (int i = 0; i < (int)nums.size(); i++) {
        if (i > farthest) return false;   // can't even get here
        farthest = max(farthest, i + nums[i]);
    }
    return true;
}`,
        time: "O(n)",
        space: "O(1)",
      },
      {
        title: "Non-overlapping intervals (activity selection)",
        logic: "Sort by end time. Always keep the meeting that finishes first — it leaves the most room for the rest.",
        java: `int eraseOverlapIntervals(int[][] iv) {
    Arrays.sort(iv, (a, b) -> Integer.compare(a[1], b[1]));
    int kept = 0, end = Integer.MIN_VALUE;
    for (int[] x : iv) {
        if (x[0] >= end) { kept++; end = x[1]; }
    }
    return iv.length - kept;   // removed
}`,
        cpp: `int eraseOverlapIntervals(vector<vector<int>>& iv) {
    sort(iv.begin(), iv.end(), [](auto& a, auto& b) { return a[1] < b[1]; });
    int kept = 0, end = INT_MIN;
    for (auto& x : iv) {
        if (x[0] >= end) { kept++; end = x[1]; }
    }
    return iv.size() - kept;   // removed
}`,
        time: "O(n log n)",
        space: "O(1)",
      },
    ],
    gotchas: [
      "Greedy coin change fails for coins like [1, 3, 4]. Try a counter-example before committing.",
      "Sorting by the wrong key (start instead of end) breaks interval greedy.",
    ],
    practice: [
      { name: "Jump Game", level: "Medium" },
      { name: "Jump Game II", level: "Medium" },
      { name: "Gas Station", level: "Medium" },
      { name: "Partition Labels", level: "Medium" },
      { name: "Non-overlapping Intervals", level: "Medium" },
      { name: "Minimum Number of Arrows to Burst Balloons", level: "Medium" },
    ],
    labs: ["coin-change"],
    games: ["coin-change"],
  },
  {
    slug: "trie",
    num: 17,
    title: "Trie (Prefix Tree)",
    emoji: "🔤",
    tone: "mint",
    tier: "Good",
    tagline: "Words share prefixes, so they share paths.",
    analogy:
      "Your phone keyboard's autocomplete: after typing \"ca\", it only looks at words under the c → a branch (cat, car, cable) — it never scans words starting with \"z\".",
    concept:
      "Each node represents a prefix and has up to 26 children (one per letter) plus an isEnd flag. Insert and search take O(L) where L is the word length — independent of how many words are stored.",
    whenToUse: ["Autocomplete / prefix search.", "Spell checking, word games (Boggle, Word Search II).", "Longest common prefix, replace words with roots."],
    signals: ["prefix", "starts with", "autocomplete", "dictionary", "word search", "many words"],
    thought:
      "Lots of prefix-based lookups over many words → Trie. 26 children + isEnd per node. Insert and search both walk one node per character.",
    desi: "Bahut saare words me prefix-based search bar-bar karni ho → Trie.",
    examples: [
      {
        title: "Implement Trie",
        java: `class Trie {
    static class Node {
        Node[] children = new Node[26];
        boolean isEnd;
    }
    private final Node root = new Node();

    void insert(String word) {
        Node cur = root;
        for (char c : word.toCharArray()) {
            int i = c - 'a';
            if (cur.children[i] == null) cur.children[i] = new Node();
            cur = cur.children[i];
        }
        cur.isEnd = true;
    }
    boolean search(String w)     { Node n = walk(w); return n != null && n.isEnd; }
    boolean startsWith(String p) { return walk(p) != null; }

    private Node walk(String s) {
        Node cur = root;
        for (char c : s.toCharArray()) {
            cur = cur.children[c - 'a'];
            if (cur == null) return null;
        }
        return cur;
    }
}`,
        cpp: `class Trie {
    struct Node {
        Node* children[26] = {};
        bool isEnd = false;
    };
    Node* root = new Node();

    Node* walk(const string& s) {
        Node* cur = root;
        for (char c : s) {
            cur = cur->children[c - 'a'];
            if (!cur) return nullptr;
        }
        return cur;
    }
public:
    void insert(const string& word) {
        Node* cur = root;
        for (char c : word) {
            int i = c - 'a';
            if (!cur->children[i]) cur->children[i] = new Node();
            cur = cur->children[i];
        }
        cur->isEnd = true;
    }
    bool search(const string& w)     { Node* n = walk(w); return n && n->isEnd; }
    bool startsWith(const string& p) { return walk(p) != nullptr; }
};`,
        time: "O(L) per op",
        space: "O(total chars · 26)",
      },
    ],
    gotchas: ["search(\"app\") must check isEnd — \"app\" is a prefix of \"apple\" but may not be a word.", "For non-lowercase alphabets use a HashMap of children."],
    practice: [
      { name: "Implement Trie (Prefix Tree)", level: "Medium", lc: "implement-trie-prefix-tree" },
      { name: "Design Add and Search Words Data Structure", level: "Medium" },
      { name: "Replace Words", level: "Medium" },
      { name: "Word Search II", level: "Hard" },
    ],
  },
  {
    slug: "bit-manipulation",
    num: 18,
    title: "Bit Manipulation",
    emoji: "💡",
    tone: "cherry",
    tier: "Good",
    tagline: "Think in 0s and 1s for O(1)-space magic tricks.",
    analogy:
      "A row of light switches. XOR is a toggle: flip a switch twice and it's back where it started. That's why XOR-ing every number cancels all the pairs and leaves only the lonely one.",
    concept:
      "Integers are stored as bits. AND, OR, XOR, NOT and shifts operate on all bits at once, very fast. Bitmasks let one int represent a whole subset (bit i = element i present).",
    whenToUse: ["Find the single / missing number.", "Power of two, counting set bits.", "Represent subsets as masks (n ≤ 20).", "Swap / toggle flags in O(1) space."],
    signals: ["single number", "appears twice", "missing number", "power of two", "bits", "xor", "subset mask"],
    thought:
      "XOR magic: a ^ a = 0, a ^ 0 = a. XOR everything and pairs cancel. For subsets, loop mask from 0 to 2ⁿ−1 and check (mask >> i) & 1.",
    desi: "XOR ka jaadu: a ^ a = 0, a ^ 0 = a. Saare XOR karo, pairs cancel ho jaayenge.",
    ops: [
      { op: "Odd check", java: "(x & 1) == 1", cpp: "x & 1", time: "O(1)" },
      { op: "Remove lowest set bit", java: "x & (x - 1)", cpp: "x & (x - 1)", time: "O(1)" },
      { op: "Lowest set bit", java: "x & (-x)", cpp: "x & (-x)", time: "O(1)" },
      { op: "Count set bits", java: "Integer.bitCount(x)", cpp: "__builtin_popcount(x)", time: "O(1)" },
      { op: "Check bit i", java: "(x >> i) & 1", cpp: "(x >> i) & 1", time: "O(1)" },
    ],
    examples: [
      {
        title: "Single Number",
        java: `int singleNumber(int[] nums) {
    int result = 0;
    for (int n : nums) result ^= n;   // pairs cancel out
    return result;
}`,
        cpp: `int singleNumber(vector<int>& nums) {
    int result = 0;
    for (int n : nums) result ^= n;   // pairs cancel out
    return result;
}`,
        time: "O(n)",
        space: "O(1)",
      },
      {
        title: "All subsets with a bitmask",
        java: `List<List<Integer>> subsets(int[] a) {
    int n = a.length;
    List<List<Integer>> res = new ArrayList<>();
    for (int mask = 0; mask < (1 << n); mask++) {
        List<Integer> cur = new ArrayList<>();
        for (int i = 0; i < n; i++)
            if (((mask >> i) & 1) == 1) cur.add(a[i]);
        res.add(cur);
    }
    return res;
}`,
        cpp: `vector<vector<int>> subsets(vector<int>& a) {
    int n = a.size();
    vector<vector<int>> res;
    for (int mask = 0; mask < (1 << n); mask++) {
        vector<int> cur;
        for (int i = 0; i < n; i++)
            if ((mask >> i) & 1) cur.push_back(a[i]);
        res.push_back(cur);
    }
    return res;
}`,
        time: "O(n · 2ⁿ)",
        space: "O(n · 2ⁿ)",
      },
    ],
    gotchas: ["Operator precedence: write (x & 1) == 1 with brackets — == binds tighter than & in Java and C++.", "1 << 31 overflows int; use 1L << k / 1LL << k for big shifts.", "Java has >>> (unsigned shift); C++ uses unsigned types."],
    practice: [
      { name: "Single Number", level: "Easy" },
      { name: "Number of 1 Bits", level: "Easy" },
      { name: "Counting Bits", level: "Easy" },
      { name: "Missing Number", level: "Easy" },
      { name: "Reverse Bits", level: "Easy" },
      { name: "Sum of Two Integers", level: "Medium" },
    ],
    labs: ["single-number"],
    games: ["bit-flipper"],
  },
  {
    slug: "intervals",
    num: 19,
    title: "Intervals",
    emoji: "📅",
    tone: "sky",
    tier: "Strong",
    tagline: "Almost always: sort by start first.",
    analogy:
      "Merging your calendar: a 9–10 meeting and a 9:30–11 meeting overlap, so you're busy 9–11. Lay all meetings out in order of start time and sweep left to right.",
    concept:
      "Intervals are [start, end] pairs. After sorting by start, overlapping intervals become neighbours, so one linear sweep merges them. Two intervals overlap if a.start ≤ b.end AND b.start ≤ a.end.",
    whenToUse: ["Merge / insert intervals.", "Meeting rooms (can attend? how many rooms?).", "Minimum arrows / remove overlaps (greedy by end)."],
    signals: ["intervals", "meetings", "overlap", "merge", "calendar", "rooms", "schedule"],
    thought:
      "Interval problem → SORT by start (or by end for greedy picking). Merge rule: if current.start ≤ last.end, extend last.end = max(last.end, current.end); otherwise start a new interval.",
    desi: "Interval problem dikhe → SORT by start time. Agar current start <= last end, to merge (end ko max karo), warna naya interval.",
    examples: [
      {
        title: "Merge Intervals",
        java: `int[][] merge(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
    List<int[]> res = new ArrayList<>();
    int[] cur = intervals[0];
    for (int i = 1; i < intervals.length; i++) {
        if (intervals[i][0] <= cur[1]) {          // overlap
            cur[1] = Math.max(cur[1], intervals[i][1]);
        } else {
            res.add(cur);                          // gap: save
            cur = intervals[i];
        }
    }
    res.add(cur);
    return res.toArray(new int[0][]);
}`,
        cpp: `vector<vector<int>> merge(vector<vector<int>>& iv) {
    sort(iv.begin(), iv.end());
    vector<vector<int>> res;
    for (auto& x : iv) {
        if (!res.empty() && x[0] <= res.back()[1])     // overlap
            res.back()[1] = max(res.back()[1], x[1]);
        else
            res.push_back(x);                          // gap: new
    }
    return res;
}`,
        time: "O(n log n)",
        space: "O(n)",
      },
      {
        title: "Meeting Rooms II (min rooms)",
        logic: "Sort starts and ends separately. Sweep: a start before the earliest end needs a new room.",
        java: `int minMeetingRooms(int[][] iv) {
    int n = iv.length;
    int[] s = new int[n], e = new int[n];
    for (int i = 0; i < n; i++) { s[i] = iv[i][0]; e[i] = iv[i][1]; }
    Arrays.sort(s); Arrays.sort(e);
    int rooms = 0, j = 0;
    for (int i = 0; i < n; i++) {
        if (s[i] < e[j]) rooms++;   // need a new room
        else j++;                   // reuse a freed room
    }
    return rooms;
}`,
        cpp: `int minMeetingRooms(vector<vector<int>>& iv) {
    vector<int> s, e;
    for (auto& x : iv) { s.push_back(x[0]); e.push_back(x[1]); }
    sort(s.begin(), s.end()); sort(e.begin(), e.end());
    int rooms = 0, j = 0;
    for (int i = 0; i < (int)s.size(); i++) {
        if (s[i] < e[j]) rooms++;   // need a new room
        else j++;                   // reuse a freed room
    }
    return rooms;
}`,
        time: "O(n log n)",
        space: "O(n)",
      },
    ],
    gotchas: ["Clarify whether touching intervals ([1,2] and [2,3]) count as overlapping.", "Handle an empty input before reading intervals[0]."],
    practice: [
      { name: "Merge Intervals", level: "Medium" },
      { name: "Insert Interval", level: "Medium" },
      { name: "Non-overlapping Intervals", level: "Medium" },
      { name: "Meeting Rooms II", level: "Medium" },
      { name: "Minimum Number of Arrows to Burst Balloons", level: "Medium" },
    ],
  },
  {
    slug: "math",
    num: 20,
    title: "Math & Number Theory",
    emoji: "🧮",
    tone: "peach",
    tier: "Good",
    tagline: "GCD, primes, fast power and modulo — the toolbox behind many puzzles.",
    analogy:
      "Euclid's GCD is like cutting a chocolate bar into the biggest equal squares: keep cutting off squares the size of the shorter side until nothing is left over.",
    concept:
      "A few formulas solve a surprising number of problems: gcd(a, b) = gcd(b, a % b); the Sieve of Eratosthenes finds all primes up to n in O(n log log n); fast exponentiation computes aᵇ in O(log b) by squaring; and (a·b) mod m keeps numbers small.",
    whenToUse: ["Results \"modulo 10⁹+7\".", "Prime checks / prime counting.", "LCM / GCD / fractions.", "Large powers."],
    signals: ["modulo", "10^9+7", "prime", "gcd", "lcm", "power", "divisible", "factor"],
    thought: "See \"mod 1e9+7\" → apply mod after every multiplication and addition. Many primes needed → sieve once. Big exponent → fast power.",
    desi: "\"mod 1e9+7\" dikhe to har multiplication ke baad mod lagao, warna overflow.",
    examples: [
      {
        title: "GCD, LCM and fast power",
        java: `long gcd(long a, long b) { return b == 0 ? a : gcd(b, a % b); }
long lcm(long a, long b) { return a / gcd(a, b) * b; }

long power(long a, long b, long mod) {   // a^b % mod
    long res = 1; a %= mod;
    while (b > 0) {
        if ((b & 1) == 1) res = res * a % mod;
        a = a * a % mod;
        b >>= 1;
    }
    return res;
}`,
        cpp: `long long gcd_(long long a, long long b) { return b == 0 ? a : gcd_(b, a % b); }
long long lcm_(long long a, long long b) { return a / gcd_(a, b) * b; }
// (C++17 also has std::gcd and std::lcm in <numeric>)

long long power(long long a, long long b, long long mod) {   // a^b % mod
    long long res = 1; a %= mod;
    while (b > 0) {
        if (b & 1) res = res * a % mod;
        a = a * a % mod;
        b >>= 1;
    }
    return res;
}`,
        time: "O(log n)",
        space: "O(1)",
      },
      {
        title: "Sieve of Eratosthenes",
        java: `boolean[] sieve(int n) {
    boolean[] isPrime = new boolean[n + 1];
    Arrays.fill(isPrime, true);
    isPrime[0] = false; if (n >= 1) isPrime[1] = false;
    for (int i = 2; (long) i * i <= n; i++)
        if (isPrime[i])
            for (int j = i * i; j <= n; j += i) isPrime[j] = false;
    return isPrime;
}`,
        cpp: `vector<bool> sieve(int n) {
    vector<bool> isPrime(n + 1, true);
    isPrime[0] = false; if (n >= 1) isPrime[1] = false;
    for (long long i = 2; i * i <= n; i++)
        if (isPrime[i])
            for (long long j = i * i; j <= n; j += i) isPrime[j] = false;
    return isPrime;
}`,
        time: "O(n log log n)",
        space: "O(n)",
      },
    ],
    gotchas: ["a * b overflows int before % applies — cast to long first.", "In Java, -7 % 3 = -1; add mod back: ((x % m) + m) % m."],
    practice: [
      { name: "Count Primes", level: "Medium" },
      { name: "Pow(x, n)", level: "Medium", lc: "powx-n" },
      { name: "Happy Number", level: "Easy" },
      { name: "Plus One", level: "Easy" },
    ],
  },
  {
    slug: "strings",
    num: 21,
    title: "Strings & Pattern Matching",
    emoji: "🧵",
    tone: "bubble",
    tier: "Strong",
    tagline: "Character counting, palindromes and smarter searching.",
    analogy:
      "Checking a palindrome is like folding a paper strip in half — the letters at both ends must match as you fold inward. Finding a word in a book with KMP is like remembering how much of the word you already matched instead of starting over.",
    concept:
      "Most string problems reduce to arrays of chars: frequency counts (int[26]), two pointers (palindromes), sliding windows (substrings) and hashing (anagrams). For substring search, KMP precomputes a prefix-function so the search is O(n + m) instead of O(n · m).",
    whenToUse: ["Palindromes (expand around center).", "Anagram / frequency checks with int[26].", "Find a pattern in a text (KMP / Rabin-Karp).", "Building strings efficiently (StringBuilder)."],
    signals: ["palindrome", "anagram", "substring", "pattern", "prefix", "characters", "reverse words"],
    thought: "Lowercase letters only? → int[26] instead of a HashMap. Palindromic substring? → expand around each center (2n−1 centers). Repeated pattern search? → KMP.",
    desi: "Sirf lowercase letters hain to HashMap ki jagah int[26] use karo — fast aur simple.",
    examples: [
      {
        title: "Longest palindromic substring (expand around center)",
        java: `String longestPalindrome(String s) {
    int start = 0, best = 0;
    for (int c = 0; c < s.length(); c++) {
        for (int odd = 0; odd < 2; odd++) {        // odd & even centers
            int l = c, r = c + odd;
            while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) { l--; r++; }
            if (r - l - 1 > best) { best = r - l - 1; start = l + 1; }
        }
    }
    return s.substring(start, start + best);
}`,
        cpp: `string longestPalindrome(string s) {
    int start = 0, best = 0, n = s.size();
    for (int c = 0; c < n; c++) {
        for (int odd = 0; odd < 2; odd++) {        // odd & even centers
            int l = c, r = c + odd;
            while (l >= 0 && r < n && s[l] == s[r]) { l--; r++; }
            if (r - l - 1 > best) { best = r - l - 1; start = l + 1; }
        }
    }
    return s.substr(start, best);
}`,
        time: "O(n²)",
        space: "O(1)",
      },
      {
        title: "KMP substring search",
        java: `int strStr(String text, String pat) {
    int m = pat.length();
    int[] lps = new int[m];                   // longest proper prefix = suffix
    for (int i = 1, len = 0; i < m; ) {
        if (pat.charAt(i) == pat.charAt(len)) lps[i++] = ++len;
        else if (len > 0) len = lps[len - 1];
        else lps[i++] = 0;
    }
    for (int i = 0, j = 0; i < text.length(); ) {
        if (text.charAt(i) == pat.charAt(j)) { i++; j++; if (j == m) return i - m; }
        else if (j > 0) j = lps[j - 1];       // reuse what matched
        else i++;
    }
    return -1;
}`,
        cpp: `int strStr(string text, string pat) {
    int m = pat.size();
    vector<int> lps(m, 0);                    // longest proper prefix = suffix
    for (int i = 1, len = 0; i < m; ) {
        if (pat[i] == pat[len]) lps[i++] = ++len;
        else if (len > 0) len = lps[len - 1];
        else lps[i++] = 0;
    }
    for (int i = 0, j = 0; i < (int)text.size(); ) {
        if (text[i] == pat[j]) { i++; j++; if (j == m) return i - m; }
        else if (j > 0) j = lps[j - 1];       // reuse what matched
        else i++;
    }
    return -1;
}`,
        time: "O(n + m)",
        space: "O(m)",
      },
    ],
    gotchas: ["Java: compare strings with .equals(), never ==.", "substring in Java is O(k) — creating substrings in a loop adds up.", "Mind empty strings and single characters."],
    practice: [
      { name: "Valid Palindrome", level: "Easy" },
      { name: "Longest Common Prefix", level: "Easy" },
      { name: "Longest Palindromic Substring", level: "Medium" },
      { name: "Palindromic Substrings", level: "Medium" },
      { name: "Find the Index of the First Occurrence in a String", level: "Easy" },
      { name: "Encode and Decode Strings", level: "Medium" },
    ],
    labs: ["longest-unique"],
  },
  {
    slug: "segment-fenwick",
    num: 22,
    title: "Segment Tree & Fenwick Tree",
    emoji: "🏗️",
    tone: "grape",
    tier: "Good",
    tagline: "Range queries AND updates, both in O(log n).",
    analogy:
      "A company org chart where every manager knows the total sales of their whole team. To get the total of a range, you ask a few managers instead of every employee. When one employee's sales change, only their chain of managers updates.",
    concept:
      "Prefix sums give O(1) queries but O(n) updates. A Fenwick (Binary Indexed) Tree gives O(log n) for both using clever i & (−i) jumps. A Segment Tree stores aggregates (sum/min/max) for segments in a tree and handles any associative operation, including range updates with lazy propagation.",
    whenToUse: ["Range sum/min/max with point updates.", "Counting inversions / smaller numbers after self.", "Problems that say \"update index i\" and \"query range [l, r]\" mixed together."],
    signals: ["update", "range query", "sumRange", "mutable", "count smaller after", "inversions"],
    thought: "Static array + range sums → prefix sum. Updates mixed with range queries → Fenwick (sums) or Segment Tree (min/max/any op).",
    desi: "Sirf query hai to prefix sum. Update + query dono hain to Fenwick ya Segment Tree.",
    examples: [
      {
        title: "Fenwick Tree (BIT)",
        java: `class Fenwick {
    int[] bit;
    Fenwick(int n) { bit = new int[n + 1]; }
    void add(int i, int delta) {            // 1-indexed
        for (; i < bit.length; i += i & (-i)) bit[i] += delta;
    }
    int prefix(int i) {                     // sum of [1..i]
        int s = 0;
        for (; i > 0; i -= i & (-i)) s += bit[i];
        return s;
    }
    int range(int l, int r) { return prefix(r) - prefix(l - 1); }
}`,
        cpp: `struct Fenwick {
    vector<int> bit;
    Fenwick(int n) : bit(n + 1, 0) {}
    void add(int i, int delta) {            // 1-indexed
        for (; i < (int)bit.size(); i += i & (-i)) bit[i] += delta;
    }
    int prefix(int i) {                     // sum of [1..i]
        int s = 0;
        for (; i > 0; i -= i & (-i)) s += bit[i];
        return s;
    }
    int range(int l, int r) { return prefix(r) - prefix(l - 1); }
};`,
        time: "O(log n) per op",
        space: "O(n)",
      },
      {
        title: "Segment Tree (range min)",
        java: `class SegTree {
    int n; int[] t;
    SegTree(int[] a) { n = a.length; t = new int[4 * n]; build(a, 1, 0, n - 1); }
    void build(int[] a, int node, int l, int r) {
        if (l == r) { t[node] = a[l]; return; }
        int m = (l + r) / 2;
        build(a, 2 * node, l, m); build(a, 2 * node + 1, m + 1, r);
        t[node] = Math.min(t[2 * node], t[2 * node + 1]);
    }
    int query(int node, int l, int r, int ql, int qr) {
        if (qr < l || r < ql) return Integer.MAX_VALUE;   // no overlap
        if (ql <= l && r <= qr) return t[node];            // full overlap
        int m = (l + r) / 2;
        return Math.min(query(2 * node, l, m, ql, qr), query(2 * node + 1, m + 1, r, ql, qr));
    }
}`,
        cpp: `struct SegTree {
    int n; vector<int> t;
    SegTree(vector<int>& a) : n(a.size()), t(4 * a.size()) { build(a, 1, 0, n - 1); }
    void build(vector<int>& a, int node, int l, int r) {
        if (l == r) { t[node] = a[l]; return; }
        int m = (l + r) / 2;
        build(a, 2 * node, l, m); build(a, 2 * node + 1, m + 1, r);
        t[node] = min(t[2 * node], t[2 * node + 1]);
    }
    int query(int node, int l, int r, int ql, int qr) {
        if (qr < l || r < ql) return INT_MAX;              // no overlap
        if (ql <= l && r <= qr) return t[node];            // full overlap
        int m = (l + r) / 2;
        return min(query(2 * node, l, m, ql, qr), query(2 * node + 1, m + 1, r, ql, qr));
    }
};`,
        time: "O(log n) query, O(n) build",
        space: "O(4n)",
      },
    ],
    gotchas: ["Fenwick is 1-indexed — shift indexes by one.", "Allocate 4n for a segment tree array."],
    practice: [
      { name: "Range Sum Query - Mutable", level: "Medium" },
      { name: "Count of Smaller Numbers After Self", level: "Hard" },
      { name: "Count of Range Sum", level: "Hard" },
    ],
  },
];
