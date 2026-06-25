import { ArticleStatus } from "@/generated/prisma/client";
import { NextResponse } from "next/server";
import { isUnauthorized, requireAdmin } from "@/lib/admin-api";
import { contentBlocksAreValid, parseArticleContent } from "@/lib/article-blocks";
import { syncArticleMedia } from "@/lib/article-media";
import { generateSlug } from "@/lib/slug";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim();
    const status = searchParams.get("status") as ArticleStatus | null;
    const categoryId = searchParams.get("categoryId")?.trim();
    const page = Math.max(Number(searchParams.get("page") ?? 1), 1);
    const limit = Math.min(
      Math.max(Number(searchParams.get("limit") ?? 10), 1),
      50,
    );

    const where: {
      title?: { contains: string };
      status?: ArticleStatus;
      categoryId?: string;
    } = {};

    if (search) {
      where.title = { contains: search };
    }
    if (status && Object.values(ArticleStatus).includes(status)) {
      where.status = status;
    }
    if (categoryId) {
      where.categoryId = categoryId;
    }

    const [total, articles] = await Promise.all([
      prisma.article.count({ where }),
      prisma.article.findMany({
        where,
        include: { category: true },
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return NextResponse.json({
      articles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(Math.ceil(total / limit), 1),
      },
    });
  } catch (error) {
    console.error("[api/admin/articles GET]", error);
    return NextResponse.json(
      { error: "Failed to load articles" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  try {
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

    const duplicate = await prisma.article.findUnique({ where: { slug } });
    if (duplicate) {
      return NextResponse.json(
        { error: "An article with this slug already exists" },
        { status: 409 },
      );
    }

    const status = body.status ?? ArticleStatus.DRAFT;
    let publishedAt: Date | null = body.publishedAt
      ? new Date(body.publishedAt)
      : null;

    if (status === ArticleStatus.PUBLISHED && !publishedAt) {
      publishedAt = new Date();
    }

    const article = await prisma.article.create({
      data: {
        title,
        slug,
        excerpt: body.excerpt?.trim() || null,
        content,
        coverImage: body.coverImage?.trim() || null,
        author: body.author?.trim() || "Ban biên tập",
        source: body.source?.trim() || null,
        categoryId,
        status,
        isFeatured: body.isFeatured ?? false,
        isHot: body.isHot ?? false,
        isMostRead: body.isMostRead ?? false,
        publishedAt,
      },
      include: { category: true },
    });

    await syncArticleMedia(article.id, []);

    const articleWithMedia = await prisma.article.findUnique({
      where: { id: article.id },
      include: {
        category: true,
        media: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] },
      },
    });

    return NextResponse.json({ article: articleWithMedia }, { status: 201 });
  } catch (error) {
    console.error("[api/admin/articles POST]", error);
    return NextResponse.json(
      { error: "Failed to create article" },
      { status: 500 },
    );
  }
}
