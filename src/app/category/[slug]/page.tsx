import CategoryArticleLayout from "@/components/public/CategoryArticleLayout";
import CategoryPagination from "@/components/public/CategoryPagination";
import Breadcrumb from "@/components/public/Breadcrumb";
import PageSidebar from "@/components/public/PageSidebar";
import PublicShell from "@/components/public/PublicShell";
import { fetchCategoryData } from "@/lib/api-fetch";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

const PAGE_SIZE = 24;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await fetchCategoryData(slug);
  if (!data) return { title: "Category Not Found" };
  return {
    title: data.category.name,
    description: data.category.description,
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(Number(pageParam ?? 1), 1);

  const data = await fetchCategoryData(slug, { page, limit: PAGE_SIZE });

  if (!data) {
    notFound();
  }

  const {
    category,
    featuredArticle,
    articles,
    mostReadArticles,
    pagination,
  } = data;

  const totalArticles = pagination?.total ?? articles.length + (featuredArticle ? 1 : 0);
  const isFirstPage = page === 1;

  return (
    <PublicShell>
      <div className="mx-auto max-w-[1280px] border-x border-neutral-200 bg-white px-3 sm:px-4">
        <div className="grid gap-0 lg:grid-cols-12 lg:gap-4">
          <main className="min-w-0 py-4 lg:col-span-9 lg:border-r lg:border-neutral-100 lg:pr-4">
            <Breadcrumb
              items={[{ label: "Home", href: "/" }, { label: category.name }]}
              className="mb-3"
            />

            <header className="mb-4">
              <div className="flex flex-wrap items-end justify-between gap-2">
                <h1 className="font-sans text-2xl font-bold uppercase tracking-wide text-neutral-900 sm:text-[26px]">
                  {category.name}
                </h1>
                <span className="font-sans text-xs text-neutral-400">
                  {totalArticles} {totalArticles === 1 ? "article" : "articles"}
                </span>
              </div>
              {category.description ? (
                <p className="mt-1.5 font-sans text-sm text-neutral-500">
                  {category.description}
                </p>
              ) : (
                <p className="mt-1.5 font-sans text-sm text-neutral-500">
                  Latest · Analysis · Breaking news
                </p>
              )}
              <div className="mt-3 border-b border-dotted border-neutral-400" />
            </header>

            <CategoryArticleLayout
              featuredArticle={isFirstPage ? featuredArticle : null}
              articles={articles}
              categoryName={category.name}
              isFirstPage={isFirstPage}
            />

            {pagination && pagination.totalPages > 1 && (
              <CategoryPagination
                slug={slug}
                page={pagination.page}
                totalPages={pagination.totalPages}
                total={pagination.total}
              />
            )}
          </main>

          <aside className="min-w-0 py-4 lg:col-span-3">
            <PageSidebar mostReadArticles={mostReadArticles} />
          </aside>
        </div>
      </div>
    </PublicShell>
  );
}
