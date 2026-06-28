import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface AdminPanelProps {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md";
}

const paddingStyles = {
  none: "",
  sm: "p-4",
  md: "p-4 sm:p-5",
};

export default function AdminPanel({
  children,
  className,
  padding = "none",
}: AdminPanelProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-sm",
        paddingStyles[padding],
        className,
      )}
    >
      {children}
    </div>
  );
}

interface AdminPanelHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function AdminPanelHeader({
  title,
  subtitle,
  action,
}: AdminPanelHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-neutral-100 px-4 py-3.5 sm:px-5">
      <div className="min-w-0">
        <h3 className="font-serif text-base font-bold text-neutral-900">{title}</h3>
        {subtitle && (
          <p className="mt-0.5 text-xs text-neutral-500">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}
