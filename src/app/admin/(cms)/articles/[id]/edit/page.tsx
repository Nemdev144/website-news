import ArticleForm from "@/components/admin/ArticleForm";
import { ArticleStatus } from "@/types/cms";
import { toDatetimeLocal } from "@/lib/datetime";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface EditArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params;

  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      category: true,
      media: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] },
    },
  });

  if (!article) {
    notFound();
  }

  return (
    <ArticleForm
      articleId={article.id}
      redirectOnSave={false}
      initialContent={article.content}
      initialLegacyMedia={article.media.map((item) => ({
        url: item.url,
        title: item.title,
        caption: item.caption,
      }))}
      initialValues={{
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt ?? "",
        coverImage: article.coverImage ?? "",
        author: article.author,
        source: article.source ?? "",
        categoryId: article.categoryId,
        status: article.status as ArticleStatus,
        isFeatured: article.isFeatured,
        isHot: article.isHot,
        isMostRead: article.isMostRead,
        publishedAt: toDatetimeLocal(article.publishedAt),
      }}
    />
  );
}
