import ArticleList from "@/components/public/ArticleList";
import Breadcrumb from "@/components/public/Breadcrumb";
import PageSidebar from "@/components/public/PageSidebar";
import PublicShell from "@/components/public/PublicShell";
import NewsCard from "@/components/public/NewsCard";
import { fetchCategoryData } from "@/lib/api-fetch";
import { getMockCategoryPayload } from "@/lib/mock-fallback";
import { getCategoryBySlug } from "@/data/mock-news";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const apiData = await fetchCategoryData(slug);
  const mockCategory = getCategoryBySlug(slug);
  const category = apiData?.category ?? mockCategory;
  if (!category) return { title: "Category Not Found" };
  return {
    title: category.name,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const apiData = await fetchCategoryData(slug);
  const data = apiData ?? getMockCategoryPayload(slug);

  if (!data) {
    notFound();
  }

  const { category, featuredArticle, articles, mostReadArticles, editorPicks } = data;

  return (
    <PublicShell>
      <div className="mx-auto max-w-[1280px] border-x border-neutral-200 bg-white px-3 sm:px-4">
        <div className="grid gap-0 lg:grid-cols-12 lg:gap-4">
          <main className="min-w-0 py-4 lg:col-span-9 lg:border-r lg:border-neutral-100 lg:pr-4">
            <Breadcrumb
              items={[{ label: "Home", href: "/" }, { label: category.name }]}
              className="mb-3"
            />

            <header className="mb-4 border-b border-neutral-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="h-5 w-1 bg-brand-800" />
                <h1 className="font-sans text-xl font-bold uppercase tracking-wide text-neutral-900 sm:text-2xl">
                  {category.name}
                </h1>
              </div>
              <p className="mt-2 font-sans text-sm leading-relaxed text-neutral-600">
                {category.description}
              </p>
              <p className="mt-1 font-sans text-[11px] text-neutral-400">
                {articles.length + (featuredArticle ? 1 : 0)}{" "}
                {(articles.length + (featuredArticle ? 1 : 0)) === 1
                  ? "article"
                  : "articles"}
              </p>
            </header>

            {!featuredArticle && articles.length === 0 ? (
              <ArticleList
                articles={[]}
                emptyMessage={`No articles published in ${category.name} yet. Check back soon.`}
              />
            ) : (
              <>
                {featuredArticle && (
                  <section className="mb-4 border-b border-neutral-200 pb-4" aria-label="Featured">
                    <p className="mb-2 font-sans text-[10px] font-bold uppercase tracking-wider text-brand-800">
                      Featured
                    </p>
                    <NewsCard article={featuredArticle} variant="hero-lead" showExcerpt />
                  </section>
                )}

                <section aria-label="Article list">
                  <p className="mb-2 font-sans text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                    Latest in {category.name}
                  </p>
                  <ArticleList
                    articles={articles}
                    emptyMessage="No additional articles in this category."
                  />
                </section>
              </>
            )}
          </main>

          <aside className="min-w-0 py-4 lg:col-span-3">
            <PageSidebar
              mostReadArticles={mostReadArticles}
              editorPicksArticles={editorPicks}
            />
          </aside>
        </div>
      </div>
    </PublicShell>
  );
}
