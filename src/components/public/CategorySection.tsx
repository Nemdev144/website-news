import type { Article } from "@/types/news";
import { categoryPath, cn } from "@/lib/utils";
import Link from "next/link";
import NewsCard from "./NewsCard";

interface CategorySectionProps {
  category: string;
  categoryName?: string;
  articles: Article[];
  layout?: "featured" | "compact";
  className?: string;
}

/** Bài hiển thị ở khối trên: 1 lead + 2 phụ + 5 headline */
const TOP_BLOCK_SIZE = 8;

export default function CategorySection({
  category,
  categoryName,
  articles,
  layout = "featured",
  className,
}: CategorySectionProps) {
  if (articles.length === 0) return null;

  const label = categoryName ?? category;
  const isCompact = layout === "compact";
  const [lead, mid1, mid2, ...headlineRest] = articles;
  const headlineItems = isCompact
    ? articles.slice(1, 5)
    : headlineRest.slice(0, 5);
  const gridArticles = isCompact
    ? articles.slice(5)
    : articles.slice(TOP_BLOCK_SIZE);

  return (
    <section
      id={category}
      className={cn(
        "scroll-mt-[88px] border-t border-neutral-200 py-4 first:border-t-0 first:pt-0",
        isCompact &&
          "rounded-sm border border-neutral-200 bg-white p-3 shadow-sm first:border-t",
        className,
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span className="h-4 w-1 shrink-0 bg-brand-800" />
          <h2 className="font-sans text-sm font-bold uppercase tracking-wide text-neutral-900">
            {label}
          </h2>
        </div>
        <Link
          href={categoryPath(category)}
          className="shrink-0 font-sans text-[11px] font-semibold text-brand-800 transition-colors hover:text-brand-900"
        >
          View all →
        </Link>
      </div>

      {isCompact ? (
        <>
          <NewsCard
            article={lead}
            variant="stacked"
            className="news-card-shell rounded-sm border border-neutral-200 bg-white p-2 shadow-sm"
          />
          {headlineItems.length > 0 && (
            <div className="mt-2 rounded-sm border border-neutral-100 bg-neutral-50/60 px-1.5 pt-1">
              {headlineItems.map((article) => (
                <NewsCard key={article.id} article={article} variant="headline" />
              ))}
            </div>
          )}
          {gridArticles.length > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              {gridArticles.map((article) => (
                <NewsCard
                  key={article.id}
                  article={article}
                  variant="compact"
                  className="news-card-shell rounded-sm border border-neutral-200 bg-white p-1.5 shadow-sm"
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          {articles.length === 1 && (
            <NewsCard
              article={lead}
              variant="lead"
              showExcerpt
              className="news-card-shell rounded-sm border border-neutral-200 bg-white p-2 shadow-sm"
            />
          )}

          {articles.length === 2 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {[lead, mid1].map(
                (article) =>
                  article && (
                    <NewsCard
                      key={article.id}
                      article={article}
                      variant="lead"
                      showExcerpt
                      className="news-card-shell rounded-sm border border-neutral-200 bg-white p-2 shadow-sm"
                    />
                  ),
              )}
            </div>
          )}

          {articles.length === 3 && (
            <div className="grid gap-3 lg:grid-cols-12">
              <div className="news-card-shell rounded-sm border border-neutral-200 bg-white p-2 shadow-sm lg:col-span-7">
                <NewsCard article={lead} variant="lead" showExcerpt />
              </div>
              <div className="flex flex-col gap-2 lg:col-span-5">
                {[mid1, mid2].map(
                  (article) =>
                    article && (
                      <NewsCard
                        key={article.id}
                        article={article}
                        variant="stacked"
                        className="news-card-shell rounded-sm border border-neutral-200 bg-white p-2 shadow-sm"
                      />
                    ),
                )}
              </div>
            </div>
          )}

          {articles.length >= 4 && (
            <>
              <div className="grid gap-3 lg:grid-cols-12">
                <div className="news-card-shell rounded-sm border border-neutral-200 bg-white p-2 shadow-sm lg:col-span-5">
                  <NewsCard article={lead} variant="lead" showExcerpt />
                </div>

                <div className="flex flex-col gap-2 lg:col-span-4">
                  {[mid1, mid2].map(
                    (article) =>
                      article && (
                        <NewsCard
                          key={article.id}
                          article={article}
                          variant="stacked"
                          className="news-card-shell h-full rounded-sm border border-neutral-200 bg-white p-2 shadow-sm"
                        />
                      ),
                  )}
                </div>

                {headlineItems.length > 0 && (
                  <div className="rounded-sm border border-neutral-100 bg-neutral-50/60 p-2 lg:col-span-3">
                    <p className="mb-1 font-sans text-[9px] font-bold uppercase tracking-wider text-neutral-400">
                      Latest
                    </p>
                    {headlineItems.map((article) => (
                      <NewsCard key={article.id} article={article} variant="headline" />
                    ))}
                  </div>
                )}
              </div>

              {gridArticles.length > 0 && (
                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {gridArticles.map((article) => (
                    <NewsCard
                      key={article.id}
                      article={article}
                      variant="default"
                      showExcerpt
                      className="news-card-shell h-full rounded-sm border border-neutral-200 bg-white p-2 shadow-sm"
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}
    </section>
  );
}
