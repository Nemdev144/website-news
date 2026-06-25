import { MediaType } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export interface ArticleMediaInput {
  url: string;
  caption?: string;
  title?: string;
  sortOrder?: number;
}

export async function syncArticleMedia(
  articleId: string,
  items: ArticleMediaInput[],
) {
  const validItems = items
    .map((item, index) => ({
      url: item.url.trim(),
      caption: item.caption?.trim() || null,
      title: item.title?.trim() || null,
      sortOrder: item.sortOrder ?? index,
    }))
    .filter((item) => item.url.length > 0);

  await prisma.media.deleteMany({ where: { articleId } });

  if (validItems.length === 0) {
    return;
  }

  await prisma.media.createMany({
    data: validItems.map((item) => ({
      url: item.url,
      caption: item.caption,
      title: item.title,
      type: MediaType.IMAGE,
      sortOrder: item.sortOrder,
      articleId,
    })),
  });
}
