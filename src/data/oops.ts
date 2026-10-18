import type { Tone } from "@/components/ui";

export type Pillar = { name: string; emoji: string; tone: Tone; analogy: string; idea: string; java: string; cpp: string };

export const PILLARS: Pillar[] = [
  {
    name: "Encapsulation",
    emoji: "💊",
    tone: "sun",
    analogy: "A medicine capsule hides the bitter powder inside. You just swallow it — you can't mess with the contents directly.",
    idea: "Keep data private and expose safe methods. The object protects its own rules (balance can never go negative).",
    java: `class BankAccount {
    private double balance;            // hidden data

    public void deposit(double amt) {
        if (amt <= 0) throw new IllegalArgumentException("positive only");
        balance += amt;
    }
    public boolean withdraw(double amt) {
        if (amt > balance) return false;   // rule enforced inside
        balance -= amt;
        return true;
    }
    public double getBalance() { return balance; }
}`,
    cpp: `class BankAccount {
private:
    double balance = 0;                // hidden data
public:
    void deposit(double amt) {
        if (amt <= 0) throw invalid_argument("positive only");
        balance += amt;
    }
    bool withdraw(double amt) {
        if (amt > balance) return false;   // rule enforced inside
        balance -= amt;
        return true;
    }
    double getBalance() const { return balance; }
};`,
  },
  {
    name: "Abstraction",
    emoji: "🚗",
    tone: "sky",
    analogy: "You drive a car with a steering wheel and pedals. You don't need to know how the fuel injection works.",
    idea: "Show WHAT an object does, hide HOW. Abstract classes / interfaces define the contract; subclasses fill in details.",
    java: `interface Shape {
    double area();                     // what, not how
}
class Circle implements Shape {
    private final double r;
    Circle(double r) { this.r = r; }
    public double area() { return Math.PI * r * r; }
}
class Rect implements Shape {
    private final double w, h;
    Rect(double w, double h) { this.w = w; this.h = h; }
    public double area() { return w * h; }
}`,
    cpp: `class Shape {
public:
    virtual double area() const = 0;   // pure virtual = abstract
    virtual ~Shape() = default;
};
class Circle : public Shape {
    double r;
public:
    Circle(double r) : r(r) {}
    double area() const override { return M_PI * r * r; }
};
class Rect : public Shape {
    double w, h;
public:
    Rect(double w, double h) : w(w), h(h) {}
    double area() const override { return w * h; }
};`,
  },
  {
    name: "Inheritance",
    emoji: "👨‍👧",
    tone: "mint",
    analogy: "A child inherits eye colour from parents but can still learn their own skills.",
    idea: "A subclass reuses the parent's fields and methods (IS-A relationship) and adds or changes behaviour.",
    java: `class Animal {
    protected String name;
    Animal(String name) { this.name = name; }
    void eat() { System.out.println(name + " is eating"); }
}
class Dog extends Animal {             // Dog IS-A Animal
    Dog(String name) { super(name); }
    void bark() { System.out.println(name + ": Woof!"); }
}
// new Dog("Bruno").eat();  -> inherited`,
    cpp: `class Animal {
protected:
    string name;
public:
    Animal(string name) : name(name) {}
    void eat() { cout << name << " is eating\\n"; }
};
class Dog : public Animal {            // Dog IS-A Animal
public:
    Dog(string name) : Animal(name) {}
    void bark() { cout << name << ": Woof!\\n"; }
};
// Dog("Bruno").eat();  -> inherited`,
  },
  {
    name: "Polymorphism",
    emoji: "🎭",
    tone: "bubble",
    analogy: "The same \"speak()\" button makes a dog bark and a cat meow. One interface, many forms.",
    idea: "Runtime polymorphism = overriding (decided by the real object type). Compile-time polymorphism = overloading (same name, different parameters).",
    java: `class Animal { String speak() { return "..."; } }
class Dog extends Animal { @Override String speak() { return "Woof"; } }
class Cat extends Animal { @Override String speak() { return "Meow"; } }

List<Animal> zoo = List.of(new Dog(), new Cat());
for (Animal a : zoo) System.out.println(a.speak()); // Woof, Meow

// overloading: same name, different params
int add(int a, int b) { return a + b; }
double add(double a, double b) { return a + b; }`,
    cpp: `class Animal {
public:
    virtual string speak() const { return "..."; }  // virtual!
    virtual ~Animal() = default;
};
class Dog : public Animal { public: string speak() const override { return "Woof"; } };
class Cat : public Animal { public: string speak() const override { return "Meow"; } };

vector<unique_ptr<Animal>> zoo;
zoo.push_back(make_unique<Dog>());
zoo.push_back(make_unique<Cat>());
for (auto& a : zoo) cout << a->speak() << "\\n";  // Woof, Meow

// overloading
int add(int a, int b) { return a + b; }
double add(double a, double b) { return a + b; }`,
  },
];

export const DSA_OOP = [
  {
    title: "Custom ordering: Comparable / Comparator vs operator<",
    why: "Heaps, TreeMaps and sorting need to know how to compare YOUR objects.",
    java: `class Task implements Comparable<Task> {
    String name; int priority;
    Task(String n, int p) { name = n; priority = p; }
    @Override
    public int compareTo(Task o) {           // natural order
        return Integer.compare(priority, o.priority);
    }
}
PriorityQueue<Task> pq = new PriorityQueue<>();             // uses compareTo
PriorityQueue<Task> byName =
    new PriorityQueue<>(Comparator.comparing(t -> t.name)); // custom`,
    cpp: `struct Task {
    string name; int priority;
    bool operator<(const Task& o) const {    // natural order
        return priority < o.priority;
    }
};
// priority_queue is a MAX-heap: use greater<> for smallest first
priority_queue<Task, vector<Task>, greater<Task>> pq;  // needs operator>
// or a lambda comparator:
auto cmp = [](const Task& a, const Task& b) { return a.name > b.name; };
priority_queue<Task, vector<Task>, decltype(cmp)> byName(cmp);`,
  },
  {
    title: "Design a data structure: Min Stack",
    why: "\"Design\" questions are OOP: hide two stacks behind a clean API with O(1) getMin.",
    java: `class MinStack {
    private final Deque<Integer> st = new ArrayDeque<>();
    private final Deque<Integer> mins = new ArrayDeque<>();

    public void push(int x) {
        st.push(x);
        mins.push(mins.isEmpty() ? x : Math.min(x, mins.peek()));
    }
    public void pop()    { st.pop(); mins.pop(); }
    public int top()     { return st.peek(); }
    public int getMin()  { return mins.peek(); }
}`,
    cpp: `class MinStack {
    stack<int> st, mins;
public:
    void push(int x) {
        st.push(x);
        mins.push(mins.empty() ? x : min(x, mins.top()));
    }
    void pop()   { st.pop(); mins.pop(); }
    int top()    { return st.top(); }
    int getMin() { return mins.top(); }
};`,
  },
  {
    title: "LRU Cache (HashMap + doubly linked list)",
    why: "The most famous OOP + DSA question. Map gives O(1) lookup, the list keeps usage order with O(1) moves.",
    java: `class LRUCache {
    private class Node { int key, val; Node prev, next; Node(int k, int v) { key = k; val = v; } }
    private final int cap;
    private final Map<Integer, Node> map = new HashMap<>();
    private final Node head = new Node(0, 0), tail = new Node(0, 0); // dummies

    LRUCache(int capacity) { cap = capacity; head.next = tail; tail.prev = head; }

    private void remove(Node n) { n.prev.next = n.next; n.next.prev = n.prev; }
    private void addFront(Node n) { n.next = head.next; n.prev = head; head.next.prev = n; head.next = n; }

    public int get(int key) {
        Node n = map.get(key);
        if (n == null) return -1;
        remove(n); addFront(n);              // mark as recently used
        return n.val;
    }
    public void put(int key, int value) {
        if (map.containsKey(key)) remove(map.get(key));
        Node n = new Node(key, value);
        map.put(key, n); addFront(n);
        if (map.size() > cap) {              // evict least recently used
            Node lru = tail.prev;
            remove(lru); map.remove(lru.key);
        }
    }
}`,
    cpp: `class LRUCache {
    int cap;
    list<pair<int,int>> order;                         // front = most recent
    unordered_map<int, list<pair<int,int>>::iterator> pos;
public:
    LRUCache(int capacity) : cap(capacity) {}

    int get(int key) {
        auto it = pos.find(key);
        if (it == pos.end()) return -1;
        order.splice(order.begin(), order, it->second); // move to front, O(1)
        return it->second->second;
    }
    void put(int key, int value) {
        if (pos.count(key)) order.erase(pos[key]);
        order.push_front({key, value});
        pos[key] = order.begin();
        if ((int)pos.size() > cap) {                    // evict LRU
            pos.erase(order.back().first);
            order.pop_back();
        }
    }
};`,
  },
];

export const SOLID = [
  { l: "S", name: "Single Responsibility", text: "A class should have one reason to change. Don't mix parsing, storing and printing." },
  { l: "O", name: "Open / Closed", text: "Open for extension, closed for modification — add a new Shape without editing the old ones." },
  { l: "L", name: "Liskov Substitution", text: "A subclass must work anywhere its parent works (a Square that breaks Rectangle's setWidth is a smell)." },
  { l: "I", name: "Interface Segregation", text: "Many small interfaces beat one giant one. A Printer shouldn't be forced to implement fax()." },
  { l: "D", name: "Dependency Inversion", text: "Depend on abstractions (interfaces), not concrete classes. Makes testing and swapping easy." },
];

export const JAVA_VS_CPP = [
  { topic: "Polymorphism", java: "All non-static methods are virtual by default", cpp: "Must mark methods `virtual` (and use `override`)" },
  { topic: "Abstract type", java: "`interface` or `abstract class`", cpp: "Class with a pure virtual method `= 0`" },
  { topic: "Multiple inheritance", java: "Only of interfaces", cpp: "Allowed for classes (watch the diamond problem)" },
  { topic: "Memory", java: "Garbage collected", cpp: "You manage it — prefer `unique_ptr` / `shared_ptr` (RAII)" },
  { topic: "Objects", java: "Always references (heap)", cpp: "Values by default; pointers/references when needed" },
  { topic: "Access default", java: "package-private", cpp: "`class` → private, `struct` → public" },
  { topic: "Destructor", java: "No destructors (try-with-resources)", cpp: "`~ClassName()` — make it virtual in base classes" },
];
