import { NextResponse } from "next/server";
import { clearAdminCookie } from "@/lib/auth";

export async function POST() {
  try {
    await clearAdminCookie();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[api/auth/logout]", error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
