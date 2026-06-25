"use client";

import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, ImagePlus, Trash2 } from "lucide-react";

export interface ArticleMediaField {
  id: string;
  url: string;
  caption: string;
  title: string;
}

interface ArticleMediaFieldsProps {
  items: ArticleMediaField[];
  onChange: (items: ArticleMediaField[]) => void;
}

function createEmptyItem(): ArticleMediaField {
  return {
    id: crypto.randomUUID(),
    url: "",
    caption: "",
    title: "",
  };
}

export default function ArticleMediaFields({
  items,
  onChange,
}: ArticleMediaFieldsProps) {
  function updateItem(id: string, patch: Partial<ArticleMediaField>) {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function removeItem(id: string) {
    onChange(items.filter((item) => item.id !== id));
  }

  function moveItem(id: string, direction: "up" | "down") {
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const next = [...items];
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    onChange(next);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-lg font-bold">Inline Images</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Add images with captions displayed below each photo in the article.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onChange([...items, createEmptyItem()])}
          className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium hover:bg-neutral-50"
        >
          <ImagePlus className="h-4 w-4" />
          Add Image
        </button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50 px-4 py-8 text-center text-sm text-neutral-500">
          No inline images yet. Click &quot;Add Image&quot; to insert photos with
          captions.
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="rounded-xl border border-neutral-200 bg-neutral-50/80 p-4"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Image {index + 1}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveItem(item.id, "up")}
                    disabled={index === 0}
                    className="rounded p-1.5 text-neutral-500 hover:bg-white disabled:opacity-30"
                    title="Move up"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItem(item.id, "down")}
                    disabled={index === items.length - 1}
                    className="rounded p-1.5 text-neutral-500 hover:bg-white disabled:opacity-30"
                    title="Move down"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="rounded p-1.5 text-neutral-500 hover:bg-red-50 hover:text-red-600"
                    title="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-[180px_minmax(0,1fr)]">
                <div
                  className={cn(
                    "overflow-hidden rounded-lg border border-neutral-200 bg-white",
                    !item.url && "flex min-h-[120px] items-center justify-center",
                  )}
                >
                  {item.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.url}
                      alt={item.title || item.caption || `Image ${index + 1}`}
                      className="aspect-[4/3] h-full w-full object-cover"
                    />
                  ) : (
                    <span className="px-3 text-center text-xs text-neutral-400">
                      Preview appears after URL is entered
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Image URL *
                    </label>
                    <input
                      type="text"
                      value={item.url}
                      onChange={(e) => updateItem(item.id, { url: e.target.value })}
                      placeholder="/images/placeholders/world-1.jpg"
                      className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Title (optional)
                    </label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updateItem(item.id, { title: e.target.value })}
                      placeholder="Short image title"
                      className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Caption / Ghi chú dưới ảnh
                    </label>
                    <textarea
                      value={item.caption}
                      onChange={(e) =>
                        updateItem(item.id, { caption: e.target.value })
                      }
                      rows={2}
                      placeholder="Describe what appears in the photo..."
                      className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
