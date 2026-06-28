import type { LucideIcon } from "lucide-react";

interface AdminEmptyStateProps {
  icon?: LucideIcon;
  message: string;
  loading?: boolean;
}

export default function AdminEmptyState({
  icon: Icon,
  message,
  loading,
}: AdminEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-14 text-center">
      {loading ? (
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-brand-800" />
      ) : Icon ? (
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400">
          <Icon className="h-5 w-5" />
        </div>
      ) : null}
      <p className="text-sm text-neutral-500">{message}</p>
    </div>
  );
}
