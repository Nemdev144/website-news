import { ChevronLeft, ChevronRight } from "lucide-react";
import { AdminButton } from "./AdminButton";

interface AdminPaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  loading?: boolean;
  itemLabel?: string;
  onPageChange: (page: number) => void;
}

export default function AdminPagination({
  page,
  totalPages,
  total,
  limit,
  loading,
  itemLabel = "mục",
  onPageChange,
}: AdminPaginationProps) {
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-neutral-200/90 bg-white px-4 py-3 text-sm text-neutral-600 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <p>
        Hiển thị{" "}
        <span className="font-medium text-neutral-900">
          {start}-{end}
        </span>{" "}
        / <span className="font-medium text-neutral-900">{total}</span>{" "}
        {itemLabel}
      </p>
      <div className="flex items-center gap-2">
        <AdminButton
          variant="secondary"
          onClick={() => onPageChange(Math.max(page - 1, 1))}
          disabled={page <= 1 || loading}
          className="px-3 py-1.5"
        >
          <ChevronLeft className="h-4 w-4" />
          Trước
        </AdminButton>
        <span className="min-w-24 text-center text-neutral-500">
          Trang {page} / {totalPages}
        </span>
        <AdminButton
          variant="secondary"
          onClick={() => onPageChange(Math.min(page + 1, totalPages))}
          disabled={page >= totalPages || loading}
          className="px-3 py-1.5"
        >
          Sau
          <ChevronRight className="h-4 w-4" />
        </AdminButton>
      </div>
    </div>
  );
}
