import { getAllPosts, Post } from "../../../lib/posts";
import { remark } from "remark";
import html from "remark-html";

type Props = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const posts = await getAllPosts();
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: "Bài viết không tồn tại",
      description: "Không tìm thấy nội dung.",
    };
  }

  return {
    title: `${post.title} | Ha Nam Huynh Nguyen Blog`,
    description: post.content.slice(0, 150),
    alternates: {
      canonical: `https://peterhuangnguyen.github.io/blog/${post.slug}`,
    },
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params; // ✅ không await
  const posts = await getAllPosts();
  const post = posts.find((p) => p.slug === slug);

  if (!post) return <p>Không tìm thấy bài viết</p>;

  const processedContent = await remark().use(html).process(post.content);
  const contentHtml = processedContent.toString();

  return (
    <article>
      <h1>{post.title}</h1>
      <p>
        <i>{post.date}</i>
      </p>
      <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </article>
  );
}
