"use client";

import {
  ExternalLink,
  FileText,
  FolderOpen,
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
import { AdminSidebarBrand } from "@/components/public/SiteLogo";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin/dashboard", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/admin/articles", label: "Bài viết", icon: FileText },
  { href: "/admin/categories", label: "Danh mục", icon: FolderOpen },
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
    <aside className="flex h-full w-full flex-col border-r border-neutral-800/50 bg-neutral-950 text-white">
      <div
        className={cn(
          "border-b border-white/10 py-4",
          collapsed ? "flex flex-col items-center gap-2 px-2" : "px-3",
        )}
      >
        {collapsed ? (
          <>
            <AdminSidebarBrand collapsed onNavigate={onNavigate} />
            {onToggleCollapsed ? (
              <button
                type="button"
                onClick={onToggleCollapsed}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
                title="Mở rộng menu"
              >
                <PanelLeftOpen className="h-4 w-4" />
              </button>
            ) : null}
          </>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <AdminSidebarBrand onNavigate={onNavigate} />
            {onToggleCollapsed ? (
              <button
                type="button"
                onClick={onToggleCollapsed}
                className="shrink-0 rounded-lg p-2 text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
                title="Thu gọn menu"
              >
                <PanelLeftClose className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        )}
      </div>

      <nav
        className={cn(
          "flex-1 space-y-0.5 py-3",
          collapsed ? "px-1.5" : "px-2",
        )}
      >
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={cn(
                "group relative flex items-center rounded-lg text-sm font-medium transition-colors",
                collapsed
                  ? "mx-auto h-10 w-10 justify-center"
                  : "gap-2.5 px-3 py-2.5",
                active
                  ? "bg-white/10 text-white"
                  : "text-neutral-400 hover:bg-white/5 hover:text-white",
              )}
              title={collapsed ? label : undefined}
            >
              {active && !collapsed ? (
                <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-brand-700" />
              ) : null}
              <Icon className="h-4 w-4 shrink-0" strokeWidth={active ? 2.25 : 2} />
              <span className={cn(collapsed && "sr-only")}>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div
        className={cn(
          "space-y-0.5 border-t border-white/10 py-3",
          collapsed ? "px-1.5" : "px-2",
        )}
      >
        <Link
          href="/"
          target="_blank"
          className={cn(
            "flex items-center rounded-lg text-sm font-medium text-neutral-400 transition-colors hover:bg-white/5 hover:text-white",
            collapsed
              ? "mx-auto h-10 w-10 justify-center"
              : "gap-2.5 px-3 py-2.5",
          )}
          title={collapsed ? "Xem trang web" : undefined}
        >
          <ExternalLink className="h-4 w-4 shrink-0" />
          <span className={cn(collapsed && "sr-only")}>Xem trang web</span>
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className={cn(
            "flex items-center rounded-lg text-sm font-medium text-neutral-400 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-50",
            collapsed
              ? "mx-auto h-10 w-10 justify-center"
              : "w-full gap-2.5 px-3 py-2.5",
          )}
          title={collapsed ? "Đăng xuất" : undefined}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span className={cn(collapsed && "sr-only")}>
            {loggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
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
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Đóng menu"
      />
      <div className="absolute left-0 top-0 h-full w-60 shadow-2xl">
        <div className="flex justify-end p-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-neutral-400 hover:bg-white/10 hover:text-white"
            aria-label="Đóng menu"
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
      className="rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 lg:hidden"
      aria-label="Mở menu"
    >
      <Menu className="h-5 w-5" />
    </button>
  );
}
