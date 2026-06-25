"use client";

import { AlertCircle, CheckCircle2, X } from "lucide-react";
import { useEffect } from "react";

interface AdminToastProps {
  message: string;
  type?: "success" | "error";
  onDismiss: () => void;
}

export default function AdminToast({
  message,
  type = "success",
  onDismiss,
}: AdminToastProps) {
  useEffect(() => {
    if (!message) return;

    const timer = window.setTimeout(onDismiss, 3500);
    return () => window.clearTimeout(timer);
  }, [message, onDismiss]);

  if (!message) return null;

  const isError = type === "error";
  const Icon = isError ? AlertCircle : CheckCircle2;

  return (
    <div className="fixed right-4 top-4 z-[80] flex w-[min(320px,calc(100vw-2rem))] items-start gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 shadow-lg">
      <Icon
        className={
          isError
            ? "mt-0.5 h-4 w-4 shrink-0 text-red-600"
            : "mt-0.5 h-4 w-4 shrink-0 text-green-600"
        }
      />
      <p className="min-w-0 flex-1 leading-5">{message}</p>
      <button
        type="button"
        onClick={onDismiss}
        className="rounded p-0.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
        aria-label="Đóng thông báo"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
