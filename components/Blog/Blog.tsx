import styles from "./Blog.module.scss";

const posts = [
	{
		slug: "deno-whats-different-from-nodejs",
		title: "Deno: What's Different from Node.js",
		tags: ["Deno", "Node.js", "JavaScript"],
		url: "https://smazee.com/blog/deno-whats-different-from-nodejs",
	},
	{
		slug: "learn-whats-MongoDB-NoSQL",
		title: "Learn What's MongoDB NoSQL",
		tags: ["MongoDB", "NoSQL", "Databases"],
		url: "https://smazee.com/blog/learn-whats-MongoDB-NoSQL",
	},
	{
		slug: "When-not-to-use-Flutter",
		title: "When Not to Use Flutter",
		tags: ["Flutter", "Mobile", "Architecture"],
		url: "https://smazee.com/blog/When-not-to-use-Flutter",
	},
	{
		slug: "Implement-glassmorphism-in-your-flutter-app",
		title: "Implement Glassmorphism in Your Flutter App",
		tags: ["Flutter", "UI", "Design"],
		url: "https://smazee.com/blog/Implement-glassmorphism-in-your-flutter-app",
	},
];

export default function Blog() {
	return (
		<section className={styles.section} id="blog">
			<div className={styles.inner}>
				<div className={styles.heading}>
					<span className={styles.prompt}>/04</span>
					<h2>Writing</h2>
					<span className={styles.meta}>thoughts on systems, code & craft</span>
				</div>

				<div className={styles.blogList}>
					{posts.map((post) => (
						<a
							key={post.slug}
							href={post.url}
							target="_blank"
							rel="noreferrer"
							className={styles.blogRow}
						>
							<span className={styles.title}>{post.title}</span>
							<div className={styles.tags}>
								{post.tags.map((tag: string) => (
									<span key={tag} className={styles.tag}>
										#{tag}
									</span>
								))}
							</div>
							<span className={styles.readTime}>
								<span className={styles.arrow}>↗</span>
							</span>
						</a>
					))}
				</div>

				<div className={styles.viewMore}>
					<a href="/blog">
						View all articles ↗
					</a>
				</div>
			</div>
		</section>
	);
}
