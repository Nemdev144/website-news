"use client";

import AdminToast from "@/components/admin/AdminToast";
import ArticleContentEditor from "@/components/admin/ArticleContentEditor";
import AdminPanel from "@/components/admin/ui/AdminPanel";
import { AdminButton, adminInputClassName } from "@/components/admin/ui/AdminButton";
import { articleStatusLabel } from "@/lib/admin-labels";
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
  redirectOnSave?: boolean;
}

export default function ArticleForm({
  articleId,
  initialValues,
  initialContent = "",
  redirectOnSave = true,
}: ArticleFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [form, setForm] = useState<ArticleFormValues>({
    ...defaultValues,
    ...initialValues,
  });
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>(() =>
    parseArticleContent(initialContent),
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
          <AdminButton
            variant="secondary"
            onClick={() => router.push("/admin/articles")}
          >
            <ArrowLeft className="h-4 w-4" />
            Danh sách
          </AdminButton>
          <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-600">
            {isEditing ? "Chỉnh sửa" : "Bài mới"}
          </span>
        </div>

        {isEditing && form.slug && (
          <a
            href={articlePath(form.slug)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
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
          <AdminPanel padding="md">
            <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-neutral-500">
              Tiêu đề *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
              placeholder="Nhập tiêu đề bài viết"
              className="w-full border-0 border-b border-neutral-200 px-0 pb-3 font-serif text-2xl font-bold leading-tight outline-none placeholder:text-neutral-300 focus:border-brand-700 sm:text-3xl"
            />

            <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px]">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Tóm tắt
                </label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, excerpt: e.target.value }))
                  }
                  rows={3}
                  placeholder="Tóm tắt ngắn hiển thị ngoài danh sách tin"
                  className={adminInputClassName("resize-none leading-6")}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Slug *
                </label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => {
                    setSlugEdited(true);
                    setForm((prev) => ({ ...prev, slug: e.target.value }));
                  }}
                  required
                  className={adminInputClassName("font-mono text-xs")}
                />
              </div>
            </div>
          </AdminPanel>

          <AdminPanel padding="md">
            <ArticleContentEditor
              blocks={contentBlocks}
              onChange={setContentBlocks}
              onUploadImage={uploadImage}
              articleTitle={form.title}
            />
          </AdminPanel>
        </main>

        <aside className="space-y-4 xl:sticky xl:top-20 xl:self-start">
          <AdminPanel padding="md">
            <h2 className="mb-4 font-serif text-base font-bold text-neutral-900">
              Xuất bản
            </h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Danh mục *
                </label>
                <select
                  value={form.categoryId}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, categoryId: e.target.value }))
                  }
                  required
                  className={adminInputClassName()}
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
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
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
                  className={adminInputClassName()}
                >
                  {ARTICLE_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {articleStatusLabel(status)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Ngày xuất bản
                </label>
                <input
                  type="datetime-local"
                  value={form.publishedAt}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, publishedAt: e.target.value }))
                  }
                  className={adminInputClassName()}
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <label className="flex min-h-10 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-neutral-200 px-2 text-xs font-medium transition-colors has-[:checked]:border-brand-200 has-[:checked]:bg-brand-50">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        isFeatured: e.target.checked,
                      }))
                    }
                    className="rounded border-neutral-300 text-brand-800"
                  />
                  Nổi bật
                </label>
                <label className="flex min-h-10 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-neutral-200 px-2 text-xs font-medium transition-colors has-[:checked]:border-red-200 has-[:checked]:bg-red-50">
                  <input
                    type="checkbox"
                    checked={form.isHot}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, isHot: e.target.checked }))
                    }
                    className="rounded border-neutral-300 text-brand-800"
                  />
                  Nóng
                </label>
                <label className="flex min-h-10 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-neutral-200 px-2 text-xs font-medium transition-colors has-[:checked]:border-violet-200 has-[:checked]:bg-violet-50">
                  <input
                    type="checkbox"
                    checked={form.isMostRead}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        isMostRead: e.target.checked,
                      }))
                    }
                    className="rounded border-neutral-300 text-brand-800"
                  />
                  Đọc nhiều
                </label>
              </div>
            </div>
          </AdminPanel>

          <AdminPanel padding="md">
            <div className="mb-3 flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-brand-800" />
              <h2 className="font-serif text-base font-bold text-neutral-900">
                Ảnh đại diện
              </h2>
            </div>
            <p className="mb-3 text-xs leading-relaxed text-neutral-500">
              Chỉ hiển thị trên trang chủ, danh mục và thẻ tin — không xuất hiện
              trong nội dung bài viết.
            </p>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={form.coverImage}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, coverImage: e.target.value }))
                }
                placeholder="/images/..."
                className={adminInputClassName("font-mono text-xs")}
              />
              <label className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100">
                Tải ảnh từ máy
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
            <div className="mt-3 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
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
          </AdminPanel>

          <AdminPanel padding="md">
            <h2 className="mb-4 font-serif text-base font-bold text-neutral-900">
              Tác giả
            </h2>
            <div className="space-y-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Tác giả
                </label>
                <input
                  type="text"
                  value={form.author}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, author: e.target.value }))
                  }
                  className={adminInputClassName()}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Nguồn
                </label>
                <input
                  type="text"
                  value={form.source}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, source: e.target.value }))
                  }
                  className={adminInputClassName()}
                />
              </div>
            </div>
          </AdminPanel>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 flex justify-end gap-2 border-t border-neutral-200/80 bg-white/95 px-4 py-3 shadow-[0_-4px_20px_rgba(15,23,42,0.06)] backdrop-blur sm:px-6 lg:left-[var(--admin-sidebar-width)]">
        <AdminButton
          variant="secondary"
          onClick={() => router.push("/admin/articles")}
        >
          <X className="h-4 w-4" />
          Hủy
        </AdminButton>
        <AdminButton type="submit" variant="primary" disabled={loading}>
          <Save className="h-4 w-4" />
          {loading ? "Đang lưu..." : isEditing ? "Lưu thay đổi" : "Tạo bài viết"}
        </AdminButton>
      </div>
    </form>
  );
}
