import type {
  Article as PrismaArticle,
  Category as PrismaCategory,
  Media as PrismaMedia,
} from "@/generated/prisma/client";
import type {
  Article,
  ArticleDetail,
  ArticleMediaItem,
  Category,
  CategorySlug,
  MultimediaItem,
} from "@/types/news";

const CATEGORY_SLUGS: CategorySlug[] = [
  "world",
  "politics",
  "business",
  "technology",
  "society",
  "culture",
  "opinion",
  "multimedia",
];

export function isCategorySlug(slug: string): slug is CategorySlug {
  return CATEGORY_SLUGS.includes(slug as CategorySlug);
}

export function toCategorySlug(slug: string): CategorySlug {
  return isCategorySlug(slug) ? slug : "world";
}

export function mapCategoryToPublic(category: PrismaCategory): Category {
  return {
    name: category.name,
    slug: toCategorySlug(category.slug),
    description: category.description ?? "",
  };
}

export function mapArticleToPublic(
  article: PrismaArticle & { category: PrismaCategory },
): Article {
  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt ?? "",
    category: toCategorySlug(article.category.slug),
    image: article.coverImage ?? "/placeholder-news.jpg",
    author: article.author,
    publishedAt: (article.publishedAt ?? article.createdAt).toISOString(),
    viewCount: article.viewCount,
    likeCount: article.likeCount,
    isHot: article.isHot,
    isFeatured: article.isFeatured,
    isMostRead: article.isMostRead,
  };
}

export function mapMediaToPublic(media: PrismaMedia): ArticleMediaItem {
  return {
    id: media.id,
    url: media.url,
    title: media.title,
    caption: media.caption,
  };
}

export function mapArticleToDetail(
  article: PrismaArticle & {
    category: PrismaCategory;
    media?: PrismaMedia[];
  },
): ArticleDetail {
  return {
    ...mapArticleToPublic(article),
    content: article.content,
    source: article.source,
    media: article.media?.map(mapMediaToPublic) ?? [],
  };
}

export function mapArticlesToPublic(
  articles: (PrismaArticle & { category: PrismaCategory })[],
): Article[] {
  return articles.map(mapArticleToPublic);
}

export function mapArticleToMultimediaItem(
  article: PrismaArticle & { category: PrismaCategory },
): MultimediaItem {
  const slug = article.slug;
  let type: MultimediaItem["type"] = "photo";
  if (slug.includes("video") || slug.includes("documentary")) type = "video";
  else if (slug.includes("visual") || slug.includes("chart") || slug.includes("timeline"))
    type = "visual";

  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    type,
    image: article.coverImage ?? "/place-news.jpg",
    duration: type === "video" ? "10:24" : undefined,
  };
}

export function mapArticlesToMultimediaItems(
  articles: (PrismaArticle & { category: PrismaCategory })[],
): MultimediaItem[] {
  return articles.map(mapArticleToMultimediaItem);
}

export const MAIN_CATEGORY_SLUGS: CategorySlug[] = [
  "world",
  "politics",
  "business",
  "technology",
  "society",
  "culture",
  "opinion",
];
