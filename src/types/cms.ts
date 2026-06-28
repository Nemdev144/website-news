export const ArticleStatus = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  ARCHIVED: "ARCHIVED",
} as const;

export type ArticleStatus =
  (typeof ArticleStatus)[keyof typeof ArticleStatus];

export const ARTICLE_STATUSES = Object.values(ArticleStatus);
