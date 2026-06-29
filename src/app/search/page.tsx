import ArticleList from "@/components/public/ArticleList";
import Breadcrumb from "@/components/public/Breadcrumb";
import PageSidebar from "@/components/public/PageSidebar";
import PublicShell from "@/components/public/PublicShell";
import SearchForm from "@/components/public/SearchForm";
import { fetchSearchData } from "@/lib/api-fetch";
import { mapArticlesToPublic } from "@/lib/article-mapper";
import { fetchMostReadArticles } from "@/lib/public-articles";
import { SITE_NAME } from "@/lib/site";
import type { Metadata } from "next";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  return {
    title: query ? `Search: ${query}` : "Search",
    description: `Search articles on ${SITE_NAME}`,
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const data = query ? await fetchSearchData(query) : null;
  const results = data?.results ?? [];

  let mostReadArticles: Awaited<ReturnType<typeof mapArticlesToPublic>> = [];
  try {
    mostReadArticles = mapArticlesToPublic(await fetchMostReadArticles(8));
  } catch {
    mostReadArticles = [];
  }

  return (
    <PublicShell showHotBar={false}>
      <div className="mx-auto max-w-[1280px] border-x border-neutral-200 bg-white px-3 sm:px-4">
        <div className="grid gap-0 lg:grid-cols-12 lg:gap-4">
          <main className="min-w-0 py-4 lg:col-span-9 lg:border-r lg:border-neutral-100 lg:pr-4">
            <Breadcrumb
              items={[{ label: "Home", href: "/" }, { label: "Search" }]}
              className="mb-3"
            />

            <header className="mb-4 border-b border-neutral-200 pb-4">
              <h1 className="font-serif text-2xl font-bold text-neutral-900">Search</h1>
              <p className="mt-1 font-sans text-sm text-neutral-600">
                Find stories across {SITE_NAME}
              </p>
              <div className="mt-3 max-w-lg">
                <SearchForm
                  defaultQuery={query}
                  inputId="search-page-input"
                  compact={false}
                />
              </div>
              {query && (
                <p className="mt-3 font-sans text-[11px] text-neutral-500">
                  {results.length} {results.length === 1 ? "result" : "results"} for
                  &ldquo;{query}&rdquo;
                </p>
              )}
            </header>

            {!query ? (
              <div className="rounded-sm border border-dashed border-neutral-300 bg-neutral-50 px-6 py-12 text-center">
                <p className="font-sans text-sm text-neutral-500">
                  Enter a keyword to search articles by title or excerpt.
                </p>
              </div>
            ) : (
              <ArticleList
                articles={results}
                emptyMessage={`No articles found for "${query}". Try different keywords.`}
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
