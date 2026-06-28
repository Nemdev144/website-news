import { ArticleImage } from "@/components/public/NewsCard";
import type { Article } from "@/types/news";
import { articlePath, formatArticleTimestamp } from "@/lib/utils";
import Link from "next/link";

interface CategoryArticleLayoutProps {
  articles: Article[];
  categoryName: string;
  featuredArticle?: Article | null;
  isFirstPage?: boolean;
}

function CategoryLeadBlock({ article }: { article: Article }) {
  return (
    <Link href={articlePath(article.slug)} className="group block">
      <ArticleImage
        article={article}
        showBadge={false}
        className="aspect-[16/10] w-full rounded-sm sm:aspect-[2/1]"
      />
      <h2 className="mt-3 font-serif text-xl font-bold leading-[1.35] text-neutral-900 transition-colors group-hover:text-brand-800 sm:text-2xl">
        {article.title}
      </h2>
      {article.excerpt ? (
        <p className="mt-2 line-clamp-4 font-sans text-sm leading-[1.65] text-neutral-600">
          {article.excerpt}
        </p>
      ) : null}
    </Link>
  );
}

function CategoryMidBlock({
  article,
  isLast,
}: {
  article: Article;
  isLast?: boolean;
}) {
  return (
    <Link
      href={articlePath(article.slug)}
      className={`group block py-4 ${isLast ? "" : "border-b border-dotted border-neutral-300"}`}
    >
      <ArticleImage
        article={article}
        showBadge={false}
        className="aspect-[3/2] w-full rounded-sm"
      />
      <h3 className="mt-2.5 font-serif text-[15px] font-bold leading-[1.4] text-neutral-900 transition-colors group-hover:text-brand-800 sm:text-base">
        {article.title}
      </h3>
    </Link>
  );
}

function CategoryListItem({ article }: { article: Article }) {
  return (
    <Link
      href={articlePath(article.slug)}
      className="group flex items-start gap-3 border-b border-dotted border-neutral-300 py-4 last:border-b-0 sm:gap-5 sm:py-5"
    >
      <ArticleImage
        article={article}
        showBadge={false}
        className="aspect-[3/2] w-[34%] max-w-[240px] min-w-[120px] shrink-0 rounded-sm sm:w-[220px] sm:max-w-none"
      />
      <div className="min-w-0 flex-1 pt-0.5">
        <time
          dateTime={String(article.publishedAt)}
          className="block font-sans text-xs leading-none text-neutral-400"
        >
          {formatArticleTimestamp(article.publishedAt)}
        </time>
        <h3 className="mt-2 font-serif text-[17px] font-bold leading-[1.35] text-neutral-900 transition-colors group-hover:text-brand-800 sm:text-lg">
          {article.title}
        </h3>
        {article.excerpt ? (
          <p className="mt-2 line-clamp-3 font-sans text-sm leading-[1.65] text-neutral-600">
            {article.excerpt}
          </p>
        ) : null}
      </div>
    </Link>
  );
}

function CategoryArticleList({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null;

  return (
    <section aria-label="More articles" className="border-t border-dotted border-neutral-300">
      {articles.map((article) => (
        <CategoryListItem key={article.id} article={article} />
      ))}
    </section>
  );
}

interface SpotlightProps {
  lead: Article;
  midArticles: Article[];
}

function CategorySpotlightThree({ lead, midArticles }: SpotlightProps) {
  return (
    <section aria-label="Top stories" className="pb-2">
      <div className="grid gap-6 lg:grid-cols-12 lg:items-start lg:gap-0">
        <div className="lg:col-span-8 lg:border-r lg:border-dotted lg:border-neutral-300 lg:pr-6">
          <CategoryLeadBlock article={lead} />
        </div>

        {midArticles.length > 0 ? (
          <div className="lg:col-span-4 lg:pl-6">
            {midArticles.map((article, index) => (
              <CategoryMidBlock
                key={article.id}
                article={article}
                isLast={index === midArticles.length - 1}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default function CategoryArticleLayout({
  articles,
  categoryName,
  featuredArticle,
  isFirstPage = false,
}: CategoryArticleLayoutProps) {
  if (articles.length === 0 && !featuredArticle) {
    return (
      <div className="border border-dashed border-neutral-300 bg-neutral-50 px-6 py-12 text-center">
        <p className="font-sans text-sm text-neutral-500">
          No articles published in {categoryName} yet.
        </p>
      </div>
    );
  }

  if (isFirstPage) {
    const lead = featuredArticle ?? articles[0] ?? null;
    if (!lead) {
      return <CategoryArticleList articles={articles} />;
    }

    const pool = featuredArticle ? articles : articles.slice(1);
    const midArticles = pool.slice(0, 2);
    const moreArticles = pool.slice(2);

    return (
      <div>
        <CategorySpotlightThree lead={lead} midArticles={midArticles} />
        <CategoryArticleList articles={moreArticles} />
      </div>
    );
  }

  return <CategoryArticleList articles={articles} />;
}
