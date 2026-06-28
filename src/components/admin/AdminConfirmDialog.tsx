"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import { useEffect, type ReactNode } from "react";

interface AdminConfirmDialogProps {
  open: boolean;
  title: string;
  description: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function AdminConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Xóa",
  cancelLabel = "Hủy",
  loading = false,
  onConfirm,
  onCancel,
}: AdminConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !loading) {
        onCancel();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, loading, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Đóng hộp thoại"
        className="absolute inset-0 bg-black/45 backdrop-blur-[1px]"
        onClick={loading ? undefined : onCancel}
        disabled={loading}
      />

      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="admin-confirm-title"
        aria-describedby="admin-confirm-description"
        className="relative w-full max-w-md overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-2xl"
      >
        <div className="flex items-start gap-4 px-5 py-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50">
            <AlertTriangle className="h-5 w-5 text-red-600" strokeWidth={2.25} />
          </div>

          <div className="min-w-0 flex-1 pt-0.5">
            <h2
              id="admin-confirm-title"
              className="font-serif text-lg font-bold text-neutral-900"
            >
              {title}
            </h2>
            <div
              id="admin-confirm-description"
              className="mt-2 text-sm leading-relaxed text-neutral-600"
            >
              {description}
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-neutral-100 bg-neutral-50/80 px-5 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
