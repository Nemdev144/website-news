import type { ReactNode } from "react";

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export default function AdminPageHeader({
  title,
  description,
  actions,
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h2 className="font-serif text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm text-neutral-500">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
      )}
    </div>
  );
}
