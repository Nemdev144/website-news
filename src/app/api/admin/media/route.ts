import { MediaType } from "@/generated/prisma/client";
import { NextResponse } from "next/server";
import { isUnauthorized, requireAdmin } from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  try {
    const media = await prisma.media.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json({ media });
  } catch (error) {
    console.error("[api/admin/media GET]", error);
    return NextResponse.json({ error: "Failed to load media" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  try {
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
        : MediaType.IMAGE;

    const media = await prisma.media.create({
      data: {
        url,
        title: body.title?.trim() || null,
        caption: body.caption?.trim() || null,
        type,
        sortOrder: body.sortOrder ?? 0,
      },
    });

    return NextResponse.json({ media }, { status: 201 });
  } catch (error) {
    console.error("[api/admin/media POST]", error);
    return NextResponse.json({ error: "Failed to create media" }, { status: 500 });
  }
}
