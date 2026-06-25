import { NextResponse } from "next/server";
import { getHomePayload } from "@/lib/public-articles";

export async function GET() {
  try {
    const data = await getHomePayload();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[api/public/home]", error);
    return NextResponse.json(
      { error: "Failed to load homepage data" },
      { status: 500 },
    );
  }
}
