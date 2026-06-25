"use client";

import AdminToast from "@/components/admin/AdminToast";
import { MediaType } from "@/types/cms";
import { cn } from "@/lib/utils";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

interface MediaItem {
  id: string;
  url: string;
  title: string | null;
  caption: string | null;
  type: MediaType;
  sortOrder: number;
  createdAt: string;
}

interface MediaForm {
  url: string;
  title: string;
  caption: string;
  type: MediaType;
  sortOrder: number;
}

const emptyForm: MediaForm = {
  url: "",
  title: "",
  caption: "",
  type: MediaType.IMAGE,
  sortOrder: 0,
};

export default function AdminMediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<MediaForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    let cancelled = false;

    fetch("/api/admin/media")
      .then(async (response) => ({
        response,
        data: (await response.json()) as {
          media?: MediaItem[];
          error?: string;
        },
      }))
      .then(({ response, data }) => {
        if (cancelled) return;
        if (!response.ok) {
          setError(data.error ?? "Failed to load media");
          return;
        }
        setError("");
        setMedia(data.media ?? []);
      })
      .catch(() => {
        if (!cancelled) {
          setError("Failed to load media");
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

  async function reloadMedia() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/media");
      const data = (await response.json()) as {
        media?: MediaItem[];
        error?: string;
      };
      if (!response.ok) {
        setError(data.error ?? "Failed to load media");
        return;
      }
      setMedia(data.media ?? []);
    } catch {
      setError("Failed to load media");
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setFormOpen(true);
  }

  function openEdit(item: MediaItem) {
    setEditingId(item.id);
    setForm({
      url: item.url,
      title: item.title ?? "",
      caption: item.caption ?? "",
      type: item.type,
      sortOrder: item.sortOrder,
    });
    setFormError("");
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
  }

  async function uploadImage(file: File): Promise<string> {
    setFormError("");
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/admin/uploads", {
      method: "POST",
      body: formData,
    });
    const data = (await response.json()) as { url?: string; error?: string };

    if (!response.ok || !data.url) {
      const message = data.error ?? "Failed to upload image";
      setFormError(message);
      throw new Error(message);
    }

    return data.url;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setFormError("");

    const url = editingId ? `/api/admin/media/${editingId}` : "/api/admin/media";
    const method = editingId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setFormError(data.error ?? "Failed to save media");
        return;
      }

      closeForm();
      await reloadMedia();
    } catch {
      setFormError("Failed to save media");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item: MediaItem) {
    if (!window.confirm(`Delete media "${item.title || item.url}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/media/${item.id}`, {
        method: "DELETE",
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Failed to delete media");
        return;
      }
      await reloadMedia();
    } catch {
      setError("Failed to delete media");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-600">
          Manage media URLs. File upload is not available in this phase.
        </p>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-800 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-900"
        >
          <Plus className="h-4 w-4" />
          Add Media URL
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
                {editingId ? "Edit Media URL" : "Add Media URL"}
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
              <div>
                <label className="mb-1 block text-sm font-medium">URL *</label>
                <input
                  type="url"
                  value={form.url}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, url: e.target.value }))
                  }
                  required
                  placeholder="https://example.com/image.jpg"
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                />
                <label className="mt-2 inline-flex cursor-pointer items-center justify-center rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium hover:bg-neutral-50">
                  Upload image from computer
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={async (event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      try {
                        const url = await uploadImage(file);
                        setForm((prev) => ({
                          ...prev,
                          url,
                          type: MediaType.IMAGE,
                        }));
                      } finally {
                        event.target.value = "";
                      }
                    }}
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-sm font-medium">Title</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, title: e.target.value }))
                    }
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Type</label>
                  <select
                    value={form.type}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        type: e.target.value as MediaType,
                      }))
                    }
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                  >
                    <option value={MediaType.IMAGE}>Image</option>
                    <option value={MediaType.VIDEO}>Video</option>
                  </select>
                </div>
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
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Caption</label>
                <textarea
                  value={form.caption}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, caption: e.target.value }))
                  }
                  rows={2}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-brand-800 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-900 disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingId ? "Update Media" : "Add Media"}
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
          <p className="p-6 text-sm text-neutral-500">Loading media...</p>
        ) : media.length === 0 ? (
          <p className="p-6 text-sm text-neutral-500">No media records yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Preview</th>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Order</th>
                  <th className="px-4 py-3 font-medium">URL</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {media.map((item) => (
                  <tr key={item.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3">
                      {item.type === MediaType.IMAGE ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.url}
                          alt={item.title ?? "Media"}
                          className="h-12 w-16 rounded object-cover bg-neutral-100"
                        />
                      ) : (
                        <span className="inline-flex h-12 w-16 items-center justify-center rounded bg-neutral-100 text-xs text-neutral-500">
                          Video
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{item.title ?? "—"}</p>
                      {item.caption && (
                        <p className="mt-0.5 text-xs text-neutral-500">{item.caption}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs font-medium",
                          item.type === MediaType.IMAGE
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800",
                        )}
                      >
                        {item.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">{item.sortOrder}</td>
                    <td className="max-w-xs truncate px-4 py-3 text-neutral-500">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-brand-800 hover:underline"
                      >
                        {item.url}
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(item)}
                          className="rounded p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
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
