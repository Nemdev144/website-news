"use client";

import AdminToast from "@/components/admin/AdminToast";
import { ARTICLE_STATUSES, ArticleStatus } from "@/types/cms";
import { cn, formatShortDate, formatViewCount } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Pencil, Plus, Search, Trash2 } from "lucide-react";
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

  useEffect(() => {
    let cancelled = false;

    fetch("/api/admin/categories")
      .then((response) => response.json())
      .then((data: { categories?: CategoryOption[] }) => {
        if (!cancelled) {
          setCategories(data.categories ?? []);
        }
      })
      .catch(() => {
        // Categories filter is optional; ignore load failures here.
      });

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
          setError(data.error ?? "Failed to load articles");
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
          setError("Failed to load articles");
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
        setError(data.error ?? "Failed to load articles");
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
      setError("Failed to load articles");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(article: ArticleRow) {
    if (!window.confirm(`Delete "${article.title}"? This cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/articles/${article.id}`, {
        method: "DELETE",
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Failed to delete article");
        return;
      }
      await reloadArticles();
    } catch {
      setError("Failed to delete article");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-neutral-600">
          Create, edit, and publish news articles.
        </p>
        <Link
          href="/admin/articles/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-800 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-900"
        >
          <Plus className="h-4 w-4" />
          New Article
        </Link>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm sm:flex-row sm:flex-wrap">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-lg border border-neutral-300 py-2 pl-9 pr-3 text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          {ARTICLE_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"
        >
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <AdminToast
        message={error}
        type="error"
        onDismiss={() => setError("")}
      />

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
        {loading ? (
          <p className="p-6 text-sm text-neutral-500">Loading articles...</p>
        ) : articles.length === 0 ? (
          <p className="p-6 text-sm text-neutral-500">No articles found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Published</th>
                  <th className="px-4 py-3 font-medium">Views</th>
                  <th className="px-4 py-3 font-medium">Flags</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {articles.map((article) => (
                  <tr key={article.id} className="hover:bg-neutral-50">
                    <td className="max-w-sm px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/admin/articles/${article.id}/edit`}
                          className="block h-14 w-20 shrink-0 overflow-hidden rounded-md border border-neutral-200 bg-neutral-100"
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
                            <span className="flex h-full w-full items-center justify-center px-2 text-center text-[10px] font-medium uppercase text-neutral-400">
                              No image
                            </span>
                          )}
                        </Link>
                        <Link
                          href={`/admin/articles/${article.id}/edit`}
                          className="line-clamp-2 font-medium text-neutral-900 hover:text-brand-800"
                        >
                          {article.title}
                        </Link>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {article.category.name}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs font-medium",
                          article.status === ArticleStatus.PUBLISHED &&
                            "bg-green-100 text-green-800",
                          article.status === ArticleStatus.DRAFT &&
                            "bg-amber-100 text-amber-800",
                          article.status === ArticleStatus.ARCHIVED &&
                            "bg-neutral-200 text-neutral-600",
                        )}
                      >
                        {article.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-neutral-500">
                      {article.publishedAt
                        ? formatShortDate(article.publishedAt)
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {formatViewCount(article.viewCount)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {article.isFeatured && (
                          <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs text-blue-800">
                            Featured
                          </span>
                        )}
                        {article.isHot && (
                          <span className="rounded bg-red-100 px-1.5 py-0.5 text-xs text-red-800">
                            Hot
                          </span>
                        )}
                        {article.isMostRead && (
                          <span className="rounded bg-purple-100 px-1.5 py-0.5 text-xs text-purple-800">
                            Most Read
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Link
                          href={`/admin/articles/${article.id}/edit`}
                          className="rounded p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(article)}
                          className="rounded p-1.5 text-neutral-500 hover:bg-red-50 hover:text-red-600"
                          title="Delete"
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
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-600 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <p>
          Hiển thị{" "}
          <span className="font-medium text-neutral-900">
            {pagination.total === 0
              ? 0
              : (pagination.page - 1) * pagination.limit + 1}
            -
            {Math.min(pagination.page * pagination.limit, pagination.total)}
          </span>{" "}
          / <span className="font-medium text-neutral-900">{pagination.total}</span>{" "}
          bài viết
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((value) => Math.max(value - 1, 1))}
            disabled={pagination.page <= 1 || loading}
            className="inline-flex items-center gap-1 rounded-lg border border-neutral-300 bg-white px-3 py-2 font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
            Trước
          </button>
          <span className="min-w-24 text-center">
            Trang {pagination.page} / {pagination.totalPages}
          </span>
          <button
            type="button"
            onClick={() =>
              setPage((value) => Math.min(value + 1, pagination.totalPages))
            }
            disabled={pagination.page >= pagination.totalPages || loading}
            className="inline-flex items-center gap-1 rounded-lg border border-neutral-300 bg-white px-3 py-2 font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-40"
          >
            Sau
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
