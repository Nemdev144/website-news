import type { HomePayload } from "@/lib/public-articles";
import type { Article } from "@/types/news";

const HERO_CAROUSEL_SIZE = 5;

export function getHeroFromHome(data: HomePayload) {
  const carouselArticles = data.latestArticles.slice(0, HERO_CAROUSEL_SIZE);
  const excludeIds = new Set(carouselArticles.map((article) => article.id));

  const thumbArticles = data.latestArticles
    .filter((article) => !excludeIds.has(article.id))
    .slice(0, 3);
  thumbArticles.forEach((article) => excludeIds.add(article.id));

  const headlineArticles = data.latestArticles
    .filter((article) => !excludeIds.has(article.id))
    .slice(0, 4);

  const quickNews = data.latestArticles
    .filter((article) => !excludeIds.has(article.id))
    .slice(0, 4);

  return { carouselArticles, thumbArticles, headlineArticles, quickNews };
}

export function emptyHomeHero(): {
  carouselArticles: Article[];
  thumbArticles: Article[];
  headlineArticles: Article[];
  quickNews: Article[];
} {
  return {
    carouselArticles: [],
    thumbArticles: [],
    headlineArticles: [],
    quickNews: [],
  };
}
