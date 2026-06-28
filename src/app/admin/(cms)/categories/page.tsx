"use client";

import AdminConfirmDialog from "@/components/admin/AdminConfirmDialog";
import AdminToast from "@/components/admin/AdminToast";
import AdminBadge from "@/components/admin/ui/AdminBadge";
import { AdminButton, adminInputClassName } from "@/components/admin/ui/AdminButton";
import AdminEmptyState from "@/components/admin/ui/AdminEmptyState";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import AdminPanel from "@/components/admin/ui/AdminPanel";
import { generateSlug } from "@/lib/slug";
import { FolderOpen, Pencil, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  _count?: { articles: number };
}

interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
}

const emptyForm: CategoryFormData = {
  name: "",
  slug: "",
  description: "",
  sortOrder: 0,
  isActive: true,
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryFormData>(emptyForm);
  const [slugEdited, setSlugEdited] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/admin/categories")
      .then(async (response) => ({
        response,
        data: (await response.json()) as {
          categories?: Category[];
          error?: string;
        },
      }))
      .then(({ response, data }) => {
        if (cancelled) return;
        if (!response.ok) {
          setError(data.error ?? "Failed to load categories");
          return;
        }
        setError("");
        setCategories(data.categories ?? []);
      })
      .catch(() => {
        if (!cancelled) {
          setError("Failed to load categories");
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
  }, []);

  async function reloadCategories() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/categories");
      const data = (await response.json()) as {
        categories?: Category[];
        error?: string;
      };
      if (!response.ok) {
        setError(data.error ?? "Failed to load categories");
        return;
      }
      setCategories(data.categories ?? []);
    } catch {
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setSlugEdited(false);
    setFormError("");
    setFormOpen(true);
  }

  function openEdit(category: Category) {
    setEditingId(category.id);
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description ?? "",
      sortOrder: category.sortOrder,
      isActive: category.isActive,
    });
    setSlugEdited(true);
    setFormError("");
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
  }

  function handleNameChange(name: string) {
    setForm((prev) => ({
      ...prev,
      name,
      slug: slugEdited ? prev.slug : generateSlug(name),
    }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setFormError("");

    const url = editingId
      ? `/api/admin/categories/${editingId}`
      : "/api/admin/categories";
    const method = editingId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setFormError(data.error ?? "Không lưu được danh mục");
        return;
      }

      closeForm();
      await reloadCategories();
    } catch {
      setFormError("Không lưu được danh mục");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(category: Category) {
    try {
      const response = await fetch(`/api/admin/categories/${category.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !category.isActive }),
      });
      if (response.ok) {
        await reloadCategories();
      }
    } catch {
      setError("Không cập nhật được trạng thái danh mục");
    }
  }

  async function handleDelete(category: Category) {
    setDeleteTarget(category);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/categories/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Không xóa được danh mục");
        return;
      }
      setDeleteTarget(null);
      await reloadCategories();
    } catch {
      setError("Không xóa được danh mục");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-4">
      <AdminPageHeader
        title="Danh mục"
        description="Quản lý danh mục hiển thị trên menu và trang chủ."
        actions={
          <AdminButton variant="primary" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Thêm danh mục
          </AdminButton>
        }
      />

      <AdminToast
        message={error}
        type="error"
        onDismiss={() => setError("")}
      />
      <AdminToast
        message={formError}
        type="error"
        onDismiss={() => setFormError("")}
      />

      {formOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeForm();
          }}
        >
          <div className="w-full max-w-lg rounded-2xl border border-neutral-200 bg-white p-5 shadow-2xl sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="font-serif text-lg font-bold text-neutral-900">
                {editingId ? "Sửa danh mục" : "Thêm danh mục"}
              </h2>
              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                title="Đóng"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                    Tên *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    required
                    className={adminInputClassName()}
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
                    className={adminInputClassName()}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Mô tả
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, description: e.target.value }))
                  }
                  rows={2}
                  className={adminInputClassName("resize-none")}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                    Thứ tự
                  </label>
                  <input
                    type="number"
                    value={form.sortOrder}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        sortOrder: parseInt(e.target.value, 10) || 0,
                      }))
                    }
                    className={adminInputClassName()}
                  />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-neutral-700">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          isActive: e.target.checked,
                        }))
                      }
                      className="rounded border-neutral-300 text-brand-800 focus:ring-brand-800/20"
                    />
                    Hiển thị trên menu
                  </label>
                </div>
              </div>

              <div className="flex gap-2 border-t border-neutral-100 pt-4">
                <AdminButton
                  type="submit"
                  variant="primary"
                  disabled={saving}
                  className="flex-1 sm:flex-none"
                >
                  {saving ? "Đang lưu..." : editingId ? "Cập nhật" : "Tạo mới"}
                </AdminButton>
                <AdminButton type="button" variant="secondary" onClick={closeForm}>
                  Hủy
                </AdminButton>
              </div>
            </form>
          </div>
        </div>
      )}

      <AdminPanel>
        {loading || categories.length === 0 ? (
          <AdminEmptyState
            loading={loading}
            icon={FolderOpen}
            message={
              loading ? "Đang tải danh mục..." : "Chưa có danh mục nào."
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-100 text-xs uppercase tracking-wide text-neutral-500">
                  <th className="px-4 py-3 font-medium">Tên</th>
                  <th className="hidden px-4 py-3 font-medium sm:table-cell">
                    Slug
                  </th>
                  <th className="px-4 py-3 font-medium">TT</th>
                  <th className="hidden px-4 py-3 font-medium md:table-cell">
                    Bài viết
                  </th>
                  <th className="px-4 py-3 font-medium">Trạng thái</th>
                  <th className="px-4 py-3 font-medium text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {categories.map((category) => (
                  <tr
                    key={category.id}
                    className="transition-colors hover:bg-neutral-50/80"
                  >
                    <td className="px-4 py-3 font-medium text-neutral-900">
                      {category.name}
                    </td>
                    <td className="hidden px-4 py-3 font-mono text-xs text-neutral-500 sm:table-cell">
                      {category.slug}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-neutral-600">
                      {category.sortOrder}
                    </td>
                    <td className="hidden px-4 py-3 tabular-nums text-neutral-600 md:table-cell">
                      {category._count?.articles ?? 0}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => toggleActive(category)}
                        className="cursor-pointer"
                      >
                        <AdminBadge tone={category.isActive ? "green" : "neutral"}>
                          {category.isActive ? "Đang hiện" : "Ẩn"}
                        </AdminBadge>
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-0.5">
                        <button
                          type="button"
                          onClick={() => openEdit(category)}
                          className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
                          title="Sửa"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(category)}
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

      <AdminConfirmDialog
        open={!!deleteTarget}
        title="Xóa danh mục?"
        description={
          <>
            Bạn có chắc muốn xóa danh mục{" "}
            <span className="font-semibold text-neutral-900">
              &ldquo;{deleteTarget?.name}&rdquo;
            </span>
            ? Hành động này không thể hoàn tác.
          </>
        }
        confirmLabel="Xóa danh mục"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => {
          if (!deleting) setDeleteTarget(null);
        }}
      />
    </div>
  );
}
