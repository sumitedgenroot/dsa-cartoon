export type Pattern = {
  id: string;
  name: string;
  emoji: string;
  topic: string;
  signals: string[];
  when: string;
  typical: string;
};

export const PATTERNS: Pattern[] = [
  { id: "two-pointers", name: "Two Pointers", emoji: "👉👈", topic: "two-pointers", signals: ["sorted array", "pair / triplet", "palindrome", "in-place"], when: "Sorted data, pairs that meet a condition, or compacting in place.", typical: "O(n)" },
  { id: "sliding-window", name: "Sliding Window", emoji: "🪟", topic: "sliding-window", signals: ["contiguous", "substring / subarray", "longest / shortest", "at most k"], when: "Best contiguous chunk where a rule can be checked as the window grows/shrinks.", typical: "O(n)" },
  { id: "hashing", name: "HashMap / HashSet", emoji: "🗂️", topic: "hashing", signals: ["seen before?", "count / frequency", "complement", "anagram / group"], when: "You keep asking \"have I seen X?\" or need counts.", typical: "O(n) time, O(n) space" },
  { id: "prefix-sum", name: "Prefix Sum", emoji: "➕", topic: "prefix-sum", signals: ["range sum", "subarray sum = k", "many queries", "negatives"], when: "Repeated range sums, or subarray sums with negative numbers.", typical: "O(n) build, O(1) query" },
  { id: "binary-search", name: "Binary Search", emoji: "🔍", topic: "binary-search", signals: ["sorted", "minimum possible max", "find first true", "O(log n) asked"], when: "Sorted input or a monotonic yes/no condition over the answer.", typical: "O(log n)" },
  { id: "stack", name: "Stack / Monotonic Stack", emoji: "🥞", topic: "stack-queue", signals: ["brackets", "next greater / smaller", "nested", "undo"], when: "Most recent unmatched item matters, or next greater/smaller.", typical: "O(n)" },
  { id: "heap", name: "Heap / Priority Queue", emoji: "⛰️", topic: "heap", signals: ["top k", "kth largest", "merge k sorted", "median stream"], when: "Repeatedly need the smallest/largest item.", typical: "O(n log k)" },
  { id: "bfs", name: "BFS", emoji: "🌊", topic: "graphs", signals: ["shortest path (unweighted)", "minimum steps", "level by level", "spreading (rotting)"], when: "Fewest steps/moves in a graph or grid where every move costs the same.", typical: "O(V + E)" },
  { id: "dfs", name: "DFS / Flood fill", emoji: "🕳️", topic: "graphs", signals: ["islands / regions", "connected", "path exists", "explore all"], when: "Reachability, counting components, exploring every path.", typical: "O(V + E)" },
  { id: "topo", name: "Topological Sort", emoji: "📋", topic: "graphs", signals: ["prerequisites", "dependencies", "build order", "course schedule"], when: "Ordering tasks that depend on other tasks; cycle check in a DAG.", typical: "O(V + E)" },
  { id: "dijkstra", name: "Dijkstra", emoji: "🚗", topic: "graphs", signals: ["weighted shortest path", "minimum cost route", "network delay", "positive weights"], when: "Cheapest path when edges have different (non-negative) costs.", typical: "O(E log V)" },
  { id: "union-find", name: "Union-Find", emoji: "🤝", topic: "union-find", signals: ["merge groups", "same component?", "redundant edge", "accounts merge"], when: "Groups keep merging and you keep asking if two items are together.", typical: "~O(1) per op" },
  { id: "backtracking", name: "Backtracking", emoji: "🌀", topic: "recursion-backtracking", signals: ["all combinations", "all permutations", "generate all", "place without conflict"], when: "You must list/try every valid arrangement.", typical: "O(2ⁿ) / O(n!)" },
  { id: "dp", name: "Dynamic Programming", emoji: "🧠", topic: "dynamic-programming", signals: ["number of ways", "min / max cost", "can we reach", "subsequence"], when: "Choices at each step and the same subproblems repeat.", typical: "O(states × choices)" },
  { id: "greedy", name: "Greedy", emoji: "🤑", topic: "greedy", signals: ["max meetings", "min jumps", "earliest finish", "local best works"], when: "A provably safe local choice exists (often after sorting).", typical: "O(n log n)" },
  { id: "intervals", name: "Sort + Sweep Intervals", emoji: "📅", topic: "intervals", signals: ["overlap", "merge intervals", "meeting rooms", "calendar"], when: "Start/end pairs that overlap.", typical: "O(n log n)" },
  { id: "trie", name: "Trie", emoji: "🔤", topic: "trie", signals: ["prefix", "starts with", "autocomplete", "dictionary of words"], when: "Many prefix lookups over a set of words.", typical: "O(word length)" },
  { id: "bits", name: "Bit Manipulation", emoji: "💡", topic: "bit-manipulation", signals: ["appears twice except one", "XOR", "power of two", "O(1) space"], when: "Tricks with XOR/AND, or subsets as bitmasks.", typical: "O(n), O(1) space" },
  { id: "linked-list", name: "Fast & Slow Pointers", emoji: "🐢🐇", topic: "linked-list", signals: ["cycle", "middle of list", "linked list", "nth from end"], when: "Linked list structure questions.", typical: "O(n), O(1) space" },
];

export const getPattern = (id: string) => PATTERNS.find((p) => p.id === id)!;

export type Puzzle = { text: string; answer: string; why: string };

export const PUZZLES: Puzzle[] = [
  { text: "Given a SORTED array, find two numbers that add up to a target using O(1) extra space.", answer: "two-pointers", why: "Sorted + pair + O(1) space → left/right pointers." },
  { text: "Find the length of the longest substring with at most 2 distinct characters.", answer: "sliding-window", why: "\"Longest substring\" + \"at most k\" → variable sliding window." },
  { text: "Return true if any value appears at least twice in the array.", answer: "hashing", why: "\"Seen before?\" → HashSet." },
  { text: "Count the number of contiguous subarrays whose sum equals k. The array can contain negative numbers.", answer: "prefix-sum", why: "Subarray sum + negatives → prefix sum + HashMap (sliding window breaks with negatives)." },
  { text: "Koko has piles of bananas and h hours. Find the minimum eating speed to finish in time.", answer: "binary-search", why: "\"Minimum value that works\" with a monotonic check → binary search on the answer." },
  { text: "Given a string of ( ) [ ] { }, decide whether the brackets are balanced.", answer: "stack", why: "Matching the most recent opener → stack." },
  { text: "For each day's temperature, how many days until a warmer day?", answer: "stack", why: "\"Next greater element\" → monotonic stack." },
  { text: "Return the k most frequent elements of an array.", answer: "heap", why: "\"Top k\" → heap of size k (or bucket sort)." },
  { text: "In a grid, rotten oranges rot their 4 neighbours every minute. How many minutes until all are rotten?", answer: "bfs", why: "Spreading level by level, minimum time → multi-source BFS." },
  { text: "Count the number of islands in a grid of land and water.", answer: "dfs", why: "Connected regions → DFS/BFS flood fill." },
  { text: "There are n courses with prerequisite pairs. Can you finish all courses?", answer: "topo", why: "Prerequisites/dependencies + cycle check → topological sort." },
  { text: "Signals travel along weighted cables. How long until every node receives the signal from node k?", answer: "dijkstra", why: "Weighted shortest paths from one source → Dijkstra." },
  { text: "Edges are added one by one to an undirected graph. Return the first edge that creates a cycle.", answer: "union-find", why: "Online merging + \"already connected?\" → Union-Find." },
  { text: "Generate all valid combinations of n pairs of parentheses.", answer: "backtracking", why: "\"Generate all\" → backtracking (choose, explore, un-choose)." },
  { text: "Place n queens on an n×n board so none attack each other. Return all boards.", answer: "backtracking", why: "Try placements, undo on conflict → backtracking." },
  { text: "Robbers can't rob two adjacent houses. Maximise the money stolen.", answer: "dp", why: "Choice at each house (rob/skip) + overlapping subproblems → DP." },
  { text: "Find the fewest coins needed to make an amount with denominations like [1, 3, 4].", answer: "dp", why: "Min count over choices; greedy fails for [1,3,4] → DP." },
  { text: "How many distinct ways can you decode a digit string where 'A'=1 … 'Z'=26?", answer: "dp", why: "\"Number of ways\" with repeated suffixes → DP." },
  { text: "Given meeting intervals, find the maximum number of non-overlapping meetings you can attend.", answer: "greedy", why: "Pick the meeting that ends earliest, repeat → greedy (activity selection)." },
  { text: "Each element is your max jump length. Can you reach the last index?", answer: "greedy", why: "Track the farthest reachable index → greedy, O(n)." },
  { text: "Merge all overlapping intervals.", answer: "intervals", why: "Sort by start, sweep and merge." },
  { text: "Find the minimum number of meeting rooms needed.", answer: "intervals", why: "Sort starts and ends, sweep (or min-heap of end times)." },
  { text: "Design a data structure that supports adding words and checking if any word starts with a given prefix.", answer: "trie", why: "Prefix queries over many words → Trie." },
  { text: "Every number appears twice except one. Find it in O(1) extra space.", answer: "bits", why: "x ^ x = 0 → XOR everything." },
  { text: "Determine whether a linked list has a cycle using O(1) memory.", answer: "linked-list", why: "Floyd's tortoise and hare." },
  { text: "Find the middle node of a linked list in one pass.", answer: "linked-list", why: "Slow moves 1, fast moves 2 → slow ends in the middle." },
  { text: "Find the minimum in a rotated sorted array in O(log n).", answer: "binary-search", why: "Sorted (rotated) + log n → binary search comparing mid with hi." },
  { text: "Group strings that are anagrams of each other.", answer: "hashing", why: "Key = sorted string (signature) → HashMap of lists." },
  { text: "Find the minimum window in s that contains all characters of t.", answer: "sliding-window", why: "Shortest substring with a coverage rule → sliding window + counts." },
  { text: "Return the kth largest element in a stream as new numbers arrive.", answer: "heap", why: "Min-heap of size k; its top is the answer." },
];

export type Node = { q: string; options: { label: string; next?: string; result?: string[] }[] };

/** "Which algorithm?" wizard. Results are pattern ids. */
export const DECISION: Record<string, Node> = {
  start: {
    q: "What does the problem give you?",
    options: [
      { label: "An array or string", next: "array" },
      { label: "A linked list", result: ["linked-list"] },
      { label: "A tree", next: "tree" },
      { label: "A graph, grid, or dependencies", next: "graph" },
      { label: "Intervals / meetings", result: ["intervals", "greedy", "heap"] },
      { label: "A bunch of words / prefixes", result: ["trie", "hashing"] },
    ],
  },
  array: {
    q: "What are you asked to find?",
    options: [
      { label: "ALL combinations / permutations / arrangements", result: ["backtracking"] },
      { label: "Number of ways / min-max cost with choices", next: "dpgreedy" },
      { label: "Something about a contiguous subarray / substring", next: "contiguous" },
      { label: "A pair / triplet with some sum", next: "sorted" },
      { label: "Top k / kth largest / repeatedly the smallest", result: ["heap"] },
      { label: "Next greater / smaller, or matching brackets", result: ["stack"] },
      { label: "Search a value / minimum value that works", result: ["binary-search"] },
      { label: "Duplicates, counts, frequency", result: ["hashing", "bits"] },
    ],
  },
  sorted: {
    q: "Is the input sorted (or OK to sort)?",
    options: [
      { label: "Yes — sorted", result: ["two-pointers", "binary-search"] },
      { label: "No, and I need original indices", result: ["hashing"] },
    ],
  },
  contiguous: {
    q: "Can numbers be negative, or do you need many range-sum queries?",
    options: [
      { label: "Yes — negatives / many queries", result: ["prefix-sum", "hashing"] },
      { label: "No — longest/shortest window with a rule", result: ["sliding-window"] },
    ],
  },
  dpgreedy: {
    q: "Can you find a counter-example where the obvious best-right-now choice fails?",
    options: [
      { label: "Yes, greedy breaks / not sure", result: ["dp"] },
      { label: "No — a simple rule after sorting always works", result: ["greedy"] },
    ],
  },
  tree: {
    q: "What do you need?",
    options: [
      { label: "Something level by level (right view, zigzag)", result: ["bfs"] },
      { label: "Height, diameter, path sums, validate", result: ["dfs"] },
      { label: "Sorted order / kth smallest in a BST", result: ["dfs", "binary-search"] },
    ],
  },
  graph: {
    q: "What's the question?",
    options: [
      { label: "Fewest steps (all moves cost the same)", result: ["bfs"] },
      { label: "Cheapest path with weights", result: ["dijkstra"] },
      { label: "Ordering with prerequisites", result: ["topo"] },
      { label: "Count regions / is there a path", result: ["dfs", "union-find"] },
      { label: "Groups merging over time", result: ["union-find"] },
    ],
  },
};

/** Constraint → acceptable complexity table. */
export const CONSTRAINTS = [
  { n: "n ≤ 10", ok: "O(n!)", ex: "permutations, brute force everything" },
  { n: "n ≤ 20", ok: "O(2ⁿ)", ex: "subsets, bitmask DP" },
  { n: "n ≤ 500", ok: "O(n³)", ex: "Floyd-Warshall, interval DP" },
  { n: "n ≤ 5,000", ok: "O(n²)", ex: "2D DP, all pairs" },
  { n: "n ≤ 10⁶", ok: "O(n log n)", ex: "sorting, heap, binary search" },
  { n: "n ≤ 10⁸", ok: "O(n)", ex: "one pass, two pointers, hashing" },
  { n: "n > 10⁸", ok: "O(log n) / O(1)", ex: "math formula, binary search" },
];
