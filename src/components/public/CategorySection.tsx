import type { Article } from "@/types/news";
import { categoryLabel, categoryPath } from "@/lib/utils";
import Link from "next/link";
import NewsCard from "./NewsCard";

interface CategorySectionProps {
  category: string;
  articles: Article[];
}

export default function CategorySection({ category, articles }: CategorySectionProps) {
  if (articles.length < 4) return null;

  const [lead, mid1, mid2, ...headlineRest] = articles;
  const headlineItems = headlineRest.slice(0, 3);

  return (
    <section id={category} className="scroll-mt-[88px] border-t border-neutral-200 py-3 first:border-t-0 first:pt-0">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-4 w-1 bg-brand-800" />
          <h2 className="font-sans text-sm font-bold uppercase tracking-wide text-neutral-900">
            {categoryLabel(category)}
          </h2>
        </div>
        <Link
          href={categoryPath(category)}
          className="font-sans text-[11px] font-semibold text-brand-800 transition-colors hover:text-brand-900"
        >
          View all →
        </Link>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-12">
        {/* Lead */}
        <div className="md:col-span-2 lg:col-span-5">
          <NewsCard article={lead} variant="lead" showExcerpt />
        </div>

        {/* Two stacked */}
        <div className="flex flex-col gap-1 md:col-span-2 lg:col-span-4">
          {[mid1, mid2].map(
            (article) =>
              article && (
                <NewsCard
                  key={article.id}
                  article={article}
                  variant="stacked"
                  className="rounded-sm border border-neutral-100 bg-neutral-50/40 p-1.5"
                />
              ),
          )}
        </div>

        {/* Headlines */}
        <div className="rounded-sm border border-neutral-100 bg-neutral-50/40 p-2 md:col-span-2 lg:col-span-3">
          <p className="mb-1 font-sans text-[9px] font-bold uppercase tracking-wider text-neutral-400">
            More in {categoryLabel(category)}
          </p>
          {headlineItems.map((article) => (
            <NewsCard key={article.id} article={article} variant="headline" />
          ))}
        </div>
      </div>
    </section>
  );
}
