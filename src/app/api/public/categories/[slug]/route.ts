import { NextResponse } from "next/server";
import { getCategoryPayload } from "@/lib/public-articles";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const { searchParams } = new URL(request.url);
  const page = Math.max(Number(searchParams.get("page") ?? 1), 1);
  const limit = Math.min(Math.max(Number(searchParams.get("limit") ?? 18), 1), 48);

  try {
    const data = await getCategoryPayload(slug, { page, limit });
    if (!data) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("[api/public/categories]", error);
    return NextResponse.json(
      { error: "Failed to load category data" },
      { status: 500 },
    );
  }
}
