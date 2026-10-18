import { Mascot } from "./Mascot";

export function PageSkeleton() {
  return (
    <div className="card flex items-center gap-4 bg-sun-soft p-8">
      <Mascot mood="think" size={80} className="animate-wiggle" />
      <span className="font-hand text-2xl">Loading… thinking in O(1) 🤔</span>
    </div>
  );
}
