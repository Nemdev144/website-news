import { NextResponse } from "next/server";
import { getCurrentAdmin, type AdminJwtPayload } from "@/lib/auth";

export async function requireAdmin(): Promise<AdminJwtPayload | NextResponse> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return admin;
}

export function isUnauthorized(
  result: AdminJwtPayload | NextResponse,
): result is NextResponse {
  return result instanceof NextResponse;
}
