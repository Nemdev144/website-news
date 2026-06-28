import { cn } from "@/lib/utils";

type BadgeTone =
  | "green"
  | "amber"
  | "neutral"
  | "blue"
  | "red"
  | "purple";

const toneStyles: Record<BadgeTone, string> = {
  green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  amber: "bg-amber-50 text-amber-700 ring-amber-100",
  neutral: "bg-neutral-100 text-neutral-600 ring-neutral-200",
  blue: "bg-sky-50 text-sky-700 ring-sky-100",
  red: "bg-red-50 text-red-700 ring-red-100",
  purple: "bg-violet-50 text-violet-700 ring-violet-100",
};

interface AdminBadgeProps {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
}

export default function AdminBadge({
  children,
  tone = "neutral",
  className,
}: AdminBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset",
        toneStyles[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
