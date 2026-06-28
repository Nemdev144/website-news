import type { Article } from "@/types/news";
import Link from "next/link";
import NewsCard from "./NewsCard";
import SectionHeading from "./SectionHeading";

interface HomeExtrasProps {
  articles: Article[];
}

export default function HomeExtras({ articles }: HomeExtrasProps) {
  if (articles.length === 0) return null;

  return (
    <section
      className="mb-4 border-b border-neutral-200 pb-4"
      aria-label="Quick headlines"
    >
      <SectionHeading className="mb-2.5">Tin nhanh</SectionHeading>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {articles.slice(0, 4).map((article) => (
          <NewsCard
            key={article.id}
            article={article}
            variant="mini"
            className="news-card-shell h-full rounded-sm border border-neutral-200 bg-white p-1.5 shadow-sm"
          />
        ))}
      </div>
    </section>
  );
}

interface TopicsStripProps {
  topics: { id: string; title: string; slug: string }[];
}

export function TopicsStrip({ topics }: TopicsStripProps) {
  if (topics.length === 0) return null;

  return (
    <nav aria-label="Danh mục trên trang chủ" className="border-b border-neutral-200 pb-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 font-sans text-[10px] font-bold uppercase tracking-wider text-brand-800">
          Chuyên mục
        </span>
        {topics.map((topic) => (
          <Link
            key={topic.id}
            href={`#${topic.slug}`}
            className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 font-sans text-[11px] font-medium text-neutral-700 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-800"
          >
            {topic.title}
          </Link>
        ))}
      </div>
    </nav>
  );
}
