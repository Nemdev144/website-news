import { categoryPath } from "@/lib/utils";
import Link from "next/link";

interface CategoryPaginationProps {
  slug: string;
  page: number;
  totalPages: number;
  total: number;
}

export default function CategoryPagination({
  slug,
  page,
  totalPages,
  total,
}: CategoryPaginationProps) {
  if (totalPages <= 1) return null;

  const basePath = categoryPath(slug);
  const pages = buildPageNumbers(page, totalPages);

  return (
    <nav
      aria-label="Category pagination"
      className="mt-6 flex flex-col items-center gap-3 border-t border-neutral-200 pt-5 sm:flex-row sm:justify-between"
    >
      <p className="font-sans text-[11px] text-neutral-500">
        Page {page} of {totalPages} · {total} articles
      </p>

      <div className="flex flex-wrap items-center justify-center gap-1">
        <PaginationLink
          href={page > 1 ? pageHref(basePath, page - 1) : undefined}
          label="Previous"
          disabled={page <= 1}
        />

        {pages.map((item, index) =>
          item === "…" ? (
            <span
              key={`ellipsis-${index}`}
              className="px-2 font-sans text-xs text-neutral-400"
            >
              …
            </span>
          ) : (
            <PaginationLink
              key={item}
              href={pageHref(basePath, item)}
              label={String(item)}
              active={item === page}
            />
          ),
        )}

        <PaginationLink
          href={page < totalPages ? pageHref(basePath, page + 1) : undefined}
          label="Next"
          disabled={page >= totalPages}
        />
      </div>
    </nav>
  );
}

function pageHref(basePath: string, page: number) {
  return page <= 1 ? basePath : `${basePath}?page=${page}`;
}

function PaginationLink({
  href,
  label,
  active = false,
  disabled = false,
}: {
  href?: string;
  label: string;
  active?: boolean;
  disabled?: boolean;
}) {
  const className = [
    "inline-flex min-w-8 items-center justify-center rounded-sm px-2.5 py-1.5 font-sans text-xs font-semibold transition-colors",
    active
      ? "bg-brand-800 text-white"
      : disabled
        ? "cursor-not-allowed text-neutral-300"
        : "text-neutral-600 hover:bg-neutral-100 hover:text-brand-800",
  ].join(" ");

  if (!href || disabled) {
    return (
      <span aria-disabled={disabled} className={className}>
        {label}
      </span>
    );
  }

  return (
    <Link href={href} className={className} aria-current={active ? "page" : undefined}>
      {label}
    </Link>
  );
}

function buildPageNumbers(current: number, total: number): Array<number | "…"> {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const pages: Array<number | "…"> = [1];

  if (current > 3) pages.push("…");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  if (current < total - 2) pages.push("…");

  pages.push(total);
  return pages;
}
