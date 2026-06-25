import AdminShell from "@/components/admin/AdminShell";
import { getCurrentAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminCmsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/login");
  }

  return <AdminShell admin={admin}>{children}</AdminShell>;
}
