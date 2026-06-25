"use client";

import { AdminMenuButton } from "@/components/admin/AdminSidebar";

interface AdminHeaderProps {
  title: string;
  adminName: string;
  onMenuClick: () => void;
}

export default function AdminHeader({
  title,
  adminName,
  onMenuClick,
}: AdminHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex items-center gap-3">
        <AdminMenuButton onClick={onMenuClick} />
        <h1 className="font-serif text-xl font-bold text-neutral-900">{title}</h1>
      </div>
      <div className="text-sm text-neutral-600">
        <span className="hidden sm:inline">Signed in as </span>
        <span className="font-medium text-neutral-900">{adminName}</span>
      </div>
    </header>
  );
}
