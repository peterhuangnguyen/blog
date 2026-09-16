import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const filePath = path.join(process.cwd(), "posts", `${slug}.md`);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const raw = fs.readFileSync(filePath, "utf-8");

    // Tách frontmatter (---...---) ra khỏi phần nội dung
    const match = raw.match(/^---\n[\s\S]*?\n---\n?/);
    const body = match ? raw.slice(match[0].length) : raw;

    return NextResponse.json({ slug, content: body.trimStart() });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
