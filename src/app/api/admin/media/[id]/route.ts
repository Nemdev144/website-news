import { MediaType } from "@/generated/prisma/client";
import { NextResponse } from "next/server";
import { isUnauthorized, requireAdmin } from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  const { id } = await context.params;

  try {
    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    return NextResponse.json({ media });
  } catch (error) {
    console.error("[api/admin/media/[id] GET]", error);
    return NextResponse.json({ error: "Failed to load media" }, { status: 500 });
  }
}

export async function PUT(request: Request, context: RouteContext) {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  const { id } = await context.params;

  try {
    const existing = await prisma.media.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    const body = (await request.json()) as {
      url?: string;
      title?: string;
      caption?: string;
      type?: MediaType;
      sortOrder?: number;
    };

    const url = body.url?.trim();
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const type =
      body.type && Object.values(MediaType).includes(body.type)
        ? body.type
        : existing.type;

    const media = await prisma.media.update({
      where: { id },
      data: {
        url,
        title: body.title?.trim() || null,
        caption: body.caption?.trim() || null,
        type,
        sortOrder: body.sortOrder ?? existing.sortOrder,
      },
    });

    return NextResponse.json({ media });
  } catch (error) {
    console.error("[api/admin/media/[id] PUT]", error);
    return NextResponse.json(
      { error: "Failed to update media" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  const { id } = await context.params;

  try {
    const existing = await prisma.media.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    await prisma.media.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[api/admin/media/[id] DELETE]", error);
    return NextResponse.json(
      { error: "Failed to delete media" },
      { status: 500 },
    );
  }
}
