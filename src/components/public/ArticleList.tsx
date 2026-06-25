import type { Article } from "@/types/news";
import NewsCard from "./NewsCard";

interface ArticleListProps {
  articles: Article[];
  emptyMessage?: string;
}

export default function ArticleList({
  articles,
  emptyMessage = "No articles found.",
}: ArticleListProps) {
  if (articles.length === 0) {
    return (
      <div className="rounded-sm border border-dashed border-neutral-300 bg-neutral-50 px-6 py-12 text-center">
        <p className="font-sans text-sm text-neutral-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-neutral-200">
      {articles.map((article) => (
        <div key={article.id} className="py-3 first:pt-0">
          <NewsCard article={article} variant="horizontal" />
        </div>
      ))}
    </div>
  );
}
