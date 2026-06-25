import { NextResponse } from "next/server";
import { getSearchPayload } from "@/lib/public-articles";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";

  if (!query) {
    return NextResponse.json({ query: "", results: [], count: 0 });
  }

  try {
    const data = await getSearchPayload(query);
    return NextResponse.json(data);
  } catch (error) {
    console.error("[api/public/search]", error);
    return NextResponse.json(
      { error: "Failed to search articles" },
      { status: 500 },
    );
  }
}
