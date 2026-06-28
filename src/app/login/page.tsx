"use client";

import AdminToast from "@/components/admin/AdminToast";
import { adminInputClassName } from "@/components/admin/ui/AdminButton";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState, Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(data.error ?? "Đăng nhập thất bại");
        return;
      }

      const from = searchParams.get("from");
      router.push(from?.startsWith("/admin") ? from : "/admin");
      router.refresh();
    } catch {
      setError("Không kết nối được. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 py-8">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-900/30 via-neutral-950 to-neutral-950" />

      <div className="relative w-full max-w-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-800 font-serif text-lg font-bold text-white shadow-lg shadow-brand-900/30">
            WN
          </div>
          <h1 className="font-serif text-2xl font-bold text-white">
            Website News
          </h1>
          <p className="mt-1 text-sm text-neutral-400">Đăng nhập quản trị</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 bg-white p-6 shadow-2xl"
        >
          <AdminToast
            message={error}
            type="error"
            onDismiss={() => setError("")}
          />

          <div className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="mb-1.5 block text-sm font-medium text-neutral-700"
              >
                Tên đăng nhập
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
                className={adminInputClassName()}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-neutral-700"
              >
                Mật khẩu
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className={adminInputClassName()}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-brand-800 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-900 disabled:opacity-50"
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-neutral-950">
          <p className="text-sm text-neutral-400">Đang tải...</p>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
