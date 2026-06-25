import { NextResponse } from "next/server";
import { getCategoryPayload } from "@/lib/public-articles";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;

  try {
    const data = await getCategoryPayload(slug);
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
