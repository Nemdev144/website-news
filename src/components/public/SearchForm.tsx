"use client";

import { searchPath } from "@/lib/utils";
import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

interface SearchFormProps {
  defaultQuery?: string;
  inputId?: string;
  className?: string;
  compact?: boolean;
}

export default function SearchForm({
  defaultQuery = "",
  inputId = "site-search",
  className,
  compact = true,
}: SearchFormProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultQuery);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(searchPath(trimmed));
  }

  return (
    <form role="search" className={className} onSubmit={handleSubmit}>
      <label htmlFor={inputId} className="sr-only">
        Search articles
      </label>
      <div className="flex w-full">
        <input
          id={inputId}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className={
            compact
              ? "h-8 w-full border border-neutral-300 border-r-0 bg-neutral-50 px-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-brand-700 focus:bg-white focus:outline-none"
              : "h-10 w-full border border-neutral-300 border-r-0 bg-white px-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-brand-700 focus:outline-none focus:ring-1 focus:ring-brand-700"
          }
        />
        <button
          type="submit"
          className={
            compact
              ? "flex h-8 items-center justify-center bg-brand-800 px-3 text-white transition-colors hover:bg-brand-900"
              : "flex h-10 items-center justify-center bg-brand-800 px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-900"
          }
          aria-label="Search"
        >
          <Search className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
        </button>
      </div>
    </form>
  );
}

export function HeaderBrand() {
  return (
    <Link href="/" className="group shrink-0">
      <span className="font-serif text-2xl font-bold leading-none tracking-tight text-neutral-900 transition-colors group-hover:text-brand-800 sm:text-[28px]">
        Website News
      </span>
      <p className="mt-0.5 hidden text-[10px] font-medium uppercase tracking-widest text-neutral-400 sm:block">
        Independent stories · Clear perspectives
      </p>
    </Link>
  );
}
