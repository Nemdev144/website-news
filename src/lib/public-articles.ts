import { ArticleStatus } from "@/generated/prisma/client";
import {
  MAIN_CATEGORY_SLUGS,
  mapArticleToDetail,
  mapArticleToPublic,
  mapArticlesToMultimediaItems,
  mapArticlesToPublic,
  mapCategoryToPublic,
} from "@/lib/article-mapper";
import { prisma } from "@/lib/prisma";

const articleInclude = { category: true } as const;

const publishedWhere = { status: ArticleStatus.PUBLISHED };

export async function fetchPublishedArticles(limit?: number) {
  return prisma.article.findMany({
    where: publishedWhere,
    include: articleInclude,
    orderBy: { publishedAt: "desc" },
    ...(limit ? { take: limit } : {}),
  });
}

export async function fetchHotArticles(limit = 12) {
  return prisma.article.findMany({
    where: { ...publishedWhere, isHot: true },
    include: articleInclude,
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}

export async function fetchFeaturedArticles(limit = 5) {
  return prisma.article.findMany({
    where: { ...publishedWhere, isFeatured: true },
    include: articleInclude,
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}

export async function fetchMostReadArticles(limit = 10) {
  return prisma.article.findMany({
    where: { ...publishedWhere, isMostRead: true },
    include: articleInclude,
    orderBy: { viewCount: "desc" },
    take: limit,
  });
}

export async function fetchEditorPicks(limit = 5) {
  return prisma.article.findMany({
    where: {
      ...publishedWhere,
      category: { slug: "opinion" },
    },
    include: articleInclude,
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}

export async function fetchMultimediaArticles(limit = 6) {
  return prisma.article.findMany({
    where: {
      ...publishedWhere,
      category: { slug: "multimedia" },
    },
    include: articleInclude,
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}

export async function fetchCategoryBySlug(slug: string) {
  return prisma.category.findFirst({
    where: { slug, isActive: true },
  });
}

export async function fetchActiveCategoriesForNav() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: {
      name: true,
      slug: true,
      description: true,
    },
  });
}

export async function fetchArticlesByCategorySlug(slug: string, limit?: number) {
  return prisma.article.findMany({
    where: {
      ...publishedWhere,
      category: { slug },
    },
    include: articleInclude,
    orderBy: { publishedAt: "desc" },
    ...(limit ? { take: limit } : {}),
  });
}

export async function fetchArticleBySlug(slug: string) {
  return prisma.article.findFirst({
    where: { slug, status: ArticleStatus.PUBLISHED },
    include: {
      category: true,
      media: {
        where: { type: "IMAGE" },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      },
    },
  });
}

export async function fetchRelatedArticles(
  categorySlug: string,
  excludeId: string,
  limit = 4,
) {
  return prisma.article.findMany({
    where: {
      ...publishedWhere,
      category: { slug: categorySlug },
      id: { not: excludeId },
    },
    include: articleInclude,
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}

export async function searchPublishedArticles(query: string, limit = 30) {
  return prisma.article.findMany({
    where: {
      ...publishedWhere,
      OR: [
        { title: { contains: query } },
        { excerpt: { contains: query } },
      ],
    },
    include: articleInclude,
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}

export async function incrementArticleViewCount(id: string) {
  return prisma.article.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
    include: articleInclude,
  });
}

export async function getHomePayload() {
  const [
    featuredRows,
    hotRows,
    latestRows,
    mostReadRows,
    editorRows,
    multimediaRows,
  ] = await Promise.all([
    fetchFeaturedArticles(5),
    fetchHotArticles(12),
    fetchPublishedArticles(24),
    fetchMostReadArticles(10),
    fetchEditorPicks(5),
    fetchMultimediaArticles(6),
  ]);

  const categorySections = await Promise.all(
    MAIN_CATEGORY_SLUGS.map(async (slug) => {
      const rows = await fetchArticlesByCategorySlug(slug, 6);
      return {
        category: slug,
        articles: mapArticlesToPublic(rows),
      };
    }),
  );

  return {
    featuredArticles: mapArticlesToPublic(featuredRows),
    hotArticles: mapArticlesToPublic(hotRows),
    latestArticles: mapArticlesToPublic(latestRows),
    mostReadArticles: mapArticlesToPublic(mostReadRows),
    categorySections,
    multimediaArticles: mapArticlesToMultimediaItems(multimediaRows),
    editorPicks: mapArticlesToPublic(editorRows),
  };
}

export async function getCategoryPayload(slug: string) {
  const categoryRow = await fetchCategoryBySlug(slug);
  if (!categoryRow) return null;

  const [articleRows, mostReadRows, editorRows] = await Promise.all([
    fetchArticlesByCategorySlug(slug),
    fetchMostReadArticles(8),
    fetchEditorPicks(5),
  ]);

  const articles = mapArticlesToPublic(articleRows);
  const featuredRow =
    articleRows.find((a) => a.isFeatured) ??
    [...articleRows].sort((a, b) => b.viewCount - a.viewCount)[0];

  const featuredArticle = featuredRow ? mapArticleToPublic(featuredRow) : null;
  const listArticles = featuredRow
    ? articles.filter((a) => a.id !== featuredArticle?.id)
    : articles;

  return {
    category: mapCategoryToPublic(categoryRow),
    featuredArticle,
    articles: listArticles,
    mostReadArticles: mapArticlesToPublic(mostReadRows),
    editorPicks: mapArticlesToPublic(editorRows),
  };
}

export async function getArticlePayload(
  slug: string,
  options?: { incrementViews?: boolean },
) {
  const articleRow = await fetchArticleBySlug(slug);
  if (!articleRow) return null;

  const updatedRow =
    options?.incrementViews === false
      ? articleRow
      : await incrementArticleViewCount(articleRow.id);

  const [relatedRows, mostReadRows, editorRows] = await Promise.all([
    fetchRelatedArticles(updatedRow.category.slug, updatedRow.id, 4),
    fetchMostReadArticles(8),
    fetchEditorPicks(5),
  ]);

  return {
    article: mapArticleToDetail(updatedRow),
    relatedArticles: mapArticlesToPublic(relatedRows),
    mostReadArticles: mapArticlesToPublic(mostReadRows),
    editorPicks: mapArticlesToPublic(editorRows),
  };
}

export async function getSearchPayload(query: string) {
  const rows = await searchPublishedArticles(query);
  const results = mapArticlesToPublic(rows);
  return {
    query,
    results,
    count: results.length,
  };
}

export type HomePayload = Awaited<ReturnType<typeof getHomePayload>>;
export type CategoryPayload = NonNullable<Awaited<ReturnType<typeof getCategoryPayload>>>;
export type ArticlePayload = NonNullable<Awaited<ReturnType<typeof getArticlePayload>>>;
export type SearchPayload = Awaited<ReturnType<typeof getSearchPayload>>;
