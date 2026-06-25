import {
  articles,
  getArticlesByCategory,
  getArticleBySlug,
  getCategoryBySlug,
  getEditorsPicks,
  getFeaturedArticle,
  getHotArticles,
  getMostReadArticles,
  getRelatedArticles,
  searchArticles,
  multimediaItems,
  trendingTopics,
} from "@/data/mock-news";
import { MAIN_CATEGORY_SLUGS } from "@/lib/article-mapper";
import type {
  ArticlePayload,
  CategoryPayload,
  HomePayload,
  SearchPayload,
} from "@/lib/public-articles";
import type { ArticleDetail } from "@/types/news";
import { generateArticleBody } from "@/lib/article-content";

export { trendingTopics };

export function getMockHomePayload(): HomePayload {
  const featured = getFeaturedArticle();
  const featuredArticles = featured
    ? [featured, ...articles.filter((a) => a.isFeatured && a.id !== featured.id)]
    : articles.filter((a) => a.isFeatured);

  return {
    featuredArticles: featuredArticles.length ? featuredArticles : [articles[0]],
    hotArticles: getHotArticles(),
    latestArticles: articles.slice(0, 24),
    mostReadArticles: getMostReadArticles(10),
    categorySections: MAIN_CATEGORY_SLUGS.map((category) => ({
      category,
      articles: getArticlesByCategory(category, 6),
    })),
    multimediaArticles: multimediaItems,
    editorPicks: getEditorsPicks(5),
  };
}

export function getMockHeroFromHome(data: HomePayload) {
  const featured = data.featuredArticles[0] ?? data.latestArticles[0];
  const excludeIds = new Set<string>(featured ? [featured.id] : []);

  const thumbArticles = data.latestArticles
    .filter((a) => !excludeIds.has(a.id))
    .slice(0, 3);
  thumbArticles.forEach((a) => excludeIds.add(a.id));

  const headlineArticles = data.latestArticles
    .filter((a) => !excludeIds.has(a.id))
    .slice(0, 4);

  const quickNews = data.latestArticles
    .filter((a) => !excludeIds.has(a.id))
    .slice(0, 4);

  return { featured, thumbArticles, headlineArticles, quickNews };
}

export function getMockCategoryPayload(slug: string): CategoryPayload | null {
  const category = getCategoryBySlug(slug);
  if (!category) return null;

  const all = getArticlesByCategory(slug);
  const featured =
    all.find((a) => a.isFeatured) ??
    [...all].sort((a, b) => b.viewCount - a.viewCount)[0] ??
    null;

  return {
    category,
    featuredArticle: featured,
    articles: featured ? all.filter((a) => a.id !== featured.id) : all,
    mostReadArticles: getMostReadArticles(8),
    editorPicks: getEditorsPicks(5),
  };
}

export function getMockArticlePayload(slug: string): ArticlePayload | null {
  const article = getArticleBySlug(slug);
  if (!article) return null;

  const detail: ArticleDetail = {
    ...article,
    content: generateArticleBody(article).join("\n\n"),
    source: "Website News",
  };

  return {
    article: detail,
    relatedArticles: getRelatedArticles(article, 4),
    mostReadArticles: getMostReadArticles(8),
    editorPicks: getEditorsPicks(5),
  };
}

export function getMockSearchPayload(query: string): SearchPayload {
  const results = searchArticles(query);
  return { query, results, count: results.length };
}
