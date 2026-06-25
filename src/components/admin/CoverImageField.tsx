"use client";

import { ImageIcon } from "lucide-react";

interface CoverImageFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export default function CoverImageField({ value, onChange }: CoverImageFieldProps) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-800">
          <ImageIcon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-serif text-lg font-bold">Ảnh đại diện</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Ảnh hiển thị ở đầu bài, danh sách tin và trang chủ. Khác với ảnh
            chèn trong nội dung bài viết.
          </p>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">URL ảnh đại diện</label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/images/placeholders/world-1.jpg"
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>

      {value ? (
        <div className="mt-4 overflow-hidden rounded-lg border border-neutral-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Ảnh đại diện"
            className="aspect-[16/9] w-full max-w-xl object-cover"
          />
          <p className="border-t border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-500">
            Xem trước ảnh đại diện
          </p>
        </div>
      ) : (
        <div className="mt-4 rounded-lg border border-dashed border-neutral-300 bg-neutral-50 px-4 py-8 text-center text-sm text-neutral-500">
          Chưa có ảnh đại diện. Nhập URL để xem trước.
        </div>
      )}
    </div>
  );
}
