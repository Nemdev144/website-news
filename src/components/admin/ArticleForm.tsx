"use client";

import AdminToast from "@/components/admin/AdminToast";
import ArticleContentEditor from "@/components/admin/ArticleContentEditor";
import { ARTICLE_STATUSES, ArticleStatus } from "@/types/cms";
import {
  contentBlocksAreValid,
  parseArticleContent,
  serializeArticleContent,
  type ContentBlock,
} from "@/lib/article-blocks";
import { generateSlug } from "@/lib/slug";
import { articlePath } from "@/lib/utils";
import { ArrowLeft, ExternalLink, ImageIcon, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

interface CategoryOption {
  id: string;
  name: string;
}

export interface ArticleFormValues {
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  author: string;
  source: string;
  categoryId: string;
  status: ArticleStatus;
  isFeatured: boolean;
  isHot: boolean;
  isMostRead: boolean;
  publishedAt: string;
}

const defaultValues: ArticleFormValues = {
  title: "",
  slug: "",
  excerpt: "",
  coverImage: "",
  author: "Ban biên tập",
  source: "",
  categoryId: "",
  status: ArticleStatus.DRAFT,
  isFeatured: false,
  isHot: false,
  isMostRead: false,
  publishedAt: "",
};

interface ArticleFormProps {
  articleId?: string;
  initialValues?: Partial<ArticleFormValues>;
  initialContent?: string;
  initialLegacyMedia?: Array<{
    url: string;
    title?: string | null;
    caption?: string | null;
  }>;
  redirectOnSave?: boolean;
}

export default function ArticleForm({
  articleId,
  initialValues,
  initialContent = "",
  initialLegacyMedia = [],
  redirectOnSave = true,
}: ArticleFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [form, setForm] = useState<ArticleFormValues>({
    ...defaultValues,
    ...initialValues,
  });
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>(() =>
    parseArticleContent(initialContent, initialLegacyMedia),
  );
  const [slugEdited, setSlugEdited] = useState(Boolean(initialValues?.slug));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const isEditing = Boolean(articleId);

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
        // Category list is optional for initial render.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function handleTitleChange(title: string) {
    setForm((prev) => ({
      ...prev,
      title,
      slug: slugEdited ? prev.slug : generateSlug(title),
    }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!contentBlocksAreValid(contentBlocks)) {
      setError("Nội dung bài viết cần ít nhất một đoạn văn hoặc hình ảnh.");
      return;
    }

    setLoading(true);

    const url = articleId
      ? `/api/admin/articles/${articleId}`
      : "/api/admin/articles";
    const method = articleId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          content: serializeArticleContent(contentBlocks),
          publishedAt: form.publishedAt || null,
        }),
      });

      const data = (await response.json()) as {
        error?: string;
        article?: { id: string };
      };

      if (!response.ok) {
        setError(data.error ?? "Không thể lưu bài viết.");
        return;
      }

      if (redirectOnSave && !articleId) {
        router.push("/admin/articles");
        router.refresh();
        return;
      }

      setSuccess(isEditing ? "Đã lưu thay đổi." : "Đã tạo bài viết.");
      if (redirectOnSave && articleId) {
        router.push("/admin/articles");
        router.refresh();
      }
    } catch {
      setError("Không thể lưu bài viết.");
    } finally {
      setLoading(false);
    }
  }

  async function uploadImage(file: File): Promise<string> {
    setError("");
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/admin/uploads", {
      method: "POST",
      body: formData,
    });
    const data = (await response.json()) as { url?: string; error?: string };

    if (!response.ok || !data.url) {
      const message = data.error ?? "Không thể tải ảnh lên.";
      setError(message);
      throw new Error(message);
    }

    return data.url;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pb-24">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => router.push("/admin/articles")}
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại danh sách
          </button>
          <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-semibold text-neutral-600">
            {isEditing ? "Đang chỉnh sửa" : "Bài mới"}
          </span>
        </div>

        {isEditing && form.slug && (
          <a
            href={articlePath(form.slug)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-50"
          >
            <ExternalLink className="h-4 w-4" />
            Xem bài viết
          </a>
        )}
      </div>

      <AdminToast
        message={error}
        type="error"
        onDismiss={() => setError("")}
      />
      <AdminToast
        message={success}
        type="success"
        onDismiss={() => setSuccess("")}
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <main className="space-y-4">
          <section className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-6">
            <label className="mb-2 block text-sm font-medium">Tiêu đề *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
              placeholder="Nhập tiêu đề bài viết"
              className="w-full border-0 border-b border-neutral-200 px-0 pb-3 font-serif text-3xl font-bold leading-tight outline-none placeholder:text-neutral-300 focus:border-brand-700"
            />

            <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
              <div>
                <label className="mb-1 block text-sm font-medium">Tóm tắt</label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, excerpt: e.target.value }))
                  }
                  rows={3}
                  placeholder="Tóm tắt ngắn để hiển thị ngoài danh sách tin"
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm leading-6"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Slug *</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => {
                    setSlugEdited(true);
                    setForm((prev) => ({ ...prev, slug: e.target.value }));
                  }}
                  required
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-6">
            <ArticleContentEditor
              blocks={contentBlocks}
              onChange={setContentBlocks}
              onUploadImage={uploadImage}
            />
          </section>
        </main>

        <aside className="space-y-4 xl:sticky xl:top-4 xl:self-start">
          <section className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
            <h2 className="mb-4 font-serif text-lg font-bold">Xuất bản</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Danh mục *
                </label>
                <select
                  value={form.categoryId}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, categoryId: e.target.value }))
                  }
                  required
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Trạng thái
                </label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      status: e.target.value as ArticleStatus,
                    }))
                  }
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                >
                  {ARTICLE_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Ngày xuất bản
                </label>
                <input
                  type="datetime-local"
                  value={form.publishedAt}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, publishedAt: e.target.value }))
                  }
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <label className="flex min-h-10 items-center justify-center gap-2 rounded-lg border border-neutral-200 px-2 text-xs font-medium">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        isFeatured: e.target.checked,
                      }))
                    }
                  />
                  Featured
                </label>
                <label className="flex min-h-10 items-center justify-center gap-2 rounded-lg border border-neutral-200 px-2 text-xs font-medium">
                  <input
                    type="checkbox"
                    checked={form.isHot}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, isHot: e.target.checked }))
                    }
                  />
                  Hot
                </label>
                <label className="flex min-h-10 items-center justify-center gap-2 rounded-lg border border-neutral-200 px-2 text-xs font-medium">
                  <input
                    type="checkbox"
                    checked={form.isMostRead}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        isMostRead: e.target.checked,
                      }))
                    }
                  />
                  Most Read
                </label>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-brand-800" />
              <h2 className="font-serif text-lg font-bold">Ảnh đại diện</h2>
            </div>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={form.coverImage}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, coverImage: e.target.value }))
                }
                placeholder="/images/placeholders/world-1.jpg"
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
              />
              <label className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium hover:bg-neutral-50">
                Tải ảnh đại diện từ máy
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={async (event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    try {
                      const url = await uploadImage(file);
                      setForm((prev) => ({ ...prev, coverImage: url }));
                    } finally {
                      event.target.value = "";
                    }
                  }}
                />
              </label>
            </div>
            <div className="mt-3 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50">
              {form.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.coverImage}
                  alt="Ảnh đại diện"
                  className="aspect-[16/9] w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[16/9] items-center justify-center px-4 text-center text-xs text-neutral-400">
                  Nhập URL để xem trước ảnh đại diện.
                </div>
              )}
            </div>
          </section>

          <section className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
            <h2 className="mb-4 font-serif text-lg font-bold">Tác giả</h2>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium">Tác giả</label>
                <input
                  type="text"
                  value={form.author}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, author: e.target.value }))
                  }
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Nguồn</label>
                <input
                  type="text"
                  value={form.source}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, source: e.target.value }))
                  }
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                />
              </div>
            </div>
          </section>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 flex justify-end gap-2 border-t border-neutral-200 bg-neutral-50/95 px-4 py-3 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur sm:px-6 lg:left-[var(--admin-sidebar-width)]">
        <button
          type="button"
          onClick={() => router.push("/admin/articles")}
          className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium hover:bg-neutral-50"
        >
          <X className="h-4 w-4" />
          Quay lại
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-800 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-900 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {loading ? "Đang lưu..." : isEditing ? "Lưu thay đổi" : "Tạo bài viết"}
        </button>
      </div>
    </form>
  );
}
