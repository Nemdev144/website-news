import type { HomePayload, CategoryPayload, ArticlePayload, SearchPayload } from "@/lib/public-articles";

function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${getBaseUrl()}${path}`, {
      cache: "no-store",
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export function fetchHomeData(): Promise<HomePayload | null> {
  return fetchJson<HomePayload>("/api/public/home");
}

export function fetchCategoryData(slug: string): Promise<CategoryPayload | null> {
  return fetchJson<CategoryPayload>(`/api/public/categories/${slug}`);
}

export function fetchArticleData(
  slug: string,
  options?: { incrementViews?: boolean },
): Promise<ArticlePayload | null> {
  const query =
    options?.incrementViews === false ? "?incrementViews=false" : "";
  return fetchJson<ArticlePayload>(`/api/public/articles/${slug}${query}`);
}

export function fetchSearchData(query: string): Promise<SearchPayload | null> {
  const encoded = encodeURIComponent(query.trim());
  return fetchJson<SearchPayload>(`/api/public/search?q=${encoded}`);
}
