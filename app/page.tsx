import Link from "next/link";
import Image from "next/image";
import { getAllPosts } from "../lib/posts";
import styles from "./Home.module.css";

export default async function Home() {
  const posts = (await getAllPosts()) as Array<{
    slug: string;
    title?: string;
    date?: string;
    content: string;
    category?: string;
    thumbnail?: string;
  }>;

  return (
    <main>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <Image src="/logo.png" alt="Ha Nam Blog" width={40} height={40} />
          <span>Ha Nam Blog</span>
        </div>
        <nav className={styles.nav}>
          <Link href="/">Home</Link>
          <Link href="/technology">Technology</Link>
          <Link href="/startups">Startups</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </header>

      {/* Banner */}
      <section className={styles.banner}>
        <Image
          src="/banner.png"
          alt="Blog Banner"
          width={1200}
          height={400}
          priority
        />
      </section>

      {/* Timeline Blog */}
      <section className={styles.timelineContainer}>
        <h2 className={styles.timelineTitle}>My Blog Timeline</h2>
        <div className={styles.timeline}>
          {posts.map((post) => (
            <div key={post.slug} className={styles.timelineItem}>
              <div className={styles.timelineDot} />
              <div className={styles.timelineContent}>
                <h3 className={styles.timelinePostTitle}>
                  <Link href={`/blog/${post.slug}`}>
                    {post.title ?? post.slug}
                  </Link>
                </h3>
                {post.date && (
                  <p className={styles.timelineDate}>
                    <i>{post.date}</i>
                  </p>
                )}
                <p className={styles.timelineExcerpt}>
                  {post.content.slice(0, 120)}...
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
