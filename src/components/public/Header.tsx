"use client";

import SearchForm, { HeaderBrand } from "@/components/public/SearchForm";

export default function Header() {
  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto max-w-[1280px] px-3 py-2 sm:px-4">
        <div className="flex items-center justify-between gap-4">
          <HeaderBrand />
          <SearchForm className="flex max-w-xs flex-1 items-center sm:max-w-sm" />
        </div>
      </div>
    </header>
  );
}
