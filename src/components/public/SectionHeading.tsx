import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  children: React.ReactNode;
  className?: string;
  light?: boolean;
}

export default function SectionHeading({
  children,
  className,
  light = false,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-3 flex items-center gap-2 border-b pb-2",
        light ? "border-white/20" : "border-neutral-200",
        className,
      )}
    >
      <span
        className={cn("h-4 w-1 shrink-0", light ? "bg-brand-300" : "bg-brand-800")}
      />
      <h2
        className={cn(
          "font-sans text-[11px] font-bold uppercase tracking-wider",
          light ? "text-white" : "text-neutral-900",
        )}
      >
        {children}
      </h2>
    </div>
  );
}
