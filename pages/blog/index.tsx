import Head from "next/head";
import Link from "next/link";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import styles from "../../styles/Blog.module.scss";

const posts = [
	{
		slug: "deno-whats-different-from-nodejs",
		title: "Deno: What's Different from Node.js",
		date: "Published",
		excerpt: "A practical comparison of Deno vs Node.js and when to choose each runtime.",
		tags: ["Deno", "Node.js", "JavaScript"],
		readTime: "Read",
		url: "https://smazee.com/blog/deno-whats-different-from-nodejs",
	},
	{
		slug: "learn-whats-MongoDB-NoSQL",
		title: "Learn What's MongoDB NoSQL",
		date: "Published",
		excerpt: "A beginner-friendly walkthrough of MongoDB and core NoSQL concepts.",
		tags: ["MongoDB", "NoSQL", "Databases"],
		readTime: "Read",
		url: "https://smazee.com/blog/learn-whats-MongoDB-NoSQL",
	},
	{
		slug: "When-not-to-use-Flutter",
		title: "When Not to Use Flutter",
		date: "Published",
		excerpt: "Scenarios where Flutter is not the best fit, with trade-offs and alternatives.",
		tags: ["Flutter", "Mobile", "Architecture"],
		readTime: "Read",
		url: "https://smazee.com/blog/When-not-to-use-Flutter",
	},
	{
		slug: "Implement-glassmorphism-in-your-flutter-app",
		title: "Implement Glassmorphism in Your Flutter App",
		date: "Published",
		excerpt: "Build a modern glassmorphism UI in Flutter with practical implementation tips.",
		tags: ["Flutter", "UI", "Design"],
		readTime: "Read",
		url: "https://smazee.com/blog/Implement-glassmorphism-in-your-flutter-app",
	},
	{
		slug: "try-tailwindcss-today-beginner-guide",
		title: "Try Tailwind CSS Today: Beginner Guide",
		date: "Published",
		excerpt: "Start quickly with Tailwind CSS and understand utility-first styling the right way.",
		tags: ["Tailwind", "CSS", "Frontend"],
		readTime: "Read",
		url: "https://smazee.com/blog/try-tailwindcss-today-beginner-guide",
	},
	{
		slug: "awesome-css-pseudo-class-and-functions",
		title: "Awesome CSS Pseudo Class and Functions",
		date: "Published",
		excerpt: "Useful pseudo-classes and modern CSS functions to write cleaner styles.",
		tags: ["CSS", "Frontend"],
		readTime: "Read",
		url: "https://smazee.com/blog/awesome-css-pseudo-class-and-functions",
	},
	{
		slug: "ci-cd-for-flutter",
		title: "CI/CD for Flutter",
		date: "Published",
		excerpt: "Set up a practical CI/CD pipeline for Flutter apps from commit to release.",
		tags: ["Flutter", "CI/CD", "DevOps"],
		readTime: "Read",
		url: "https://smazee.com/blog/ci-cd-for-flutter",
	},
];

const tagColors: Record<string, string> = {
	AI: "purple",
	MCP: "green",
	RAG: "green",
	LLMs: "blue",
	Learning: "yellow",
	"Next.js": "blue",
	Performance: "orange",
	"Web Dev": "blue",
	TypeScript: "blue",
	JavaScript: "yellow",
	Databases: "purple",
	Deno: "blue",
	"Node.js": "green",
	MongoDB: "green",
	NoSQL: "purple",
	Flutter: "blue",
	Mobile: "orange",
	Architecture: "yellow",
	UI: "blue",
	Design: "purple",
	Tailwind: "blue",
	CSS: "blue",
	Frontend: "blue",
	"CI/CD": "orange",
	DevOps: "orange",
};

export default function Blog() {
	const textEnter = () => { };
	const textLeave = () => { };

	return (
		<>
			<Header />
			<div className={styles.page}>
				<Head>
					<title>Blog — Pravin Kumar</title>
					<meta name="description" content="Writings on web development, AI, and things I'm learning." />
				</Head>

				<main className={styles.main}>
					<div className={styles.hero}>
						<span className={styles.prompt}>pravindia@blog:~$ ls -la ./posts</span>
						<h1 className={styles.title}>Blog</h1>
						<p className={styles.subtitle}>
							Thoughts on web dev, AI experiments, and things I&apos;m actively learning.
						</p>
					</div>

					<div className={styles.grid}>
						{posts.map((post) => {
							const isExternal = /^https?:\/\//i.test(post.url);
							const card = (
								<article key={post.slug} className={styles.card}>
									<div className={styles.cardMeta}>
										<time className={styles.date}>{post.date}</time>
										<span className={styles.readTime}>{post.readTime}</span>
									</div>

									<h2 className={styles.cardTitle}>{post.title}</h2>
									<p className={styles.excerpt}>{post.excerpt}</p>

									<div className={styles.footer}>
										<div className={styles.tags}>
											{post.tags.map((t) => (
												<span key={t} className={styles.tag} data-color={tagColors[t] || "blue"}>
													{t}
												</span>
											))}
										</div>
										<span className={styles.readMore}>read →</span>
									</div>
								</article>
							);

							if (isExternal) {
								return (
									<a
										key={post.slug}
										href={post.url}
										target="_blank"
										rel="noopener noreferrer"
										className={styles.cardLink}
									>
										{card}
									</a>
								);
							}

							return (
								<Link key={post.slug} href={post.url} className={styles.cardLink}>
									{card}
								</Link>
							);
						})}
					</div>
				</main>

				<Footer textEnter={textEnter} textLeave={textLeave} />
			</div>
		</>
	);
}
