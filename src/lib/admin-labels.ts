import { ArticleStatus } from "@/types/cms";

export const ARTICLE_STATUS_LABELS: Record<ArticleStatus, string> = {
  [ArticleStatus.PUBLISHED]: "Đã xuất bản",
  [ArticleStatus.DRAFT]: "Bản nháp",
  [ArticleStatus.ARCHIVED]: "Lưu trữ",
};

export function articleStatusLabel(status: ArticleStatus | string): string {
  return ARTICLE_STATUS_LABELS[status as ArticleStatus] ?? status;
}
