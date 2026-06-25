import { cn, formatShortDate, formatViewCount } from "@/lib/utils";
import Link from "next/link";

interface ArticleRankItem {
  id: string;
  title: string;
  categoryName: string;
  status: string;
  viewCount?: number;
  publishedAt?: Date | null;
}

interface ArticleRankListProps {
  title: string;
  subtitle?: string;
  items: ArticleRankItem[];
  variant: "latest" | "mostRead";
}

const statusStyles: Record<string, string> = {
  PUBLISHED: "bg-emerald-100 text-emerald-800",
  DRAFT: "bg-amber-100 text-amber-800",
  ARCHIVED: "bg-neutral-200 text-neutral-600",
};

export default function ArticleRankList({
  title,
  subtitle,
  items,
  variant,
}: ArticleRankListProps) {
  return (
    <section className="rounded-xl border border-neutral-200 bg-white shadow-sm">
      <div className="border-b border-neutral-200 px-5 py-4">
        <h2 className="font-serif text-lg font-bold text-neutral-900">{title}</h2>
        {subtitle && (
          <p className="mt-0.5 text-xs text-neutral-500">{subtitle}</p>
        )}
      </div>
      <ol className="divide-y divide-neutral-100">
        {items.map((article, index) => (
          <li key={article.id} className="flex gap-4 px-5 py-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-sm font-bold text-neutral-500">
              {index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <Link
                href={`/admin/articles/${article.id}/edit`}
                className="line-clamp-2 font-medium text-neutral-900 hover:text-brand-800"
              >
                {article.title}
              </Link>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="text-xs text-neutral-500">
                  {article.categoryName}
                </span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                    statusStyles[article.status] ?? statusStyles.ARCHIVED,
                  )}
                >
                  {article.status}
                </span>
                {variant === "mostRead" && article.viewCount !== undefined && (
                  <span className="text-xs font-medium text-neutral-600">
                    {formatViewCount(article.viewCount)} views
                  </span>
                )}
                {variant === "latest" && article.publishedAt && (
                  <span className="text-xs text-neutral-400">
                    {formatShortDate(article.publishedAt)}
                  </span>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
