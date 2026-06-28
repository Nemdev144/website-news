import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  tone?: "brand" | "green" | "amber" | "blue" | "purple" | "neutral";
}

const toneStyles = {
  brand: "bg-brand-50 text-brand-800 ring-brand-100",
  green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  amber: "bg-amber-50 text-amber-700 ring-amber-100",
  blue: "bg-sky-50 text-sky-700 ring-sky-100",
  purple: "bg-violet-50 text-violet-700 ring-violet-100",
  neutral: "bg-neutral-100 text-neutral-600 ring-neutral-200",
};

export default function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "brand",
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-neutral-200/90 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            {label}
          </p>
          <p className="mt-1.5 font-serif text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
            {value}
          </p>
          {hint && (
            <p className="mt-1 text-xs text-neutral-400">{hint}</p>
          )}
        </div>
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset",
            toneStyles[tone],
          )}
        >
          <Icon className="h-4 w-4" strokeWidth={2.25} />
        </div>
      </div>
    </div>
  );
}
