import Link from 'next/link';
import { getAllPosts } from '../lib/posts';

export default async function Home() {
  const posts = await getAllPosts() as Array<{
    slug: string;
    title?: string;
    content: string;
  }>;

  return (
    <main>
      <h1>My Blog</h1>
      <ul>
        {posts.map(post => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`}>{post.title ?? post.slug}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}


export const metadata = {
  title: "Ha Nam Huynh Nguyen Blog | React & Next.js",
  description: "Blog cá nhân của Ha Nam Huynh Nguyen, Middle Frontend Developer với 6+ năm kinh nghiệm React, Next.js, TypeScript. Chia sẻ kiến thức về hệ thống HR & tuyển dụng.",
  alternates: {
    canonical: "https://peterhuangnguyen.github.io/"
  },
  openGraph: {
    title: "Ha Nam Huynh Nguyen Blog",
    description: "Frontend Developer tại Đà Nẵng, Việt Nam. Chia sẻ kinh nghiệm React, Next.js, TypeScript.",
    url: "https://peterhuangnguyen.github.io/",
    type: "website",
    images: [
      {
        url: "https://peterhuangnguyen.github.io/assets/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ha Nam Huynh Nguyen Blog"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Ha Nam Huynh Nguyen Blog",
    description: "Blog cá nhân về React, Next.js, TypeScript.",
    images: ["https://peterhuangnguyen.github.io/assets/og-image.jpg"]
  }
};
