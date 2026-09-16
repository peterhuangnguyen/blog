import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";

const postsDir = path.join(process.cwd(), "posts");

// Helper: generate slug from title
function generateSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // remove special chars
    .replace(/\s+/g, "-") // spaces → dash
    .replace(/--+/g, "-"); // collapse multiple dashes
}

// Lấy danh sách bài viết
export async function GET() {
  try {
    if (!fs.existsSync(postsDir)) {
      return NextResponse.json({ posts: [] });
    }
    const files = fs.readdirSync(postsDir);
    const mdFiles = files.filter((file) => file.endsWith(".md"));
    return NextResponse.json({ posts: mdFiles });
  } catch (error) {
    return NextResponse.json(
      { posts: [], error: String(error) },
      { status: 500 },
    );
  }
}

// Tạo bài viết mới
export async function POST(req: Request) {
  const { title, content } = await req.json();

  const slug = generateSlug(title);
  const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const filePath = path.join(postsDir, `${slug}.md`);
  const mdContent = `---
title: "${title}"
date: "${date}"
slug: "${slug}"
---

${content}
`;

  fs.writeFileSync(filePath, mdContent);
  return NextResponse.json({
    message: "Post created successfully!",
    slug,
    date,
  });
}

// Chỉnh sửa bài viết
export async function PUT(req: Request) {
  const { slug, content } = await req.json();
  const filePath = path.join(postsDir, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const match = raw.match(/^---\n[\s\S]*?\n---\n?/);
  const frontmatter = match ? match[0] : "";

  const newContent = `${frontmatter}\n${content.trim()}\n`;
  fs.writeFileSync(filePath, newContent);

  revalidatePath("/");
  revalidatePath(`/blog/${slug}`);

  return NextResponse.json({ message: "Post updated successfully!" });
}

// Xóa bài viết
export async function DELETE(req: Request) {
  const { slug } = await req.json();
  const filePath = path.join(postsDir, `${slug}.md`);
  fs.unlinkSync(filePath);
  return NextResponse.json({ message: "Post deleted successfully!" });
}
