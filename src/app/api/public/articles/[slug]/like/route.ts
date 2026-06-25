import { ArticleStatus } from "@/generated/prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ slug: string }> };

export async function POST(_request: Request, context: RouteContext) {
  const { slug } = await context.params;

  try {
    const article = await prisma.article.findFirst({
      where: { slug, status: ArticleStatus.PUBLISHED },
      select: { id: true },
    });

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    const updated = await prisma.article.update({
      where: { id: article.id },
      data: { likeCount: { increment: 1 } },
      select: { likeCount: true },
    });

    return NextResponse.json({ likeCount: updated.likeCount });
  } catch (error) {
    console.error("[api/public/articles/[slug]/like POST]", error);
    return NextResponse.json(
      { error: "Failed to like article" },
      { status: 500 },
    );
  }
}
