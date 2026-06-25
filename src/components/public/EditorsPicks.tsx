import type { Article } from "@/types/news";
import { articlePath, formatShortDate } from "@/lib/utils";
import Link from "next/link";

interface EditorsPicksProps {
  articles: Article[];
}

export default function EditorsPicks({ articles }: EditorsPicksProps) {
  return (
    <aside className="border border-neutral-200 bg-white shadow-sm">
      <h2 className="border-b border-neutral-200 bg-neutral-50 px-3 py-1.5 font-sans text-[11px] font-bold uppercase tracking-wider text-neutral-900">
        Editor&apos;s Picks
      </h2>
      <ul className="divide-y divide-neutral-100">
        {articles.map((article) => (
          <li key={article.id} className="px-3 py-2 transition-colors hover:bg-neutral-50">
            <Link
              href={articlePath(article.slug)}
              className="line-clamp-2 font-serif text-[12px] font-bold leading-snug text-neutral-900 transition-colors hover:text-brand-800"
            >
              {article.title}
            </Link>
            <p className="mt-0.5 font-sans text-[10px] text-neutral-400">
              {article.author} · {formatShortDate(article.publishedAt)}
            </p>
          </li>
        ))}
      </ul>
    </aside>
  );
}
