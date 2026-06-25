import type { Article } from "@/types/news";
import NewsCard from "./NewsCard";

interface HeroNewsProps {
  featured: Article;
  thumbArticles: Article[];
  headlineArticles: Article[];
}

export default function HeroNews({
  featured,
  thumbArticles,
  headlineArticles,
}: HeroNewsProps) {
  const thumbs = thumbArticles.slice(0, 3);
  const headlines = headlineArticles.slice(0, 4);

  return (
    <section className="border-b border-neutral-200 bg-white pb-3" aria-label="Featured news">
      <div className="grid gap-3 lg:grid-cols-8">
        {/* Lead story — image + full info below */}
        <div className="lg:col-span-5">
          <NewsCard article={featured} variant="hero-lead" showExcerpt />
        </div>

        {/* Latest headlines */}
        <div className="lg:col-span-3">
          <div className="mb-1.5 flex items-center gap-2 border-b-2 border-brand-800 pb-1">
            <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-brand-800">
              Latest
            </span>
          </div>
          <div className="rounded-sm border border-neutral-100 bg-neutral-50/50">
            {thumbs.map((article) => (
              <NewsCard key={article.id} article={article} variant="horizontal" />
            ))}
            <div className="border-t border-neutral-200 px-1">
              {headlines.map((article) => (
                <NewsCard key={article.id} article={article} variant="headline" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
