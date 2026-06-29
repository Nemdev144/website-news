"use client";

import SearchForm from "@/components/public/SearchForm";
import { HeaderBrand } from "@/components/public/SiteLogo";

export default function Header() {
  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto max-w-[1280px] px-3 py-3 sm:px-4 sm:py-3.5">
        <div className="flex items-center justify-between gap-4 sm:gap-6">
          <HeaderBrand />
          <SearchForm className="flex max-w-xs flex-1 items-center sm:max-w-sm" />
        </div>
      </div>
    </header>
  );
}
