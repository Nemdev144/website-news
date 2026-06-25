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
  blue: "bg-blue-50 text-blue-700 ring-blue-100",
  purple: "bg-purple-50 text-purple-700 ring-purple-100",
  neutral: "bg-neutral-100 text-neutral-700 ring-neutral-200",
};

export default function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "brand",
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-neutral-500">{label}</p>
          <p className="mt-2 font-serif text-3xl font-bold tracking-tight text-neutral-900">
            {value}
          </p>
          {hint && (
            <p className="mt-1 text-xs text-neutral-400">{hint}</p>
          )}
        </div>
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset",
            toneStyles[tone],
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
