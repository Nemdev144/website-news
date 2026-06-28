"use client";

import ArticleCaption from "@/components/article/ArticleCaption";
import ArticleContentRenderer from "@/components/article/ArticleContentRenderer";
import {
  type ContentBlock,
  type TextBlock,
  createImageBlock,
  createTextBlock,
} from "@/lib/article-blocks";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronUp,
  Eye,
  ImagePlus,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type TextareaHTMLAttributes,
} from "react";

interface ArticleContentEditorProps {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
  onUploadImage?: (file: File) => Promise<string>;
  articleTitle?: string;
}

function AutoResizeTextarea({
  value,
  className,
  rows = 1,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      rows={rows}
      className={cn("resize-none overflow-hidden", className)}
      {...props}
    />
  );
}

export default function ArticleContentEditor({
  blocks,
  onChange,
  onUploadImage,
  articleTitle = "",
}: ArticleContentEditorProps) {
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(true);

  function updateBlock(id: string, patch: Partial<ContentBlock>) {
    onChange(
      blocks.map((block) =>
        block.id === id ? ({ ...block, ...patch } as ContentBlock) : block,
      ),
    );
  }

  function removeBlock(id: string) {
    const next = blocks.filter((block) => block.id !== id);
    onChange(next.length > 0 ? next : [createTextBlock()]);
  }

  function moveBlock(id: string, direction: "up" | "down") {
    const index = blocks.findIndex((block) => block.id === id);
    if (index === -1) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;

    const next = [...blocks];
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    onChange(next);
  }

  function insertImageWithText(afterId?: string, url = "") {
    const imageBlock = { ...createImageBlock(), url };
    const textBlock = createTextBlock();

    if (!afterId) {
      onChange([...blocks, imageBlock, textBlock]);
      setSelectedImageId(imageBlock.id);
      return;
    }

    const index = blocks.findIndex((item) => item.id === afterId);
    if (index === -1) {
      onChange([...blocks, imageBlock, textBlock]);
      return;
    }

    const next = [...blocks];
    next.splice(index + 1, 0, imageBlock, textBlock);
    onChange(next);
    setSelectedImageId(imageBlock.id);
  }

  function handleImageFile(file: File, afterId?: string) {
    if (onUploadImage) {
      onUploadImage(file).then((url) => insertImageWithText(afterId, url));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        insertImageWithText(afterId, reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  function uploadImageForBlock(id: string, file: File) {
    if (onUploadImage) {
      onUploadImage(file).then((url) => updateBlock(id, { url }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        updateBlock(id, { url: reader.result });
      }
    };
    reader.readAsDataURL(file);
  }

  function updateTextAfterImage(imageIndex: number, value: string) {
    const nextBlock = blocks[imageIndex + 1];

    if (nextBlock?.type === "text") {
      updateBlock(nextBlock.id, { value });
      return;
    }

    const next = [...blocks];
    next.splice(imageIndex + 1, 0, createTextBlock(value));
    onChange(next);
  }

  function getInsertTargetAfterImage(imageIndex: number) {
    const imageBlock = blocks[imageIndex];
    const nextBlock = blocks[imageIndex + 1];

    if (nextBlock?.type === "text") {
      return nextBlock.id;
    }

    return imageBlock?.id;
  }

  function appendUploadedImage(file: File) {
    const lastTextBlock = [...blocks]
      .reverse()
      .find((block) => block.type === "text");
    handleImageFile(file, lastTextBlock?.id);
  }

  function handlePaste(event: ClipboardEvent<HTMLElement>, afterId?: string) {
    const imageFile = Array.from(event.clipboardData.files).find((file) =>
      file.type.startsWith("image/"),
    );

    if (imageFile) {
      event.preventDefault();
      handleImageFile(imageFile, afterId);
      return;
    }

    const text = event.clipboardData.getData("text/plain").trim();
    if (/^(https?:\/\/|\/).+\.(png|jpe?g|webp|gif|avif)(\?.*)?$/i.test(text)) {
      event.preventDefault();
      insertImageWithText(afterId, text);
    }
  }

  return (
    <div className="space-y-4" onPaste={(event) => handlePaste(event)}>
      <div className="flex flex-col gap-3 border-b border-neutral-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-serif text-xl font-bold">Soạn nội dung</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Viết bài bình thường. Khi cần ảnh, bấm chèn ảnh hoặc paste ảnh vào khung soạn.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowPreview((value) => !value)}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors",
              showPreview
                ? "border-brand-200 bg-brand-50 text-brand-800"
                : "border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50",
            )}
          >
            {showPreview ? <Eye className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
            {showPreview ? "Đang xem trước" : "Xem trước"}
          </button>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-brand-800 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-900">
            <ImagePlus className="h-4 w-4" />
            Chèn ảnh
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) appendUploadedImage(file);
                event.target.value = "";
              }}
            />
          </label>
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white">
        {blocks.map((block, index) => {
          const previousBlock = blocks[index - 1];
          const isTextFoldedIntoSelectedImage =
            block.type === "text" &&
            previousBlock?.type === "image" &&
            selectedImageId === previousBlock.id;
          const textAfterImage: TextBlock | null =
            block.type === "image" && blocks[index + 1]?.type === "text"
              ? (blocks[index + 1] as TextBlock)
              : null;

          if (isTextFoldedIntoSelectedImage) {
            return null;
          }

          return (
            <div
              key={block.id}
              className={cn(
                "group relative border-b border-neutral-100 last:border-b-0",
                block.type === "image" && "bg-white",
              )}
            >
            <div className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-lg border border-neutral-200 bg-white/90 p-1 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
              <button
                type="button"
                onClick={() => moveBlock(block.id, "up")}
                disabled={index === 0}
                className="rounded p-1.5 text-neutral-500 hover:bg-neutral-100 disabled:opacity-30"
                title="Di chuyển lên"
              >
                <ChevronUp className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => moveBlock(block.id, "down")}
                disabled={index === blocks.length - 1}
                className="rounded p-1.5 text-neutral-500 hover:bg-neutral-100 disabled:opacity-30"
                title="Di chuyển xuống"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => removeBlock(block.id)}
                className="rounded p-1.5 text-neutral-500 hover:bg-red-50 hover:text-red-600"
                title="Xóa"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {block.type === "text" ? (
              <AutoResizeTextarea
                value={block.value}
                onChange={(e) => updateBlock(block.id, { value: e.target.value })}
                onPaste={(event) => handlePaste(event, block.id)}
                rows={2}
                placeholder={
                  index === 0
                    ? "Viết nội dung bài viết tại đây. Enter = xuống đoạn mới. Enter 2 lần = cách thêm khoảng trống..."
                    : "Viết tiếp nội dung..."
                }
                className="min-h-16 w-full border-0 bg-transparent px-4 py-4 pr-28 text-base leading-7 outline-none placeholder:text-neutral-400"
              />
            ) : (
              <div
                className="px-4 py-5 pr-28"
                onPaste={(event) => handlePaste(event, block.id)}
              >
                {selectedImageId !== block.id && block.url ? (
                  <div className="prose-news">
                    <figure className="article-figure">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={block.url}
                        alt={block.caption || articleTitle || `Image ${index + 1}`}
                        className="article-figure-image"
                      />
                      {block.caption.trim() && <ArticleCaption text={block.caption} />}
                    </figure>
                  </div>
                ) : (
                <div
                  className={cn(
                    "cursor-pointer overflow-hidden rounded-lg border bg-neutral-100 transition-colors",
                    selectedImageId === block.id
                      ? "border-brand-500 ring-2 ring-brand-100"
                      : "border-neutral-200 hover:border-brand-300",
                    !block.url && "flex min-h-40 items-center justify-center",
                  )}
                  onClick={() =>
                    setSelectedImageId((current) =>
                      current === block.id ? null : block.id,
                    )
                  }
                >
                  {block.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={block.url}
                      alt={block.caption || `Image ${index + 1}`}
                      className="max-h-[520px] w-full object-contain"
                    />
                  ) : (
                    <span className="px-3 text-center text-xs text-neutral-400">
                      Bấm để nhập URL hoặc tải ảnh lên
                    </span>
                  )}
                </div>
                )}
                {selectedImageId !== block.id && block.url && (
                  <button
                    type="button"
                    onClick={() => setSelectedImageId(block.id)}
                    className="mt-3 text-xs font-medium text-brand-800 hover:underline"
                  >
                    Chỉnh sửa ảnh / ghi chú
                  </button>
                )}
                {(selectedImageId === block.id || !block.url) && (
                <div className="mt-3 space-y-3 border-t border-neutral-200 bg-neutral-50 px-3 py-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      URL hình ảnh *
                    </label>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <input
                        type="text"
                        value={block.url}
                        onChange={(e) =>
                          updateBlock(block.id, { url: e.target.value })
                        }
                        placeholder="/images/placeholders/world-1.jpg"
                        className="min-w-0 flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm"
                      />
                      <label className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium hover:bg-neutral-50">
                        Tải ảnh lên
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            if (file) uploadImageForBlock(block.id, file);
                            event.target.value = "";
                          }}
                        />
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Ghi chú dưới ảnh
                    </label>
                    <AutoResizeTextarea
                      value={block.caption}
                      onChange={(e) =>
                        updateBlock(block.id, { caption: e.target.value })
                      }
                      rows={2}
                      placeholder="Mô tả nội dung trong ảnh..."
                      className="min-h-10 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Viết tiếp sau ảnh
                    </label>
                    <AutoResizeTextarea
                      value={textAfterImage?.value ?? ""}
                      onChange={(event) =>
                        updateTextAfterImage(index, event.target.value)
                      }
                      rows={2}
                      placeholder="Nhập đoạn văn bản tiếp theo sau ảnh..."
                      className="min-h-14 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm leading-6"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium hover:bg-neutral-100">
                      <ImagePlus className="h-4 w-4" />
                      Chèn ảnh tiếp theo
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          const afterId = getInsertTargetAfterImage(index);
                          if (file && afterId) handleImageFile(file, afterId);
                          event.target.value = "";
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const afterId = getInsertTargetAfterImage(index);
                        insertImageWithText(afterId);
                      }}
                      className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium hover:bg-neutral-100"
                    >
                      <ImagePlus className="h-4 w-4" />
                      Thêm ảnh bằng URL
                    </button>
                  </div>
                </div>
                )}
              </div>
            )}
          </div>
          );
        })}
      </div>

      {showPreview && (
        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
          <div className="border-b border-neutral-200 bg-white px-4 py-2.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Xem trước — giống trang đăng
            </p>
          </div>
          <div className="prose-news bg-white px-4 py-5 sm:px-6">
            <ArticleContentRenderer blocks={blocks} articleTitle={articleTitle} />
          </div>
        </div>
      )}
    </div>
  );
}
