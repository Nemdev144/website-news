"use client";

import { categoryPath, cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavCategory {
  name: string;
  slug: string;
  description: string;
}

interface CategoryNavProps {
  categories: NavCategory[];
}

export default function CategoryNav({ categories }: CategoryNavProps) {
  const pathname = usePathname();

  function isActive(slug: string) {
    if (slug === "home") return pathname === "/";
    return pathname === categoryPath(slug) || pathname.startsWith(`${categoryPath(slug)}/`);
  }

  return (
    <nav className="sticky top-0 z-40 bg-brand-800 shadow-md" aria-label="Categories">
      <div className="mx-auto max-w-[1280px] overflow-x-auto hide-scrollbar px-1 sm:px-2">
        <ul className="flex min-w-0 items-stretch sm:min-w-max">
          <li>
            <Link
              href="/"
              className={cn(
                "block border-b-2 px-3 py-2 font-sans text-[11px] font-bold uppercase tracking-wide transition-colors sm:px-4",
                isActive("home")
                  ? "border-white bg-brand-900 text-white"
                  : "border-transparent text-white/85 hover:bg-brand-900/60 hover:text-white",
              )}
            >
              Home
            </Link>
          </li>
          {categories.map((cat) => (
            <li key={cat.slug}>
              <Link
                href={categoryPath(cat.slug)}
                className={cn(
                  "block border-b-2 px-3 py-2 font-sans text-[11px] font-bold uppercase tracking-wide transition-colors sm:px-4",
                  isActive(cat.slug)
                    ? "border-white bg-brand-900 text-white"
                    : "border-transparent text-white/85 hover:bg-brand-900/60 hover:text-white",
                )}
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
