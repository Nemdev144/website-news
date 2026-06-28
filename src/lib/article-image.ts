import type { Article } from "@/types/news";

const PLACEHOLDER_PATHS = new Set([
  "/placeholder-news.jpg",
  "/place-news.jpg",
]);

export function articleHasImage(image?: string | null): boolean {
  if (!image?.trim()) return false;
  if (PLACEHOLDER_PATHS.has(image)) return false;
  if (image.startsWith("/images/placeholders/")) return false;
  return true;
}

export function articleHasCover(article: Pick<Article, "image">): boolean {
  return articleHasImage(article.image);
}
