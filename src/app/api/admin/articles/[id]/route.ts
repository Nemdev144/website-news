import { ArticleStatus } from "@/generated/prisma/client";
import { NextResponse } from "next/server";
import { isUnauthorized, requireAdmin } from "@/lib/admin-api";
import { contentBlocksAreValid, parseArticleContent } from "@/lib/article-blocks";
import { generateSlug } from "@/lib/slug";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  const { id } = await context.params;

  try {
    const article = await prisma.article.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }
    return NextResponse.json({ article });
  } catch (error) {
    console.error("[api/admin/articles/[id] GET]", error);
    return NextResponse.json(
      { error: "Failed to load article" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, context: RouteContext) {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  const { id } = await context.params;

  try {
    const existing = await prisma.article.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    const body = (await request.json()) as {
      title?: string;
      slug?: string;
      excerpt?: string;
      content?: string;
      coverImage?: string;
      author?: string;
      source?: string;
      categoryId?: string;
      status?: ArticleStatus;
      isFeatured?: boolean;
      isHot?: boolean;
      isMostRead?: boolean;
      publishedAt?: string | null;
    };

    const title = body.title?.trim();
    const content = body.content?.trim();
    const categoryId = body.categoryId?.trim();

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    if (!content || !contentBlocksAreValid(parseArticleContent(content))) {
      return NextResponse.json(
        { error: "Content must include at least one paragraph or image" },
        { status: 400 },
      );
    }
    if (!categoryId) {
      return NextResponse.json({ error: "Category is required" }, { status: 400 });
    }

    const slug = (body.slug?.trim() || generateSlug(title)).toLowerCase();
    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 400 });
    }

    const duplicate = await prisma.article.findFirst({
      where: { slug, id: { not: id } },
    });
    if (duplicate) {
      return NextResponse.json(
        { error: "An article with this slug already exists" },
        { status: 409 },
      );
    }

    const status = body.status ?? existing.status;
    let publishedAt: Date | null =
      body.publishedAt !== undefined
        ? body.publishedAt
          ? new Date(body.publishedAt)
          : null
        : existing.publishedAt;

    if (status === ArticleStatus.PUBLISHED && !publishedAt) {
      publishedAt = new Date();
    }

    const article = await prisma.article.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt: body.excerpt?.trim() || null,
        content,
        coverImage: body.coverImage?.trim() || null,
        author: body.author?.trim() || existing.author,
        source: body.source?.trim() || null,
        categoryId,
        status,
        isFeatured: body.isFeatured ?? existing.isFeatured,
        isHot: body.isHot ?? existing.isHot,
        isMostRead: body.isMostRead ?? existing.isMostRead,
        publishedAt,
      },
      include: { category: true },
    });

    return NextResponse.json({ article });
  } catch (error) {
    console.error("[api/admin/articles/[id] PUT]", error);
    return NextResponse.json(
      { error: "Failed to update article" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  const { id } = await context.params;

  try {
    const existing = await prisma.article.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    await prisma.article.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[api/admin/articles/[id] DELETE]", error);
    return NextResponse.json(
      { error: "Failed to delete article" },
      { status: 500 },
    );
  }
}
