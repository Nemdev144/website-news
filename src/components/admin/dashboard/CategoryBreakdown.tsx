interface CategoryBreakdownItem {
  name: string;
  count: number;
  percentage: number;
}

interface CategoryBreakdownProps {
  items: CategoryBreakdownItem[];
}

export default function CategoryBreakdown({ items }: CategoryBreakdownProps) {
  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h2 className="font-serif text-lg font-bold text-neutral-900">
        Articles by Category
      </h2>
      <ul className="mt-4 space-y-3">
        {items.length === 0 ? (
          <li className="text-sm text-neutral-500">No category data yet.</li>
        ) : (
          items.map((item) => (
            <li key={item.name}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium text-neutral-700">{item.name}</span>
                <span className="text-neutral-500">{item.count}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
                <div
                  className="h-full rounded-full bg-brand-800 transition-all"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
