import { NextResponse } from "next/server";
import { getArticlePayload } from "@/lib/public-articles";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const incrementViews =
    new URL(request.url).searchParams.get("incrementViews") !== "false";

  try {
    const data = await getArticlePayload(slug, { incrementViews });
    if (!data) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("[api/public/articles]", error);
    return NextResponse.json(
      { error: "Failed to load article data" },
      { status: 500 },
    );
  }
}
