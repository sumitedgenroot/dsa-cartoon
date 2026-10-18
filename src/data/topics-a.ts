import type { Topic } from "./types";

export const TOPICS_A: Topic[] = [
  {
    slug: "big-o",
    num: 1,
    title: "Time & Space Complexity",
    emoji: "⏱️",
    tone: "sky",
    tier: "Must",
    tagline: "How slow does my code get when the input grows?",
    analogy:
      "Imagine finding your friend in a stadium. Shouting their name once is O(1). Walking every row is O(n). Asking every person about every other person is O(n²) — you'd still be there next week.",
    concept:
      "Big-O describes the growth rate of work as input size n grows — not actual seconds. We drop constants and keep the dominant term: 3n² + 5n + 7 is just O(n²). Space complexity is the same idea for extra memory.",
    whenToUse: [
      "Always — every solution you say out loud in an interview needs its time and space.",
      "Use input constraints to guess the target: n ≤ 20 → 2ⁿ OK, n ≤ 10³ → n² OK, n ≤ 10⁵ → n log n, n ≤ 10⁸ → O(n).",
    ],
    signals: ["constraints", "n ≤ 10^5", "optimize", "TLE"],
    thought:
      "Count loops. One loop over n = O(n). Loop inside loop = O(n²). Halving each step (binary search) = O(log n). A recursion splitting into two branches is often O(2ⁿ) until you memoize it.",
    desi: "Loops count karo. Ek loop = O(n), loop andar loop = O(n²), har step pe aadha kaat rahe ho = O(log n).",
    template: [
      "O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ) < O(n!)",
      "Sequential blocks add: O(n) + O(n²) = O(n²)",
      "Nested blocks multiply: n × log n = O(n log n)",
      "Recursion: (branches)^(depth) calls × work per call",
    ],
    ops: [
      { op: "Dynamic array get/set", java: "ArrayList.get", cpp: "vector[i]", time: "O(1)" },
      { op: "Append at end", java: "ArrayList.add", cpp: "vector.push_back", time: "O(1) amortized" },
      { op: "Insert/remove middle", java: "ArrayList.add(i,x)", cpp: "vector.insert", time: "O(n)" },
      { op: "Hash put/get/contains", java: "HashMap / HashSet", cpp: "unordered_map / unordered_set", time: "O(1) avg, O(n) worst" },
      { op: "Sorted map ops", java: "TreeMap / TreeSet", cpp: "map / set", time: "O(log n)" },
      { op: "Heap push/pop", java: "PriorityQueue", cpp: "priority_queue", time: "O(log n), peek O(1)" },
      { op: "Stack/Queue ops", java: "ArrayDeque", cpp: "stack / queue / deque", time: "O(1)" },
    ],
    examples: [
      {
        title: "Reading the complexity of loops",
        logic: "Each block's cost is written next to it. The biggest one wins.",
        java: `void demo(int[] a) {
    int n = a.length;
    int x = a[0];                         // O(1)

    for (int i = 0; i < n; i++)           // O(n)
        x += a[i];

    for (int i = 0; i < n; i++)           // O(n^2)
        for (int j = i + 1; j < n; j++)
            x += a[i] * a[j];

    for (int k = n; k > 1; k /= 2)        // O(log n)
        x--;
}
// Total: O(1) + O(n) + O(n^2) + O(log n) = O(n^2)`,
        cpp: `void demo(vector<int>& a) {
    int n = a.size();
    int x = a[0];                         // O(1)

    for (int i = 0; i < n; i++)           // O(n)
        x += a[i];

    for (int i = 0; i < n; i++)           // O(n^2)
        for (int j = i + 1; j < n; j++)
            x += a[i] * a[j];

    for (int k = n; k > 1; k /= 2)        // O(log n)
        x--;
}
// Total: O(1) + O(n) + O(n^2) + O(log n) = O(n^2)`,
        time: "O(n²)",
        space: "O(1)",
      },
      {
        title: "String building: the hidden O(n²)",
        logic: "Strings are immutable in Java, so += copies the whole string each time. Use a builder.",
        java: `// BAD: every += copies the string -> O(n^2)
String s = "";
for (int i = 0; i < n; i++) s += i;

// GOOD: StringBuilder appends in amortized O(1) -> O(n)
StringBuilder sb = new StringBuilder();
for (int i = 0; i < n; i++) sb.append(i);
String result = sb.toString();`,
        cpp: `// In C++ std::string is mutable: += is amortized O(1)
string s;
for (int i = 0; i < n; i++) s += to_string(i);   // O(n) total

// BAD: s = s + x creates a new string each time -> O(n^2)
string t;
for (int i = 0; i < n; i++) t = t + to_string(i);`,
        time: "O(n) with builder",
        space: "O(n)",
      },
    ],
    gotchas: [
      "\"String + in a loop\" is O(n²) in Java because String is immutable — use StringBuilder.",
      "HashMap is O(1) average but O(n) worst case (bad hashing / adversarial input).",
      "Recursion uses stack space: depth d means O(d) space even without arrays.",
      "In C++, s = s + x copies; s += x does not.",
    ],
    practice: [
      { name: "Contains Duplicate", level: "Easy" },
      { name: "Find All Numbers Disappeared in an Array", level: "Easy" },
    ],
    labs: ["two-sum", "search-sorted", "climbing-stairs"],
    games: ["big-o-battle"],
  },
  {
    slug: "two-pointers",
    num: 2,
    title: "Arrays & Two Pointers",
    emoji: "👉👈",
    tone: "bubble",
    tier: "Must",
    tagline: "Two fingers walking on an array turn O(n²) into O(n).",
    analogy:
      "Two friends search a sorted bookshelf for two books whose prices add to ₹500. One starts at the cheap end, one at the expensive end. Too costly? The right friend steps left. Too cheap? The left friend steps right. They meet in the middle having checked each book only once.",
    concept:
      "Keep two indices on the array — either at both ends moving inward, or both moving forward at different speeds (fast/slow). Each step throws away a part of the search space that can't hold the answer, so the total work is linear with no extra memory.",
    whenToUse: [
      "Array/string is sorted (or can be sorted) and you need a pair/triplet with some sum.",
      "Palindrome checks, reversing in place.",
      "Merging two sorted arrays/lists.",
      "In-place removal / compaction (fast & slow pointers).",
    ],
    signals: ["sorted", "pair", "two numbers", "palindrome", "in-place", "merge", "triplet"],
    thought:
      "Sorted + pair/sum → light bulb for Two Pointers. left = 0, right = n-1. Sum too big → move right left (smaller value). Too small → move left right (bigger value). Every element is visited once.",
    desi: "Sorted array + \"pair/sum\" sunte hi Two Pointers ka bulb jalna chahiye. Sum zyada hai to right ko peeche laao, kam hai to left aage badhao.",
    template: ["l = 0, r = n - 1", "while l < r: look at a[l], a[r]", "decide which pointer to move", "each move discards one candidate forever"],
    examples: [
      {
        title: "Two Sum II (sorted array)",
        java: `// Sorted array: find two numbers whose sum = target
int[] twoSum(int[] a, int target) {
    int l = 0, r = a.length - 1;
    while (l < r) {
        int sum = a[l] + a[r];
        if (sum == target) return new int[]{l, r};
        else if (sum < target) l++;   // need bigger
        else r--;                     // need smaller
    }
    return new int[]{-1, -1};
}`,
        cpp: `// Sorted array: find two numbers whose sum = target
vector<int> twoSum(vector<int>& a, int target) {
    int l = 0, r = a.size() - 1;
    while (l < r) {
        int sum = a[l] + a[r];
        if (sum == target) return {l, r};
        else if (sum < target) l++;   // need bigger
        else r--;                     // need smaller
    }
    return {-1, -1};
}`,
        time: "O(n)",
        space: "O(1)",
      },
      {
        title: "Remove duplicates from sorted array (fast/slow)",
        logic: "slow marks the end of the unique zone, fast scans everything. A new unique value gets copied right after slow.",
        java: `int removeDuplicates(int[] a) {
    if (a.length == 0) return 0;
    int slow = 0;
    for (int fast = 1; fast < a.length; fast++) {
        if (a[fast] != a[slow]) {
            slow++;
            a[slow] = a[fast];
        }
    }
    return slow + 1; // count of unique values
}`,
        cpp: `int removeDuplicates(vector<int>& a) {
    if (a.empty()) return 0;
    int slow = 0;
    for (int fast = 1; fast < (int)a.size(); fast++) {
        if (a[fast] != a[slow]) {
            slow++;
            a[slow] = a[fast];
        }
    }
    return slow + 1; // count of unique values
}`,
        time: "O(n)",
        space: "O(1)",
      },
      {
        title: "Container With Most Water",
        logic: "Area is limited by the shorter wall. Moving the taller wall can never help, so always move the shorter one.",
        java: `int maxArea(int[] h) {
    int l = 0, r = h.length - 1, best = 0;
    while (l < r) {
        int area = Math.min(h[l], h[r]) * (r - l);
        best = Math.max(best, area);
        if (h[l] < h[r]) l++; else r--;
    }
    return best;
}`,
        cpp: `int maxArea(vector<int>& h) {
    int l = 0, r = h.size() - 1, best = 0;
    while (l < r) {
        int area = min(h[l], h[r]) * (r - l);
        best = max(best, area);
        if (h[l] < h[r]) l++; else r--;
    }
    return best;
}`,
        time: "O(n)",
        space: "O(1)",
      },
    ],
    gotchas: [
      "Two pointers on an UNSORTED array for pair-sum doesn't work — sort first (lose original indices) or use a HashMap.",
      "For 3Sum, skip duplicates after sorting or you'll return repeated triplets.",
      "Loop condition is usually l < r (not ≤) — a pair needs two distinct indices.",
    ],
    practice: [
      { name: "Valid Palindrome", level: "Easy" },
      { name: "Container With Most Water", level: "Medium" },
      { name: "3Sum", level: "Medium", lc: "3sum" },
      { name: "Sort Colors", level: "Medium" },
      { name: "Trapping Rain Water", level: "Hard" },
    ],
    labs: ["two-sum"],
  },
  {
    slug: "sliding-window",
    num: 3,
    title: "Sliding Window",
    emoji: "🪟",
    tone: "mint",
    tier: "Must",
    tagline: "Grow on the right, shrink on the left — each element touched at most twice.",
    analogy:
      "You're on a train looking through a window. As the train moves, one new tree enters on the right and one leaves on the left. You don't re-count all the trees in view — you just add the new one and remove the old one.",
    concept:
      "A window is a contiguous subarray/substring [left..right]. Expand right to include more. When the window breaks a rule, move left forward to shrink it. Because both pointers only move forward, the total work is O(n) instead of checking every subarray in O(n²) or O(n³).",
    whenToUse: [
      "Contiguous subarray/substring with longest / shortest / max / min / count.",
      "Fixed window size k (moving average, max sum of k elements).",
      "Variable window with a validity rule (at most k distinct, no repeats, sum ≥ target).",
    ],
    signals: ["contiguous", "subarray", "substring", "window", "longest", "shortest", "at most k", "consecutive"],
    thought:
      "Two flavours: (1) Fixed size k — add the new element, remove the one that fell off. (2) Variable — add from the right; while the window is invalid, remove from the left; then record the answer.",
    desi: "Problem me \"contiguous\" ya \"substring/subarray\" + \"longest/shortest/max sum\" dikhe to Sliding Window. Right se add karo, jab tak invalid hai left se remove karo.",
    template: [
      "for right in 0..n-1: add a[right] to window",
      "while window invalid: remove a[left], left++",
      "answer = best(answer, right - left + 1)",
    ],
    examples: [
      {
        title: "Longest substring without repeating characters",
        java: `int lengthOfLongestSubstring(String s) {
    Set<Character> window = new HashSet<>();
    int left = 0, best = 0;
    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);
        // duplicate inside window -> shrink from the left
        while (window.contains(c)) {
            window.remove(s.charAt(left));
            left++;
        }
        window.add(c);
        best = Math.max(best, right - left + 1);
    }
    return best;
}`,
        cpp: `int lengthOfLongestSubstring(string s) {
    unordered_set<char> window;
    int left = 0, best = 0;
    for (int right = 0; right < (int)s.size(); right++) {
        char c = s[right];
        // duplicate inside window -> shrink from the left
        while (window.count(c)) {
            window.erase(s[left]);
            left++;
        }
        window.insert(c);
        best = max(best, right - left + 1);
    }
    return best;
}`,
        time: "O(n)",
        space: "O(min(n, charset))",
      },
      {
        title: "Max sum subarray of size k (fixed window)",
        java: `int maxSum(int[] a, int k) {
    int sum = 0;
    for (int i = 0; i < k; i++) sum += a[i];   // first window
    int best = sum;
    for (int i = k; i < a.length; i++) {
        sum += a[i] - a[i - k];  // add new, drop old
        best = Math.max(best, sum);
    }
    return best;
}`,
        cpp: `int maxSum(vector<int>& a, int k) {
    int sum = 0;
    for (int i = 0; i < k; i++) sum += a[i];   // first window
    int best = sum;
    for (int i = k; i < (int)a.size(); i++) {
        sum += a[i] - a[i - k];  // add new, drop old
        best = max(best, sum);
    }
    return best;
}`,
        time: "O(n)",
        space: "O(1)",
      },
    ],
    gotchas: [
      "Sliding window needs the rule to be monotonic: shrinking must never make an invalid window \"more invalid\". With negative numbers in sum problems, use prefix sums instead.",
      "Update the answer at the right moment — after shrinking for \"longest\", during shrinking for \"shortest\".",
    ],
    practice: [
      { name: "Best Time to Buy and Sell Stock", level: "Easy" },
      { name: "Longest Repeating Character Replacement", level: "Medium" },
      { name: "Permutation in String", level: "Medium" },
      { name: "Fruit Into Baskets", level: "Medium" },
      { name: "Minimum Window Substring", level: "Hard" },
    ],
    labs: ["max-sum-k", "longest-unique"],
  },
  {
    slug: "hashing",
    num: 4,
    title: "Hashing (HashMap / HashSet)",
    emoji: "🗂️",
    tone: "sun",
    tier: "Must",
    tagline: "\"Have I seen this before?\" — answered instantly.",
    analogy:
      "A library with a magic index card box: tell the box a book title and it opens the exact drawer immediately. No walking through every shelf. That's a hash map: key → drawer → value in O(1).",
    concept:
      "A hash function turns a key into an array index, so put/get/contains are O(1) on average. HashSet stores just keys; HashMap stores key → value. You trade O(n) memory for massive time savings.",
    whenToUse: [
      "Counting frequencies.",
      "Checking duplicates / membership.",
      "Finding a complement (Two Sum on unsorted data).",
      "Grouping by a signature (anagrams).",
      "Caching results (memoization uses a map too).",
    ],
    signals: ["count", "frequency", "duplicate", "seen before", "unique", "anagram", "complement", "group"],
    thought:
      "Whenever you're comparing every element with every other one (O(n²)), ask: \"Can I store earlier elements in a map and look them up in O(1)?\" 90% of the time the answer is yes — O(n²) becomes O(n) at the cost of O(n) space.",
    desi: "Jab O(n²) me har element ko har dusre se compare kar rahe ho, socho: \"kya pehle wale elements ko map me store karke O(1) me lookup kar sakta hoon?\"",
    ops: [
      { op: "Insert / update", java: "map.put(k, v)", cpp: "mp[k] = v", time: "O(1) avg" },
      { op: "Lookup", java: "map.get(k), getOrDefault", cpp: "mp.find(k), mp.count(k)", time: "O(1) avg" },
      { op: "Increment count", java: "map.merge(k, 1, Integer::sum)", cpp: "mp[k]++", time: "O(1) avg" },
      { op: "Set membership", java: "set.contains(x)", cpp: "st.count(x)", time: "O(1) avg" },
    ],
    examples: [
      {
        title: "Two Sum (unsorted) — the classic",
        java: `int[] twoSum(int[] a, int target) {
    Map<Integer, Integer> seen = new HashMap<>(); // value -> index
    for (int i = 0; i < a.length; i++) {
        int need = target - a[i];           // complement
        if (seen.containsKey(need))
            return new int[]{ seen.get(need), i };
        seen.put(a[i], i);
    }
    return new int[]{-1, -1};
}`,
        cpp: `vector<int> twoSum(vector<int>& a, int target) {
    unordered_map<int, int> seen; // value -> index
    for (int i = 0; i < (int)a.size(); i++) {
        int need = target - a[i];           // complement
        if (seen.count(need))
            return { seen[need], i };
        seen[a[i]] = i;
    }
    return {-1, -1};
}`,
        time: "O(n)",
        space: "O(n)",
      },
      {
        title: "Group Anagrams",
        logic: "All anagrams share the same signature — the sorted string. Use it as the key and every anagram lands in the same bucket.",
        java: `List<List<String>> groupAnagrams(String[] strs) {
    Map<String, List<String>> map = new HashMap<>();
    for (String s : strs) {
        char[] c = s.toCharArray();
        Arrays.sort(c);
        String key = new String(c);
        map.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
    }
    return new ArrayList<>(map.values());
}`,
        cpp: `vector<vector<string>> groupAnagrams(vector<string>& strs) {
    unordered_map<string, vector<string>> mp;
    for (auto& s : strs) {
        string key = s;
        sort(key.begin(), key.end());
        mp[key].push_back(s);
    }
    vector<vector<string>> res;
    for (auto& [k, group] : mp) res.push_back(group);
    return res;
}`,
        time: "O(n · k log k)",
        space: "O(n · k)",
      },
    ],
    gotchas: [
      "Check the map BEFORE inserting the current element in Two Sum, or a number may pair with itself.",
      "In C++, mp[k] on a missing key inserts a default value — use find/count to just check.",
      "Java Integer caching: compare Integer objects with .equals(), not == (values above 127 break).",
    ],
    practice: [
      { name: "Contains Duplicate", level: "Easy" },
      { name: "Valid Anagram", level: "Easy" },
      { name: "Top K Frequent Elements", level: "Medium" },
      { name: "Longest Consecutive Sequence", level: "Medium" },
      { name: "Subarray Sum Equals K", level: "Medium" },
    ],
    labs: ["two-sum", "single-number", "subarray-sum-k"],
  },
  {
    slug: "prefix-sum",
    num: 5,
    title: "Prefix Sum",
    emoji: "➕",
    tone: "peach",
    tier: "Must",
    tagline: "Pre-compute once, answer any range sum in O(1).",
    analogy:
      "Your phone's step counter shows the total steps since morning. Want steps between 2 PM and 5 PM? Total at 5 PM minus total at 2 PM. No need to replay the whole afternoon.",
    concept:
      "prefix[i] = a[0] + … + a[i-1]. Then sum(i..j) = prefix[j+1] − prefix[i]. Combined with a HashMap of prefix sums, you can count subarrays with sum k in one pass — even with negative numbers (where sliding window fails).",
    whenToUse: [
      "Many range-sum queries on a static array.",
      "\"Number of subarrays with sum = k\" (especially with negatives).",
      "2D grid region sums.",
      "Balance problems: equal 0s and 1s → treat 0 as −1.",
    ],
    signals: ["range sum", "sum between", "subarray sum equals", "queries", "cumulative"],
    thought:
      "sum(i..j) = k means prefix[j] − prefix[i] = k, i.e. prefix[i] = prefix[j] − k. So at each position, ask the map: how many earlier prefixes equal (currentSum − k)?",
    desi: "Subarray ka sum = k poocha hai? Prefix sum + HashMap combo yaad rakho: har point pe check karo ki (currentSum − k) map me kitni baar aaya.",
    examples: [
      {
        title: "Build prefix array & range query",
        java: `int[] build(int[] a) {
    int[] pre = new int[a.length + 1];
    for (int i = 0; i < a.length; i++) pre[i + 1] = pre[i] + a[i];
    return pre;
}
int rangeSum(int[] pre, int i, int j) {   // inclusive i..j
    return pre[j + 1] - pre[i];
}`,
        cpp: `vector<int> build(vector<int>& a) {
    vector<int> pre(a.size() + 1, 0);
    for (int i = 0; i < (int)a.size(); i++) pre[i + 1] = pre[i] + a[i];
    return pre;
}
int rangeSum(vector<int>& pre, int i, int j) {   // inclusive i..j
    return pre[j + 1] - pre[i];
}`,
        time: "O(n) build, O(1) query",
        space: "O(n)",
      },
      {
        title: "Subarray Sum Equals K (count)",
        java: `int subarraySum(int[] a, int k) {
    Map<Integer, Integer> count = new HashMap<>();
    count.put(0, 1);           // empty prefix
    int sum = 0, ans = 0;
    for (int x : a) {
        sum += x;
        ans += count.getOrDefault(sum - k, 0);
        count.merge(sum, 1, Integer::sum);
    }
    return ans;
}`,
        cpp: `int subarraySum(vector<int>& a, int k) {
    unordered_map<int, int> count;
    count[0] = 1;              // empty prefix
    int sum = 0, ans = 0;
    for (int x : a) {
        sum += x;
        if (count.count(sum - k)) ans += count[sum - k];
        count[sum]++;
    }
    return ans;
}`,
        time: "O(n)",
        space: "O(n)",
      },
    ],
    gotchas: [
      "Don't forget count[0] = 1 — it represents subarrays starting at index 0.",
      "Prefix sums can overflow int for big inputs — use long / long long.",
      "Off-by-one: with a size n+1 prefix array, sum(i..j) = pre[j+1] − pre[i].",
    ],
    practice: [
      { name: "Range Sum Query - Immutable", level: "Easy" },
      { name: "Product of Array Except Self", level: "Medium" },
      { name: "Contiguous Array", level: "Medium" },
      { name: "Continuous Subarray Sum", level: "Medium" },
      { name: "Subarray Sum Equals K", level: "Medium" },
    ],
    labs: ["subarray-sum-k"],
  },
  {
    slug: "binary-search",
    num: 6,
    title: "Binary Search",
    emoji: "🔍",
    tone: "grape",
    tier: "Must",
    tagline: "Cut the search space in half, every single step.",
    analogy:
      "Guess my number between 1 and 1000. Say 500 → \"higher\". Say 750 → \"lower\". Every guess throws away half the numbers, so 10 guesses are always enough (2¹⁰ = 1024).",
    concept:
      "On a sorted (or monotonic) space, look at the middle. Decide which half can't contain the answer and discard it. n elements need only log₂(n) steps. It also works on an ANSWER space: if \"speed s works\" implies \"speed s+1 works\", binary search on s.",
    whenToUse: [
      "Input is sorted (or rotated sorted).",
      "\"Find the minimum / maximum value such that a condition holds\" (binary search on answer).",
      "Searching first/last occurrence, insert position, peak element.",
    ],
    signals: ["sorted", "minimum possible", "maximum possible", "at least", "at most", "log n", "rotated"],
    thought:
      "Sorted → binary search. The real power: when a yes/no condition is monotonic over the answer range (false false false true true true), you can binary search for the first true — e.g. Koko's minimum eating speed.",
    desi: "Sorted dekha → binary search. Asli power: jab answer ki range pe condition monotonic ho, tab bhi binary search lagti hai — jaise \"minimum speed to finish in H hours\".",
    template: ["lo = 0, hi = n - 1", "while lo <= hi: mid = lo + (hi - lo) / 2", "if a[mid] == target return mid", "else discard the half that can't contain target"],
    examples: [
      {
        title: "Classic binary search",
        java: `int search(int[] a, int target) {
    int lo = 0, hi = a.length - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;   // overflow-safe
        if (a[mid] == target) return mid;
        else if (a[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}`,
        cpp: `int search(vector<int>& a, int target) {
    int lo = 0, hi = a.size() - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;   // overflow-safe
        if (a[mid] == target) return mid;
        else if (a[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}
// STL: binary_search, lower_bound, upper_bound`,
        time: "O(log n)",
        space: "O(1)",
      },
      {
        title: "Binary search on answer — Koko Eating Bananas",
        logic: "If Koko finishes at speed s, she also finishes at any speed > s. Monotonic → binary search the smallest speed that works.",
        java: `int minEatingSpeed(int[] piles, int h) {
    int lo = 1, hi = 0;
    for (int p : piles) hi = Math.max(hi, p);
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        long hours = 0;
        for (int p : piles) hours += (p + mid - 1) / mid; // ceil
        if (hours <= h) hi = mid;   // works, try slower
        else lo = mid + 1;          // too slow, go faster
    }
    return lo;
}`,
        cpp: `int minEatingSpeed(vector<int>& piles, int h) {
    int lo = 1, hi = *max_element(piles.begin(), piles.end());
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        long long hours = 0;
        for (int p : piles) hours += (p + mid - 1) / mid; // ceil
        if (hours <= h) hi = mid;   // works, try slower
        else lo = mid + 1;          // too slow, go faster
    }
    return lo;
}`,
        time: "O(n log maxPile)",
        space: "O(1)",
      },
    ],
    gotchas: [
      "mid = (lo + hi) / 2 can overflow — always use lo + (hi − lo) / 2.",
      "Pick ONE loop style and stick to it: `lo <= hi` with `hi = mid − 1`, or `lo < hi` with `hi = mid`.",
      "Infinite loop alert: with `lo < hi` and `lo = mid`, use mid = lo + (hi − lo + 1) / 2.",
    ],
    practice: [
      { name: "Binary Search", level: "Easy" },
      { name: "Search in Rotated Sorted Array", level: "Medium" },
      { name: "Find Minimum in Rotated Sorted Array", level: "Medium" },
      { name: "Find First and Last Position of Element in Sorted Array", level: "Medium" },
      { name: "Koko Eating Bananas", level: "Medium" },
      { name: "Median of Two Sorted Arrays", level: "Hard" },
    ],
    labs: ["search-sorted"],
    games: ["number-guess"],
  },
  {
    slug: "sorting",
    num: 7,
    title: "Sorting",
    emoji: "📶",
    tone: "sky",
    tier: "Strong",
    tagline: "Sorting first often makes the rest of the problem easy.",
    analogy:
      "Sorting a deck of cards: Bubble sort keeps swapping neighbours (slow). Insertion sort is how you sort cards in your hand. Merge sort splits the deck among friends, each sorts a small pile, then you merge the piles.",
    concept:
      "In interviews you mostly call the library sort — but you must know why it's O(n log n) and what \"stable\" means. Merge sort: divide & conquer, always O(n log n), stable, O(n) extra. Quick sort: partition around a pivot, avg O(n log n), worst O(n²), in-place. Heap sort: O(n log n), in-place, unstable. Comparison sorting can't beat O(n log n).",
    whenToUse: [
      "Sorting makes pairs/neighbours meaningful → then two pointers or greedy.",
      "Intervals: sort by start (or end).",
      "Custom order with a comparator.",
      "Counting/bucket sort when values are small integers (O(n + k)).",
    ],
    signals: ["order", "arrange", "kth", "largest", "meeting", "schedule", "closest"],
    thought:
      "Does sorting make the problem easy? Sort first in O(n log n), then a linear pass with two pointers or greedy. Need a custom order? Pass a comparator.",
    desi: "Sort karke problem aasan ho rahi hai? To pehle sort karo (O(n log n)) — phir two pointer/greedy lagega.",
    ops: [
      { op: "Sort array", java: "Arrays.sort(a)", cpp: "sort(a.begin(), a.end())", time: "O(n log n)" },
      { op: "Sort descending", java: "Arrays.sort(boxed, Collections.reverseOrder())", cpp: "sort(a.rbegin(), a.rend())", time: "O(n log n)" },
      { op: "Stable sort", java: "Collections.sort / Arrays.sort(Object[])", cpp: "stable_sort", time: "O(n log n)" },
      { op: "Partial: kth element", java: "PriorityQueue", cpp: "nth_element", time: "O(n) avg (C++)" },
    ],
    examples: [
      {
        title: "Custom sorting with comparators",
        java: `// intervals by start time
Arrays.sort(intervals, (x, y) -> Integer.compare(x[0], y[0]));

// strings by length, then alphabetically
words.sort(Comparator.comparingInt(String::length)
                     .thenComparing(Comparator.naturalOrder()));

// descending (needs Integer[], not int[])
Integer[] nums = {3, 1, 2};
Arrays.sort(nums, Collections.reverseOrder());`,
        cpp: `// intervals by start time
sort(intervals.begin(), intervals.end(),
     [](auto& x, auto& y) { return x[0] < y[0]; });

// strings by length, then alphabetically
sort(words.begin(), words.end(), [](auto& a, auto& b) {
    if (a.size() != b.size()) return a.size() < b.size();
    return a < b;
});

// descending
sort(nums.begin(), nums.end(), greater<int>());`,
        time: "O(n log n)",
        space: "O(log n) – O(n)",
      },
      {
        title: "Merge Sort (know how it works)",
        java: `void mergeSort(int[] a, int l, int r) {
    if (l >= r) return;
    int m = l + (r - l) / 2;
    mergeSort(a, l, m);
    mergeSort(a, m + 1, r);
    int[] tmp = new int[r - l + 1];
    int i = l, j = m + 1, k = 0;
    while (i <= m && j <= r) tmp[k++] = a[i] <= a[j] ? a[i++] : a[j++];
    while (i <= m) tmp[k++] = a[i++];
    while (j <= r) tmp[k++] = a[j++];
    System.arraycopy(tmp, 0, a, l, tmp.length);
}`,
        cpp: `void mergeSort(vector<int>& a, int l, int r) {
    if (l >= r) return;
    int m = l + (r - l) / 2;
    mergeSort(a, l, m);
    mergeSort(a, m + 1, r);
    vector<int> tmp;
    int i = l, j = m + 1;
    while (i <= m && j <= r) tmp.push_back(a[i] <= a[j] ? a[i++] : a[j++]);
    while (i <= m) tmp.push_back(a[i++]);
    while (j <= r) tmp.push_back(a[j++]);
    copy(tmp.begin(), tmp.end(), a.begin() + l);
}`,
        time: "O(n log n)",
        space: "O(n)",
      },
    ],
    gotchas: [
      "Java: Comparators work on objects only — int[] can't be sorted descending directly; use Integer[] or sort and reverse.",
      "Comparator (a, b) -> a - b can overflow for big values; use Integer.compare(a, b).",
      "C++ comparators must be strict weak ordering: use <, never <=.",
    ],
    practice: [
      { name: "Sort an Array", level: "Medium" },
      { name: "Merge Intervals", level: "Medium" },
      { name: "Largest Number", level: "Medium" },
      { name: "Sort Characters By Frequency", level: "Medium" },
      { name: "Kth Largest Element in an Array", level: "Medium" },
    ],
    labs: ["sorting-race", "kth-largest"],
  },
  {
    slug: "linked-list",
    num: 8,
    title: "Linked List",
    emoji: "🔗",
    tone: "mint",
    tier: "Must",
    tagline: "A chain of nodes — it's all about re-wiring pointers carefully.",
    analogy:
      "A treasure hunt: each clue tells you where the next clue is hidden. You can't jump to clue #7 directly; you follow the chain. But inserting a new clue is easy — just change where one clue points.",
    concept:
      "Each node holds a value and a reference to the next node. No random access (O(n) to reach index i), but insert/delete is O(1) once you're at the node. Interviews test whether you can re-link pointers without losing the rest of the list.",
    whenToUse: [
      "Reversal (whole list or in groups).",
      "Cycle detection, finding the middle (fast & slow pointers).",
      "Merging sorted lists, nth node from end.",
      "O(1) insert/delete in designs like LRU Cache (doubly linked list + HashMap).",
    ],
    signals: ["linked list", "node.next", "cycle", "middle", "reverse", "reorder", "nth from end"],
    thought:
      "Two super-tricks: (1) Dummy node — when the head might change, start with a fake node so you never special-case the head. (2) Fast & slow — fast moves 2 steps, slow 1. When fast hits the end, slow is in the middle; if there's a cycle, they meet (Floyd).",
    desi: "Do super-important tricks: Dummy node (head badal sakta ho to) aur Fast & Slow pointers (fast 2x speed pe, cycle ho to dono milenge).",
    examples: [
      {
        title: "Node definition",
        java: `class ListNode {
    int val;
    ListNode next;
    ListNode(int v) { val = v; }
}`,
        cpp: `struct ListNode {
    int val;
    ListNode* next;
    ListNode(int v) : val(v), next(nullptr) {}
};`,
        time: "—",
        space: "—",
      },
      {
        title: "Reverse a linked list (iterative)",
        logic: "Three pointers: prev, curr, and next (saved before we break the link). Flip each arrow one by one.",
        java: `ListNode reverse(ListNode head) {
    ListNode prev = null, curr = head;
    while (curr != null) {
        ListNode next = curr.next; // save the rest
        curr.next = prev;          // flip the arrow
        prev = curr;               // move prev
        curr = next;               // move curr
    }
    return prev; // new head
}`,
        cpp: `ListNode* reverse(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* curr = head;
    while (curr) {
        ListNode* next = curr->next; // save the rest
        curr->next = prev;           // flip the arrow
        prev = curr;                 // move prev
        curr = next;                 // move curr
    }
    return prev; // new head
}`,
        time: "O(n)",
        space: "O(1)",
      },
      {
        title: "Detect cycle (Floyd's tortoise & hare)",
        java: `boolean hasCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;        // 1 step
        fast = fast.next.next;   // 2 steps
        if (slow == fast) return true; // they met: cycle
    }
    return false;
}`,
        cpp: `bool hasCycle(ListNode* head) {
    ListNode *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;          // 1 step
        fast = fast->next->next;    // 2 steps
        if (slow == fast) return true; // they met: cycle
    }
    return false;
}`,
        time: "O(n)",
        space: "O(1)",
      },
      {
        title: "Merge two sorted lists (dummy node)",
        java: `ListNode merge(ListNode a, ListNode b) {
    ListNode dummy = new ListNode(0), tail = dummy;
    while (a != null && b != null) {
        if (a.val <= b.val) { tail.next = a; a = a.next; }
        else { tail.next = b; b = b.next; }
        tail = tail.next;
    }
    tail.next = (a != null) ? a : b;
    return dummy.next;
}`,
        cpp: `ListNode* merge(ListNode* a, ListNode* b) {
    ListNode dummy(0);
    ListNode* tail = &dummy;
    while (a && b) {
        if (a->val <= b->val) { tail->next = a; a = a->next; }
        else { tail->next = b; b = b->next; }
        tail = tail->next;
    }
    tail->next = a ? a : b;
    return dummy.next;
}`,
        time: "O(n + m)",
        space: "O(1)",
      },
    ],
    gotchas: [
      "Always save curr.next before overwriting it.",
      "Check fast != null && fast.next != null before fast.next.next.",
      "C++: you own the memory — delete removed nodes in real code (interviews usually skip it).",
    ],
    practice: [
      { name: "Reverse Linked List", level: "Easy" },
      { name: "Merge Two Sorted Lists", level: "Easy" },
      { name: "Linked List Cycle", level: "Easy" },
      { name: "Remove Nth Node From End of List", level: "Medium" },
      { name: "Reorder List", level: "Medium" },
      { name: "LRU Cache", level: "Medium" },
      { name: "Merge k Sorted Lists", level: "Hard" },
    ],
    labs: ["reverse-list"],
  },
  {
    slug: "stack-queue",
    num: 9,
    title: "Stack & Queue",
    emoji: "🥞",
    tone: "peach",
    tier: "Strong",
    tagline: "LIFO plates and FIFO lines — plus the magic monotonic stack.",
    analogy:
      "Stack = a pile of pancakes: you eat the top one first (Last In, First Out). Queue = the line at a chai stall: first person in line is served first (First In, First Out).",
    concept:
      "Stack: push/pop/peek at the top in O(1). Queue: offer at the back, poll from the front in O(1). A monotonic stack keeps elements in increasing/decreasing order; when a new element breaks the order, popped elements just found their \"next greater/smaller\" answer.",
    whenToUse: [
      "Stack: matching brackets, nested structures, undo, expression evaluation, iterative DFS.",
      "Monotonic stack: next greater/smaller element, daily temperatures, histogram area.",
      "Queue: BFS, level-order traversal, task scheduling.",
      "Deque: sliding window maximum.",
    ],
    signals: ["parentheses", "brackets", "next greater", "previous smaller", "nested", "undo", "evaluate", "level by level"],
    thought:
      "Need the most recent unmatched thing? → Stack. Brackets, nesting, \"next greater element\" — all stack. For monotonic stack: keep indexes whose answer isn't known yet; a new element pops everyone it beats.",
    desi: "\"Sabse recent unmatched cheez\" chahiye → Stack. Monotonic stack: order toote to pop karke answer nikaalo.",
    ops: [
      { op: "Stack", java: "Deque<Integer> st = new ArrayDeque<>(); push/pop/peek", cpp: "stack<int> st; push/pop/top", time: "O(1)" },
      { op: "Queue", java: "Deque<Integer> q = new ArrayDeque<>(); offer/poll/peek", cpp: "queue<int> q; push/pop/front", time: "O(1)" },
      { op: "Deque", java: "ArrayDeque offerFirst/offerLast/pollFirst/pollLast", cpp: "deque<int> push_front/push_back/pop_front/pop_back", time: "O(1)" },
    ],
    examples: [
      {
        title: "Valid Parentheses",
        java: `boolean isValid(String s) {
    Deque<Character> st = new ArrayDeque<>();
    Map<Character, Character> pair = Map.of(')', '(', ']', '[', '}', '{');
    for (char c : s.toCharArray()) {
        if (c == '(' || c == '[' || c == '{') st.push(c);
        else {
            // closing: stack empty or top doesn't match -> invalid
            if (st.isEmpty() || st.pop() != pair.get(c)) return false;
        }
    }
    return st.isEmpty(); // everything matched?
}`,
        cpp: `bool isValid(string s) {
    stack<char> st;
    unordered_map<char, char> pair = {{')', '('}, {']', '['}, {'}', '{'}};
    for (char c : s) {
        if (c == '(' || c == '[' || c == '{') st.push(c);
        else {
            // closing: stack empty or top doesn't match -> invalid
            if (st.empty() || st.top() != pair[c]) return false;
            st.pop();
        }
    }
    return st.empty(); // everything matched?
}`,
        time: "O(n)",
        space: "O(n)",
      },
      {
        title: "Next Greater Element (monotonic stack)",
        java: `int[] nextGreater(int[] a) {
    int[] res = new int[a.length];
    Arrays.fill(res, -1);
    Deque<Integer> st = new ArrayDeque<>(); // indexes
    for (int i = 0; i < a.length; i++) {
        while (!st.isEmpty() && a[i] > a[st.peek()])
            res[st.pop()] = a[i];  // a[i] is their next greater
        st.push(i);
    }
    return res;
}`,
        cpp: `vector<int> nextGreater(vector<int>& a) {
    vector<int> res(a.size(), -1);
    stack<int> st; // indexes
    for (int i = 0; i < (int)a.size(); i++) {
        while (!st.empty() && a[i] > a[st.top()]) {
            res[st.top()] = a[i];  // a[i] is their next greater
            st.pop();
        }
        st.push(i);
    }
    return res;
}`,
        time: "O(n)",
        space: "O(n)",
      },
    ],
    gotchas: [
      "Java: avoid the legacy Stack class — ArrayDeque is faster.",
      "C++: st.pop() returns void — read st.top() first.",
      "Monotonic stack is O(n) even with the inner while — each index is pushed and popped once.",
    ],
    practice: [
      { name: "Valid Parentheses", level: "Easy" },
      { name: "Min Stack", level: "Medium" },
      { name: "Daily Temperatures", level: "Medium" },
      { name: "Evaluate Reverse Polish Notation", level: "Medium" },
      { name: "Largest Rectangle in Histogram", level: "Hard" },
      { name: "Sliding Window Maximum", level: "Hard" },
    ],
    labs: ["valid-parentheses", "next-greater"],
    games: ["bracket-rush"],
  },
  {
    slug: "recursion-backtracking",
    num: 10,
    title: "Recursion & Backtracking",
    emoji: "🌀",
    tone: "grape",
    tier: "Strong",
    tagline: "Choose → Explore → Un-choose. Try everything, undo what fails.",
    analogy:
      "Exploring a maze with chalk: at every fork pick a path and mark it. Dead end? Walk back to the last fork, erase the mark, try the next path. That walking back is backtracking.",
    concept:
      "Recursion: a function solves a problem by calling itself on a smaller version, stopping at a base case. Backtracking builds candidates step by step, and abandons (undoes) a partial candidate as soon as it can't lead to a valid answer. It's how you generate all subsets, permutations and combinations.",
    whenToUse: [
      "\"Generate all\" subsets / permutations / combinations.",
      "Constraint puzzles: N-Queens, Sudoku, word search.",
      "Problems naturally defined on smaller versions of themselves (trees, divide & conquer).",
    ],
    signals: ["all possible", "generate all", "every combination", "permutations", "subsets", "n-queens", "sudoku"],
    thought:
      "Every recursion has (1) a base case — when to stop, and (2) a recursive case — how to shrink the problem. Backtracking template: CHOOSE → EXPLORE → UN-CHOOSE. Picture the decision tree: each node is a choice.",
    desi: "Backtracking template rat lo: CHOOSE (choice lo) → EXPLORE (recurse) → UN-CHOOSE (undo). Decision tree dimaag me draw karo.",
    template: ["if (base case) { record answer; return; }", "for each choice:", "   choose it", "   recurse", "   undo the choice"],
    examples: [
      {
        title: "Subsets (power set)",
        java: `List<List<Integer>> subsets(int[] a) {
    List<List<Integer>> res = new ArrayList<>();
    backtrack(a, 0, new ArrayList<>(), res);
    return res;
}
void backtrack(int[] a, int start, List<Integer> cur, List<List<Integer>> res) {
    res.add(new ArrayList<>(cur));   // every state is a subset
    for (int i = start; i < a.length; i++) {
        cur.add(a[i]);                 // CHOOSE
        backtrack(a, i + 1, cur, res); // EXPLORE
        cur.remove(cur.size() - 1);    // UN-CHOOSE
    }
}`,
        cpp: `void backtrack(vector<int>& a, int start, vector<int>& cur, vector<vector<int>>& res) {
    res.push_back(cur);              // every state is a subset
    for (int i = start; i < (int)a.size(); i++) {
        cur.push_back(a[i]);           // CHOOSE
        backtrack(a, i + 1, cur, res); // EXPLORE
        cur.pop_back();                // UN-CHOOSE
    }
}
vector<vector<int>> subsets(vector<int>& a) {
    vector<vector<int>> res;
    vector<int> cur;
    backtrack(a, 0, cur, res);
    return res;
}`,
        time: "O(n · 2ⁿ)",
        space: "O(n) depth",
      },
      {
        title: "Permutations",
        java: `void dfs(int[] a, boolean[] used, List<Integer> cur, List<List<Integer>> res) {
    if (cur.size() == a.length) {          // base case
        res.add(new ArrayList<>(cur));
        return;
    }
    for (int i = 0; i < a.length; i++) {
        if (used[i]) continue;
        used[i] = true; cur.add(a[i]);     // CHOOSE
        dfs(a, used, cur, res);            // EXPLORE
        used[i] = false;                   // UN-CHOOSE
        cur.remove(cur.size() - 1);
    }
}`,
        cpp: `void dfs(vector<int>& a, vector<bool>& used, vector<int>& cur, vector<vector<int>>& res) {
    if (cur.size() == a.size()) {          // base case
        res.push_back(cur);
        return;
    }
    for (int i = 0; i < (int)a.size(); i++) {
        if (used[i]) continue;
        used[i] = true; cur.push_back(a[i]); // CHOOSE
        dfs(a, used, cur, res);              // EXPLORE
        used[i] = false;                     // UN-CHOOSE
        cur.pop_back();
    }
}`,
        time: "O(n · n!)",
        space: "O(n)",
      },
      {
        title: "N-Queens (count solutions)",
        java: `int count = 0;
void solve(int row, int n, boolean[] col, boolean[] d1, boolean[] d2) {
    if (row == n) { count++; return; }
    for (int c = 0; c < n; c++) {
        if (col[c] || d1[row + c] || d2[row - c + n]) continue; // attacked
        col[c] = d1[row + c] = d2[row - c + n] = true;   // place
        solve(row + 1, n, col, d1, d2);
        col[c] = d1[row + c] = d2[row - c + n] = false;  // remove
    }
}`,
        cpp: `int cnt = 0;
void solve(int row, int n, vector<bool>& col, vector<bool>& d1, vector<bool>& d2) {
    if (row == n) { cnt++; return; }
    for (int c = 0; c < n; c++) {
        if (col[c] || d1[row + c] || d2[row - c + n]) continue; // attacked
        col[c] = d1[row + c] = d2[row - c + n] = true;   // place
        solve(row + 1, n, col, d1, d2);
        col[c] = d1[row + c] = d2[row - c + n] = false;  // remove
    }
}`,
        time: "O(n!)",
        space: "O(n)",
      },
    ],
    gotchas: [
      "Add a COPY of the current list to results (new ArrayList<>(cur)) — otherwise later undo steps erase it.",
      "Missing base case = stack overflow.",
      "Prune early: stop exploring as soon as a partial answer is invalid.",
    ],
    practice: [
      { name: "Subsets", level: "Medium" },
      { name: "Permutations", level: "Medium" },
      { name: "Combination Sum", level: "Medium" },
      { name: "Generate Parentheses", level: "Medium" },
      { name: "Word Search", level: "Medium" },
      { name: "N-Queens", level: "Hard" },
    ],
    labs: ["climbing-stairs"],
    games: ["n-queens", "hanoi"],
  },
  {
    slug: "trees",
    num: 11,
    title: "Trees (Binary Tree & BST)",
    emoji: "🌳",
    tone: "mint",
    tier: "Must",
    tagline: "Ask: what do I do at this node, and what do I need from my children?",
    analogy:
      "A family tree: to find the oldest generation depth, every person asks both kids \"how deep is your family?\", takes the bigger answer and adds 1. Everyone answers the same question — that's recursion on trees.",
    concept:
      "A tree is a hierarchy of nodes; a binary tree node has at most 2 children. In a BST, left < root < right, so search is O(log n) when balanced. 90% of tree problems are recursion: base case on null, recurse left and right, combine.",
    whenToUse: [
      "Hierarchical data, expression trees, file systems.",
      "BST: ordered data with fast search/insert (TreeMap/std::map are balanced BSTs).",
      "DFS traversals for path/height/diameter; BFS for level-by-level views.",
    ],
    signals: ["root", "leaf", "depth", "height", "ancestor", "level order", "BST", "subtree", "path sum"],
    thought:
      "Tree problem = \"what do I do at one node, and what do I need from children?\" Base case: null. BST: use the order (smaller → go left). Level by level → BFS with a queue. Inorder of a BST is sorted.",
    desi: "Tree problem = \"ek node pe kya karna hai, aur children se kya chahiye?\" socho. Level-by-level chahiye to BFS + Queue.",
    template: ["Inorder: Left → Root → Right (BST gives sorted order)", "Preorder: Root → Left → Right (copy / serialize)", "Postorder: Left → Right → Root (bottom-up compute)", "Level order: BFS with a queue"],
    examples: [
      {
        title: "Node + inorder traversal",
        java: `class TreeNode {
    int val; TreeNode left, right;
    TreeNode(int v) { val = v; }
}
void inorder(TreeNode node, List<Integer> out) {
    if (node == null) return;   // base case
    inorder(node.left, out);    // L
    out.add(node.val);          // Root
    inorder(node.right, out);   // R
}`,
        cpp: `struct TreeNode {
    int val; TreeNode *left, *right;
    TreeNode(int v) : val(v), left(nullptr), right(nullptr) {}
};
void inorder(TreeNode* node, vector<int>& out) {
    if (!node) return;          // base case
    inorder(node->left, out);   // L
    out.push_back(node->val);   // Root
    inorder(node->right, out);  // R
}`,
        time: "O(n)",
        space: "O(h)",
      },
      {
        title: "Max depth of binary tree",
        java: `int maxDepth(TreeNode root) {
    if (root == null) return 0;
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
        cpp: `int maxDepth(TreeNode* root) {
    if (!root) return 0;
    return 1 + max(maxDepth(root->left), maxDepth(root->right));
}`,
        time: "O(n)",
        space: "O(h)",
      },
      {
        title: "Level-order traversal (BFS)",
        java: `List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> res = new ArrayList<>();
    if (root == null) return res;
    Queue<TreeNode> q = new LinkedList<>();
    q.offer(root);
    while (!q.isEmpty()) {
        int size = q.size();          // nodes in this level
        List<Integer> level = new ArrayList<>();
        for (int i = 0; i < size; i++) {
            TreeNode n = q.poll();
            level.add(n.val);
            if (n.left != null) q.offer(n.left);
            if (n.right != null) q.offer(n.right);
        }
        res.add(level);
    }
    return res;
}`,
        cpp: `vector<vector<int>> levelOrder(TreeNode* root) {
    vector<vector<int>> res;
    if (!root) return res;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        int size = q.size();          // nodes in this level
        vector<int> level;
        for (int i = 0; i < size; i++) {
            TreeNode* n = q.front(); q.pop();
            level.push_back(n->val);
            if (n->left) q.push(n->left);
            if (n->right) q.push(n->right);
        }
        res.push_back(level);
    }
    return res;
}`,
        time: "O(n)",
        space: "O(n)",
      },
      {
        title: "Validate BST",
        logic: "Each node must fit in a (min, max) window. Going left tightens max, going right tightens min.",
        java: `boolean isValidBST(TreeNode root) {
    return valid(root, Long.MIN_VALUE, Long.MAX_VALUE);
}
boolean valid(TreeNode n, long min, long max) {
    if (n == null) return true;
    if (n.val <= min || n.val >= max) return false;
    return valid(n.left, min, n.val) && valid(n.right, n.val, max);
}`,
        cpp: `bool valid(TreeNode* n, long long lo, long long hi) {
    if (!n) return true;
    if (n->val <= lo || n->val >= hi) return false;
    return valid(n->left, lo, n->val) && valid(n->right, n->val, hi);
}
bool isValidBST(TreeNode* root) {
    return valid(root, LLONG_MIN, LLONG_MAX);
}`,
        time: "O(n)",
        space: "O(h)",
      },
    ],
    gotchas: [
      "Validating a BST by only comparing a node with its direct children is WRONG — use min/max bounds.",
      "Skewed trees have height n, so recursion depth can be O(n).",
      "Use long bounds when node values can be Integer.MIN_VALUE / MAX_VALUE.",
    ],
    practice: [
      { name: "Invert Binary Tree", level: "Easy" },
      { name: "Maximum Depth of Binary Tree", level: "Easy" },
      { name: "Diameter of Binary Tree", level: "Easy" },
      { name: "Binary Tree Level Order Traversal", level: "Medium" },
      { name: "Lowest Common Ancestor of a Binary Tree", level: "Medium" },
      { name: "Kth Smallest Element in a BST", level: "Medium" },
      { name: "Serialize and Deserialize Binary Tree", level: "Hard" },
    ],
    labs: ["tree-traversal"],
  },
];
