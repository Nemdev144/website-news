import type { Article } from "@/types/news";
import Link from "next/link";
import NewsCard from "./NewsCard";

interface QuickNewsRowProps {
  articles: Article[];
}

export default function QuickNewsRow({ articles }: QuickNewsRowProps) {
  return (
    <section className="border-b border-neutral-200 bg-neutral-50 py-2.5" aria-label="Quick news">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {articles.slice(0, 4).map((article) => (
          <NewsCard key={article.id} article={article} variant="mini" />
        ))}
      </div>
    </section>
  );
}

interface TopicsStripProps {
  topics: { id: string; title: string; slug: string }[];
}

export function TopicsStrip({ topics }: TopicsStripProps) {
  return (
    <section aria-label="Trending topics" className="border-b border-neutral-200 py-2">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-brand-800">
          Trending
        </span>
        {topics.map((topic) => (
          <Link
            key={topic.id}
            href={`#${topic.slug}`}
            className="rounded-full border border-neutral-200 bg-white px-2.5 py-0.5 font-sans text-[11px] font-medium text-neutral-700 transition-colors hover:border-brand-300 hover:text-brand-800"
          >
            #{topic.title.replace(/\s+/g, "")}
          </Link>
        ))}
      </div>
    </section>
  );
}
