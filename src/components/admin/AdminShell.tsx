"use client";

import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar, { AdminMobileNav } from "@/components/admin/AdminSidebar";
import type { AdminJwtPayload } from "@/lib/auth";
import { usePathname } from "next/navigation";
import { useState, type CSSProperties, type ReactNode } from "react";

const pageTitles: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/articles": "Articles",
  "/admin/articles/new": "New Article",
  "/admin/categories": "Categories",
  "/admin/media": "Media",
};

function getPageTitle(pathname: string): string {
  if (pageTitles[pathname]) {
    return pageTitles[pathname];
  }
  if (pathname.match(/^\/admin\/articles\/[^/]+\/edit$/)) {
    return "Edit Article";
  }
  return "Admin";
}

interface AdminShellProps {
  admin: AdminJwtPayload;
  children: ReactNode;
}

export default function AdminShell({ admin, children }: AdminShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const title = getPageTitle(pathname);
  const shellStyle = {
    "--admin-sidebar-width": sidebarCollapsed ? "5rem" : "16rem",
  } as CSSProperties;

  return (
    <div className="flex min-h-screen bg-neutral-50" style={shellStyle}>
      <div
        className={`hidden shrink-0 transition-[width] duration-200 lg:block ${
          sidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div
          className={`fixed inset-y-0 transition-[width] duration-200 ${
            sidebarCollapsed ? "w-20" : "w-64"
          }`}
        >
          <AdminSidebar
            collapsed={sidebarCollapsed}
            onToggleCollapsed={() => setSidebarCollapsed((value) => !value)}
          />
        </div>
      </div>

      <AdminMobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader
          title={title}
          adminName={admin.fullName}
          onMenuClick={() => setMobileOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
