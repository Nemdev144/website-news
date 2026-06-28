"use client";

import { AdminMenuButton } from "@/components/admin/AdminSidebar";

interface AdminHeaderProps {
  adminName: string;
  onMenuClick: () => void;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "A";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function AdminHeader({
  adminName,
  onMenuClick,
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-neutral-200/80 bg-white/90 px-4 py-2.5 backdrop-blur-md sm:px-6">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <AdminMenuButton onClick={onMenuClick} />
          <span className="hidden text-sm font-medium text-neutral-500 sm:inline">
            Website News · CMS
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2.5">
          <div className="hidden text-right sm:block">
            <p className="text-xs text-neutral-500">Xin chào</p>
            <p className="text-sm font-medium text-neutral-900">{adminName}</p>
          </div>
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-800 text-xs font-bold text-white ring-2 ring-brand-100"
            title={adminName}
          >
            {getInitials(adminName)}
          </div>
        </div>
      </div>
    </header>
  );
}
