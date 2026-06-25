import { getCurrentAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdmin();
  if (admin) {
    redirect("/admin");
  }

  return children;
}
