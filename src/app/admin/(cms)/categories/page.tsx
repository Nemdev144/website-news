"use client";

import AdminToast from "@/components/admin/AdminToast";
import { generateSlug } from "@/lib/slug";
import { cn } from "@/lib/utils";
import { Pencil, Plus, Trash2, X } from "lucide-react";
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
        setFormError(data.error ?? "Failed to save category");
        return;
      }

      closeForm();
      await reloadCategories();
    } catch {
      setFormError("Failed to save category");
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
      setError("Failed to update category status");
    }
  }

  async function handleDelete(category: Category) {
    if (
      !window.confirm(
        `Delete category "${category.name}"? This cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/categories/${category.id}`, {
        method: "DELETE",
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Failed to delete category");
        return;
      }
      await reloadCategories();
    } catch {
      setError("Failed to delete category");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-600">
          Manage navigation categories and their visibility.
        </p>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-800 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-900"
        >
          <Plus className="h-4 w-4" />
          New Category
        </button>
      </div>

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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeForm();
          }}
        >
          <div className="w-full max-w-2xl rounded-xl border border-neutral-200 bg-white p-4 shadow-xl sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="font-serif text-lg font-bold">
                {editingId ? "Edit Category" : "New Category"}
              </h2>
              <button
                type="button"
                onClick={closeForm}
                className="rounded p-1.5 text-neutral-500 hover:bg-neutral-100"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    required
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
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

              <div>
                <label className="mb-1 block text-sm font-medium">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, description: e.target.value }))
                  }
                  rows={3}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Sort Order
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
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          isActive: e.target.checked,
                        }))
                      }
                      className="rounded border-neutral-300"
                    />
                    Active (visible in navigation)
                  </label>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-brand-800 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-900 disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingId ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
        {loading ? (
          <p className="p-6 text-sm text-neutral-500">Loading categories...</p>
        ) : categories.length === 0 ? (
          <p className="p-6 text-sm text-neutral-500">No categories yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Slug</th>
                  <th className="px-4 py-3 font-medium">Order</th>
                  <th className="px-4 py-3 font-medium">Articles</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3 font-medium">{category.name}</td>
                    <td className="px-4 py-3 text-neutral-500">{category.slug}</td>
                    <td className="px-4 py-3">{category.sortOrder}</td>
                    <td className="px-4 py-3">{category._count?.articles ?? 0}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => toggleActive(category)}
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-xs font-medium",
                          category.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-neutral-200 text-neutral-600",
                        )}
                      >
                        {category.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(category)}
                          className="rounded p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(category)}
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
    </div>
  );
}
