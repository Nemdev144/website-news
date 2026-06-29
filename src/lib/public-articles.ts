import { ArticleStatus } from "@/generated/prisma/client";
import {
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
    include: articleInclude,
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

async function fetchHomeCategorySections(limitPerCategory = 12) {
  const categories = await prisma.category.findMany({
    where: {
      isActive: true,
      slug: { not: "multimedia" },
      articles: {
        some: { status: ArticleStatus.PUBLISHED },
      },
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: { slug: true, name: true },
  });

  const sections = await Promise.all(
    categories.map(async (category) => {
      const rows = await fetchArticlesByCategorySlug(category.slug, limitPerCategory);
      return {
        category: category.slug,
        categoryName: category.name,
        articles: mapArticlesToPublic(rows),
      };
    }),
  );

  return sections.filter((section) => section.articles.length > 0);
}

export async function getHomePayload() {
  const [
    featuredRows,
    hotRows,
    latestRows,
    mostReadRows,
    multimediaRows,
  ] = await Promise.all([
    fetchFeaturedArticles(5),
    fetchHotArticles(12),
    fetchPublishedArticles(24),
    fetchMostReadArticles(10),
    fetchMultimediaArticles(6),
  ]);

  const categorySections = await fetchHomeCategorySections(12);

  return {
    featuredArticles: mapArticlesToPublic(featuredRows),
    hotArticles: mapArticlesToPublic(hotRows),
    latestArticles: mapArticlesToPublic(latestRows),
    mostReadArticles: mapArticlesToPublic(mostReadRows),
    categorySections,
    multimediaArticles: mapArticlesToMultimediaItems(multimediaRows),
  };
}

const DEFAULT_CATEGORY_PAGE_SIZE = 18;

export async function getCategoryPayload(
  slug: string,
  options?: { page?: number; limit?: number },
) {
  const categoryRow = await fetchCategoryBySlug(slug);
  if (!categoryRow) return null;

  const page = Math.max(options?.page ?? 1, 1);
  const limit = Math.min(Math.max(options?.limit ?? DEFAULT_CATEGORY_PAGE_SIZE, 1), 48);

  const [articleRows, mostReadRows] = await Promise.all([
    fetchArticlesByCategorySlug(slug),
    fetchMostReadArticles(8),
  ]);

  const articles = mapArticlesToPublic(articleRows);
  const featuredRow =
    articleRows.find((a) => a.isFeatured) ??
    [...articleRows].sort((a, b) => b.viewCount - a.viewCount)[0];

  const featuredArticle = featuredRow ? mapArticleToPublic(featuredRow) : null;
  const listArticles = featuredRow
    ? articles.filter((a) => a.id !== featuredArticle?.id)
    : articles;

  const total = articleRows.length;
  const listTotal = listArticles.length;
  const totalPages = Math.max(1, Math.ceil(listTotal / limit));
  const safePage = Math.min(page, totalPages);
  const skip = (safePage - 1) * limit;
  const paginatedArticles = listArticles.slice(skip, skip + limit);

  return {
    category: mapCategoryToPublic(categoryRow),
    featuredArticle: safePage === 1 ? featuredArticle : null,
    articles: paginatedArticles,
    pagination: {
      page: safePage,
      limit,
      total,
      listTotal,
      totalPages,
    },
    mostReadArticles: mapArticlesToPublic(mostReadRows),
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

  const [relatedRows, mostReadRows] = await Promise.all([
    fetchRelatedArticles(updatedRow.category.slug, updatedRow.id, 4),
    fetchMostReadArticles(8),
  ]);

  return {
    article: mapArticleToDetail(updatedRow),
    relatedArticles: mapArticlesToPublic(relatedRows),
    mostReadArticles: mapArticlesToPublic(mostReadRows),
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
