import type { Article } from "@/types/news";
import HeroStoryCarousel from "./HeroStoryCarousel";
import NewsCard from "./NewsCard";

interface HeroNewsProps {
  carouselArticles: Article[];
  thumbArticles: Article[];
  headlineArticles: Article[];
}

export default function HeroNews({
  carouselArticles,
  thumbArticles,
  headlineArticles,
}: HeroNewsProps) {
  const thumbs = thumbArticles.slice(0, 3);
  const headlines = headlineArticles.slice(0, 4);

  return (
    <section className="border-b border-neutral-200 bg-white pb-3" aria-label="Featured news">
      <div className="grid gap-3 lg:grid-cols-8 lg:items-stretch">
        <div className="relative lg:col-span-5 lg:min-h-[520px]">
          <HeroStoryCarousel
            articles={carouselArticles}
            className="h-full lg:absolute lg:inset-0"
          />
        </div>

        <div className="flex flex-col lg:col-span-3">
          <div className="mb-1.5 flex items-center gap-2 border-b-2 border-brand-800 pb-1">
            <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-brand-800">
              Latest
            </span>
          </div>
          <div className="flex-1 rounded-sm border border-neutral-100 bg-neutral-50/50">
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
