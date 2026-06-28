"use client";

import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar, { AdminMobileNav } from "@/components/admin/AdminSidebar";
import type { AdminJwtPayload } from "@/lib/auth";
import { useState, type CSSProperties, type ReactNode } from "react";

interface AdminShellProps {
  admin: AdminJwtPayload;
  children: ReactNode;
}

export default function AdminShell({ admin, children }: AdminShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const shellStyle = {
    "--admin-sidebar-width": sidebarCollapsed ? "5rem" : "15rem",
  } as CSSProperties;

  return (
    <div
      className="admin-shell flex min-h-screen bg-[#f4f4f5]"
      style={shellStyle}
    >
      <div
        className={`hidden shrink-0 transition-[width] duration-200 lg:block ${
          sidebarCollapsed ? "w-20" : "w-60"
        }`}
      >
        <div
          className={`fixed inset-y-0 z-30 transition-[width] duration-200 ${
            sidebarCollapsed ? "w-20" : "w-60"
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
          adminName={admin.fullName}
          onMenuClick={() => setMobileOpen(true)}
        />
        <main className="mx-auto w-full max-w-[1400px] flex-1 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
