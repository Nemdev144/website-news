import Breadcrumb from "@/components/public/Breadcrumb";
import ArticleBody from "@/components/public/ArticleBody";
import ArticleLikeButton from "@/components/public/ArticleLikeButton";
import PageSidebar from "@/components/public/PageSidebar";
import PublicShell from "@/components/public/PublicShell";
import NewsCard from "@/components/public/NewsCard";
import SectionHeading from "@/components/public/SectionHeading";
import { fetchArticleData } from "@/lib/api-fetch";
import {
  categoryLabel,
  categoryPath,
  formatShortDate,
  formatViewCount,
} from "@/lib/utils";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await fetchArticleData(slug, { incrementViews: false });
  if (!data) return { title: "Article Not Found" };
  return {
    title: data.article.title,
    description: data.article.excerpt,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const data = await fetchArticleData(slug);

  if (!data) {
    notFound();
  }

  const { article, relatedArticles, mostReadArticles, editorPicks } = data;
  const categoryName = categoryLabel(article.category);

  return (
    <PublicShell>
      <div className="mx-auto max-w-[1280px] border-x border-neutral-200 bg-white px-3 sm:px-4">
        <div className="grid gap-0 lg:grid-cols-12 lg:gap-4">
          <article className="min-w-0 py-4 lg:col-span-9 lg:border-r lg:border-neutral-100 lg:pr-4">
            <Breadcrumb
              items={[
                { label: "Home", href: "/" },
                { label: categoryName, href: categoryPath(article.category) },
              ]}
              bold
              className="mb-3"
            />

            <header className="mb-4">
              <h1 className="font-serif text-2xl font-bold leading-snug text-neutral-900 sm:text-3xl">
                {article.title}
              </h1>
              <p className="mt-2 font-sans text-[15px] leading-relaxed text-neutral-600">
                {article.excerpt}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 border-y border-neutral-200 py-2 font-sans text-[11px] text-neutral-500">
                <span className="font-medium text-neutral-700">By {article.author}</span>
                <span>·</span>
                <time dateTime={article.publishedAt}>
                  {formatShortDate(article.publishedAt)}
                </time>
                <span>·</span>
                <span>{formatViewCount(article.viewCount)} views</span>
                <span>·</span>
                <span>{formatViewCount(article.likeCount ?? 0)} likes</span>
                {article.source && (
                  <>
                    <span>·</span>
                    <span>{article.source}</span>
                  </>
                )}
              </div>
              <div className="mt-3">
                <ArticleLikeButton
                  slug={article.slug}
                  initialLikeCount={article.likeCount ?? 0}
                />
              </div>
            </header>

            <ArticleBody content={article.content} articleTitle={article.title} />

            {relatedArticles.length > 0 && (
              <section
                className="mt-8 border-t border-neutral-200 pt-5"
                aria-label="Related articles"
              >
                <SectionHeading>Related in {categoryName}</SectionHeading>
                <div className="grid gap-3 sm:grid-cols-2">
                  {relatedArticles.map((item) => (
                    <NewsCard key={item.id} article={item} variant="compact" />
                  ))}
                </div>
              </section>
            )}
          </article>

          <aside className="min-w-0 py-4 lg:col-span-3">
            <PageSidebar
              showNewsletter={false}
              mostReadArticles={mostReadArticles}
              editorPicksArticles={editorPicks}
            />
          </aside>
        </div>
      </div>
    </PublicShell>
  );
}
