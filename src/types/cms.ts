export const ArticleStatus = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  ARCHIVED: "ARCHIVED",
} as const;

export type ArticleStatus =
  (typeof ArticleStatus)[keyof typeof ArticleStatus];

export const MediaType = {
  IMAGE: "IMAGE",
  VIDEO: "VIDEO",
} as const;

export type MediaType = (typeof MediaType)[keyof typeof MediaType];

export const ARTICLE_STATUSES = Object.values(ArticleStatus);
export const MEDIA_TYPES = Object.values(MediaType);
