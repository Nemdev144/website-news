import { NextResponse } from "next/server";
import { isUnauthorized, requireAdmin } from "@/lib/admin-api";
import { generateSlug } from "@/lib/slug";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  const { id } = await context.params;

  try {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    return NextResponse.json({ category });
  } catch (error) {
    console.error("[api/admin/categories/[id] GET]", error);
    return NextResponse.json(
      { error: "Failed to load category" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, context: RouteContext) {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  const { id } = await context.params;

  try {
    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    const body = (await request.json()) as {
      name?: string;
      slug?: string;
      description?: string;
      sortOrder?: number;
      isActive?: boolean;
    };

    const name = body.name?.trim();
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const slug = (body.slug?.trim() || generateSlug(name)).toLowerCase();
    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const duplicate = await prisma.category.findFirst({
      where: { slug, id: { not: id } },
    });
    if (duplicate) {
      return NextResponse.json(
        { error: "A category with this slug already exists" },
        { status: 409 },
      );
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        description: body.description?.trim() || null,
        sortOrder: body.sortOrder ?? existing.sortOrder,
        isActive: body.isActive ?? existing.isActive,
      },
    });

    return NextResponse.json({ category });
  } catch (error) {
    console.error("[api/admin/categories/[id] PUT]", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  const { id } = await context.params;

  try {
    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    const body = (await request.json()) as { isActive?: boolean };

    const category = await prisma.category.update({
      where: { id },
      data: { isActive: body.isActive ?? existing.isActive },
    });

    return NextResponse.json({ category });
  } catch (error) {
    console.error("[api/admin/categories/[id] PATCH]", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  const { id } = await context.params;

  try {
    const existing = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { articles: true } } },
    });

    if (!existing) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    if (existing._count.articles > 0) {
      return NextResponse.json(
        { error: "Cannot delete a category that has articles" },
        { status: 409 },
      );
    }

    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[api/admin/categories/[id] DELETE]", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 },
    );
  }
}
