import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import { extname, join } from "path";
import { NextResponse } from "next/server";
import { isUnauthorized, requireAdmin } from "@/lib/admin-api";

const MAX_UPLOAD_BYTES = 6 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Image file is required" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 },
      );
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { error: "Image must be 6MB or smaller" },
        { status: 400 },
      );
    }

    const extension = extname(file.name).toLowerCase() || ".jpg";
    const fileName = `${randomUUID()}${extension}`;
    const uploadDir = join(process.cwd(), "public", "uploads");
    const filePath = join(uploadDir, fileName);
    const bytes = Buffer.from(await file.arrayBuffer());

    await mkdir(uploadDir, { recursive: true });
    await writeFile(filePath, bytes);

    return NextResponse.json({
      url: `/uploads/${fileName}`,
      name: file.name,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error("[api/admin/uploads POST]", error);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}
