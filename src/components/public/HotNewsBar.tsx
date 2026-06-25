import type { Article } from "@/types/news";
import { articlePath } from "@/lib/utils";
import { TrendingUp } from "lucide-react";
import Link from "next/link";

interface HotNewsBarProps {
  articles: Article[];
}

export default function HotNewsBar({ articles }: HotNewsBarProps) {
  if (articles.length === 0) return null;

  const tickerItems = [...articles, ...articles];

  return (
    <div className="overflow-hidden border-b border-neutral-200 bg-neutral-100">
      <div className="mx-auto max-w-[1280px] px-3 py-2 sm:px-4">
        <div className="flex items-center gap-2.5 overflow-hidden">
          {/* Label — red icon + HOT: */}
          <div className="flex shrink-0 items-center gap-1 border-r border-neutral-200 pr-2.5">
            <TrendingUp
              className="h-4 w-4 shrink-0 text-brand-700"
              strokeWidth={2.5}
              aria-hidden
            />
            <span className="font-sans text-xs font-bold uppercase tracking-wide text-brand-700">
              Hot News:
            </span>
          </div>

          {/* Headline pills */}
          <div className="relative min-w-0 flex-1 overflow-hidden">
            <div className="hot-ticker-track flex w-max items-center gap-2 py-0.5">
              {tickerItems.map((article, i) => (
                <Link
                  key={`${article.id}-${i}`}
                  href={articlePath(article.slug)}
                  className="shrink-0 rounded-sm bg-white px-3 py-1.5 font-sans text-xs leading-snug text-neutral-900 shadow-sm ring-1 ring-neutral-200/90 transition-all hover:text-brand-800 hover:ring-brand-300 hover:shadow"
                >
                  {article.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
