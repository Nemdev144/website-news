import { cn } from "@/lib/utils";

interface DistributionItem {
  label: string;
  value: number;
  color: string;
}

interface DistributionBarProps {
  title: string;
  items: DistributionItem[];
  total: number;
}

export default function DistributionBar({
  title,
  items,
  total,
}: DistributionBarProps) {
  const safeTotal = total > 0 ? total : 1;

  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h2 className="font-serif text-lg font-bold text-neutral-900">{title}</h2>
      <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-neutral-100">
        {items.map((item) => (
          <div
            key={item.label}
            className={cn("h-full transition-all", item.color)}
            style={{ width: `${(item.value / safeTotal) * 100}%` }}
            title={`${item.label}: ${item.value}`}
          />
        ))}
      </div>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item.label} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <span className={cn("h-2.5 w-2.5 rounded-full", item.color)} />
              {item.label}
            </div>
            <div className="text-right">
              <span className="text-sm font-semibold text-neutral-900">
                {item.value}
              </span>
              <span className="ml-2 text-xs text-neutral-400">
                {Math.round((item.value / safeTotal) * 100)}%
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
