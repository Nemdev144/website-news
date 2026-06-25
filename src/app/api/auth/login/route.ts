import { NextResponse } from "next/server";
import {
  createAdminToken,
  setAdminCookie,
  verifyAdminLogin,
} from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      username?: string;
      password?: string;
    };

    const username = body.username?.trim();
    const password = body.password;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 },
      );
    }

    const user = await verifyAdminLogin(username, password);
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = createAdminToken(user);
    await setAdminCookie(token);

    return NextResponse.json({
      success: true,
      user: {
        userId: user.id,
        username: user.username,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    console.error("[api/auth/login]", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
