"use client";

import {
  ExternalLink,
  FileText,
  FolderOpen,
  Image,
  LayoutDashboard,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/articles", label: "Articles", icon: FileText },
  { href: "/admin/categories", label: "Categories", icon: FolderOpen },
  { href: "/admin/media", label: "Media", icon: Image },
];

interface AdminSidebarProps {
  onNavigate?: () => void;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
}

export default function AdminSidebar({
  onNavigate,
  collapsed = false,
  onToggleCollapsed,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  function isActive(href: string) {
    if (href === "/admin/dashboard") {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <aside className="flex h-full flex-col bg-neutral-900 text-white">
      <div className="border-b border-neutral-800 px-3 py-4">
        <div className="flex items-start justify-between gap-2">
          <Link
            href="/admin/dashboard"
            className={cn(
              "min-w-0 font-serif text-lg font-bold tracking-tight",
              collapsed && "sr-only",
            )}
            onClick={onNavigate}
          >
            Website News
          </Link>
          {onToggleCollapsed && (
            <button
              type="button"
              onClick={onToggleCollapsed}
              className="rounded-lg p-2 text-neutral-300 hover:bg-neutral-800 hover:text-white"
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
        <p className={cn("mt-0.5 text-xs text-neutral-400", collapsed && "sr-only")}>
          Admin CMS
        </p>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              collapsed && "justify-center px-2",
              isActive(href)
                ? "bg-brand-800 text-white"
                : "text-neutral-300 hover:bg-neutral-800 hover:text-white",
            )}
            title={collapsed ? label : undefined}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className={cn(collapsed && "sr-only")}>{label}</span>
          </Link>
        ))}
      </nav>

      <div className="space-y-1 border-t border-neutral-800 px-3 py-4">
        <Link
          href="/"
          target="_blank"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-white",
            collapsed && "justify-center px-2",
          )}
          title={collapsed ? "View Website" : undefined}
        >
          <ExternalLink className="h-4 w-4 shrink-0" />
          <span className={cn(collapsed && "sr-only")}>View Website</span>
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-white disabled:opacity-50",
            collapsed && "justify-center px-2",
          )}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span className={cn(collapsed && "sr-only")}>
            {loggingOut ? "Logging out..." : "Logout"}
          </span>
        </button>
      </div>
    </aside>
  );
}

interface AdminMobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function AdminMobileNav({ open, onClose }: AdminMobileNavProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-label="Close menu"
      />
      <div className="absolute left-0 top-0 h-full w-64 shadow-xl">
        <div className="flex justify-end p-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-white hover:bg-neutral-800"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <AdminSidebar onNavigate={onClose} />
      </div>
    </div>
  );
}

export function AdminMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 lg:hidden"
      aria-label="Open menu"
    >
      <Menu className="h-5 w-5" />
    </button>
  );
}
