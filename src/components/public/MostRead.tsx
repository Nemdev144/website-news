import type { Article } from "@/types/news";
import { articlePath, formatShortDate, formatViewCount } from "@/lib/utils";
import Link from "next/link";

interface MostReadProps {
  articles: Article[];
  limit?: number;
}

export default function MostRead({ articles, limit = 8 }: MostReadProps) {
  const items = articles.slice(0, limit);

  return (
    <aside className="border border-neutral-200 bg-white shadow-sm">
      <h2 className="border-b-2 border-brand-800 bg-brand-800 px-3 py-1.5 font-sans text-[11px] font-bold uppercase tracking-wider text-white">
        Most Read
      </h2>
      <ol className="divide-y divide-neutral-100">
        {items.map((article, index) => (
          <li key={article.id} className="flex gap-2 px-3 py-2 transition-colors hover:bg-neutral-50">
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center font-sans text-[10px] font-bold ${
                index < 3 ? "bg-brand-800 text-white" : "bg-neutral-200 text-neutral-600"
              }`}
            >
              {index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <Link
                href={articlePath(article.slug)}
                className="line-clamp-2 font-serif text-[12px] font-bold leading-snug text-neutral-900 transition-colors hover:text-brand-800"
              >
                {article.title}
              </Link>
              <p className="mt-0.5 font-sans text-[10px] text-neutral-400">
                {formatShortDate(article.publishedAt)} · {formatViewCount(article.viewCount)} views
              </p>
            </div>
          </li>
        ))}
      </ol>
    </aside>
  );
}
