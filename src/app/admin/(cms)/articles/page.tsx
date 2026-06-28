"use client";

import AdminConfirmDialog from "@/components/admin/AdminConfirmDialog";
import AdminToast from "@/components/admin/AdminToast";
import AdminBadge from "@/components/admin/ui/AdminBadge";
import { AdminButtonLink } from "@/components/admin/ui/AdminButton";
import AdminEmptyState from "@/components/admin/ui/AdminEmptyState";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import AdminPagination from "@/components/admin/ui/AdminPagination";
import AdminPanel from "@/components/admin/ui/AdminPanel";
import { adminInputClassName, adminSelectClassName } from "@/components/admin/ui/AdminButton";
import { articleStatusLabel } from "@/lib/admin-labels";
import { ARTICLE_STATUSES, ArticleStatus } from "@/types/cms";
import { formatShortDate, formatViewCount } from "@/lib/utils";
import { FileText, Pencil, Plus, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface CategoryOption {
  id: string;
  name: string;
}

interface ArticleRow {
  id: string;
  title: string;
  slug: string;
  coverImage: string | null;
  status: ArticleStatus;
  publishedAt: string | null;
  viewCount: number;
  isFeatured: boolean;
  isHot: boolean;
  isMostRead: boolean;
  category: { id: string; name: string };
}

interface ArticlePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const ARTICLES_PER_PAGE = 10;

function statusTone(status: ArticleStatus) {
  if (status === ArticleStatus.PUBLISHED) return "green" as const;
  if (status === ArticleStatus.DRAFT) return "amber" as const;
  return "neutral" as const;
}

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<ArticleRow[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<ArticlePagination>({
    page: 1,
    limit: ARTICLES_PER_PAGE,
    total: 0,
    totalPages: 1,
  });
  const [deleteTarget, setDeleteTarget] = useState<ArticleRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/admin/categories")
      .then((response) => response.json())
      .then((data: { categories?: CategoryOption[] }) => {
        if (!cancelled) {
          setCategories(data.categories ?? []);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (statusFilter) params.set("status", statusFilter);
    if (categoryFilter) params.set("categoryId", categoryFilter);
    params.set("page", String(page));
    params.set("limit", String(ARTICLES_PER_PAGE));

    fetch(`/api/admin/articles?${params.toString()}`)
      .then(async (response) => ({
        response,
        data: (await response.json()) as {
          articles?: ArticleRow[];
          pagination?: ArticlePagination;
          error?: string;
        },
      }))
      .then(({ response, data }) => {
        if (cancelled) return;
        if (!response.ok) {
          setError(data.error ?? "Không tải được danh sách bài viết");
          return;
        }
        setError("");
        setArticles(data.articles ?? []);
        setPagination(
          data.pagination ?? {
            page,
            limit: ARTICLES_PER_PAGE,
            total: data.articles?.length ?? 0,
            totalPages: 1,
          },
        );
      })
      .catch(() => {
        if (!cancelled) {
          setError("Không tải được danh sách bài viết");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [search, statusFilter, categoryFilter, page]);

  async function reloadArticles() {
    setLoading(true);
    setError("");
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (statusFilter) params.set("status", statusFilter);
    if (categoryFilter) params.set("categoryId", categoryFilter);
    params.set("page", String(page));
    params.set("limit", String(ARTICLES_PER_PAGE));

    try {
      const response = await fetch(`/api/admin/articles?${params.toString()}`);
      const data = (await response.json()) as {
        articles?: ArticleRow[];
        pagination?: ArticlePagination;
        error?: string;
      };
      if (!response.ok) {
        setError(data.error ?? "Không tải được danh sách bài viết");
        return;
      }
      setArticles(data.articles ?? []);
      setPagination(
        data.pagination ?? {
          page,
          limit: ARTICLES_PER_PAGE,
          total: data.articles?.length ?? 0,
          totalPages: 1,
        },
      );
    } catch {
      setError("Không tải được danh sách bài viết");
    } finally {
      setLoading(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/articles/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Không xóa được bài viết");
        return;
      }
      setDeleteTarget(null);
      await reloadArticles();
    } catch {
      setError("Không xóa được bài viết");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-4">
      <AdminPageHeader
        title="Bài viết"
        description="Tạo, chỉnh sửa và xuất bản tin tức."
        actions={
          <AdminButtonLink href="/admin/articles/new" variant="primary">
            <Plus className="h-4 w-4" />
            Viết bài mới
          </AdminButtonLink>
        }
      />

      <AdminPanel padding="sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <div className="relative min-w-[200px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Tìm theo tiêu đề..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className={adminInputClassName("pl-9")}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className={adminSelectClassName("sm:w-40")}
          >
            <option value="">Mọi trạng thái</option>
            {ARTICLE_STATUSES.map((status) => (
              <option key={status} value={status}>
                {articleStatusLabel(status)}
              </option>
            ))}
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className={adminSelectClassName("sm:w-44")}
          >
            <option value="">Mọi danh mục</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </AdminPanel>

      <AdminToast
        message={error}
        type="error"
        onDismiss={() => setError("")}
      />

      <AdminPanel>
        {loading || articles.length === 0 ? (
          <AdminEmptyState
            loading={loading}
            icon={FileText}
            message={
              loading
                ? "Đang tải bài viết..."
                : "Không tìm thấy bài viết nào."
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table w-full min-w-[860px] text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-100 text-xs uppercase tracking-wide text-neutral-500">
                  <th className="px-4 py-3 font-medium">Tiêu đề</th>
                  <th className="hidden px-4 py-3 font-medium md:table-cell">
                    Danh mục
                  </th>
                  <th className="px-4 py-3 font-medium">Trạng thái</th>
                  <th className="hidden px-4 py-3 font-medium lg:table-cell">
                    Ngày đăng
                  </th>
                  <th className="hidden px-4 py-3 font-medium sm:table-cell">
                    Lượt xem
                  </th>
                  <th className="hidden px-4 py-3 font-medium xl:table-cell">
                    Nhãn
                  </th>
                  <th className="px-4 py-3 font-medium text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {articles.map((article) => (
                  <tr
                    key={article.id}
                    className="transition-colors hover:bg-neutral-50/80"
                  >
                    <td className="max-w-xs px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/admin/articles/${article.id}/edit`}
                          className="block h-12 w-[4.5rem] shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100"
                          title={article.title}
                        >
                          {article.coverImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={article.coverImage}
                              alt={article.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="flex h-full w-full items-center justify-center text-[9px] font-medium uppercase text-neutral-400">
                              —
                            </span>
                          )}
                        </Link>
                        <div className="min-w-0">
                          <Link
                            href={`/admin/articles/${article.id}/edit`}
                            className="line-clamp-2 font-medium text-neutral-900 hover:text-brand-800"
                          >
                            {article.title}
                          </Link>
                          <p className="mt-0.5 text-xs text-neutral-400 md:hidden">
                            {article.category.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 text-neutral-600 md:table-cell">
                      {article.category.name}
                    </td>
                    <td className="px-4 py-3">
                      <AdminBadge tone={statusTone(article.status)}>
                        {articleStatusLabel(article.status)}
                      </AdminBadge>
                    </td>
                    <td className="hidden px-4 py-3 text-neutral-500 lg:table-cell">
                      {article.publishedAt
                        ? formatShortDate(article.publishedAt)
                        : "—"}
                    </td>
                    <td className="hidden px-4 py-3 tabular-nums text-neutral-600 sm:table-cell">
                      {formatViewCount(article.viewCount)}
                    </td>
                    <td className="hidden px-4 py-3 xl:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {article.isFeatured && (
                          <AdminBadge tone="blue">Nổi bật</AdminBadge>
                        )}
                        {article.isHot && (
                          <AdminBadge tone="red">Nóng</AdminBadge>
                        )}
                        {article.isMostRead && (
                          <AdminBadge tone="purple">Đọc nhiều</AdminBadge>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-0.5">
                        <Link
                          href={`/admin/articles/${article.id}/edit`}
                          className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
                          title="Sửa"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(article)}
                          className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600"
                          title="Xóa"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminPanel>

      {!loading && articles.length > 0 && (
        <AdminPagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          limit={pagination.limit}
          loading={loading}
          itemLabel="bài viết"
          onPageChange={setPage}
        />
      )}

      <AdminConfirmDialog
        open={!!deleteTarget}
        title="Xóa bài viết?"
        description={
          <>
            Bạn có chắc muốn xóa{" "}
            <span className="font-semibold text-neutral-900">
              &ldquo;{deleteTarget?.title}&rdquo;
            </span>
            ? Hành động này không thể hoàn tác.
          </>
        }
        confirmLabel="Xóa bài viết"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => {
          if (!deleting) setDeleteTarget(null);
        }}
      />
    </div>
  );
}
