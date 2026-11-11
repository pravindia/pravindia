import { getArticleCategory, type ArticleCategory } from "../../data/article-categories";
import Link from "next/link";
import ScribbleTitle from "./ScribbleTitle";
import styles from "./Blog.module.scss";

export interface LatestPost {
  category: ArticleCategory;
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  url: string;
}

export default function Blog({ posts }: { posts: LatestPost[] }) {
  return (
    <section className={styles.section} id="blog" aria-labelledby="latest-writing">
      <div className={styles.inner}>
        <div className={styles.heading}>
          <h2 id="latest-writing"><ScribbleTitle /></h2>
        </div>
        <ul className={styles.blogList}>
          {posts.map(post => (
            <li key={post.slug}>
              <a href={post.url} className={styles.blogRow}>
                <div className={styles.content}>
                  <h3>{post.title}</h3>
                  <div className={styles.meta}>
                    <span>{getArticleCategory(post.category).label}</span><span aria-hidden="true">—</span>
                    <time dateTime={post.date}>{new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })}</time>
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ul>
        <div className={styles.more}><Link href="/blog" className={styles.viewMore}>All articles</Link></div>
        {posts.length === 0 && <p>New writing is on the way. Check back soon.</p>}
      </div>
    </section>
  );
}
