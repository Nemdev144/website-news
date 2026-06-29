import type { Article } from "@/types/news";
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
      <SectionHeading className="mb-2.5">Quick News</SectionHeading>
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
