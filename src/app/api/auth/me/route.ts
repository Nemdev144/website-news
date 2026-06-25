import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    return NextResponse.json({ user: admin });
  } catch (error) {
    console.error("[api/auth/me]", error);
    return NextResponse.json({ error: "Failed to get user" }, { status: 500 });
  }
}
