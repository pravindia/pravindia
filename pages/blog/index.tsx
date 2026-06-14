import Head from "next/head";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import styles from "../../styles/Blog.module.scss";
import { useState, useMemo, useRef, useEffect } from "react";
import Link from 'next/link';

type Kind = "blog" | "insights" | "case-study";

interface Post {
	slug: string;
	title: string;
	date: string;
	excerpt: string;
	tags: string[];
	readTime: string;
	kind: Kind;
	url: string;
	pinned?: boolean;
}

const PINNED: Post = {
	slug: "ci-cd-for-flutter",
	title: "CI/CD for Flutter",
	date: "2024",
	excerpt:
		"Set up a practical CI/CD pipeline for Flutter apps — from first commit to release build. Covers GitHub Actions, test runners, and artifact signing without the usual boilerplate tax.",
	tags: ["Flutter", "CI/CD", "DevOps"],
	readTime: "8 min",
	kind: "blog",
	url: "https://smazee.com/blog/ci-cd-for-flutter",
	pinned: true,
};

const POSTS: Post[] = [
	{
		slug: "deno-whats-different-from-nodejs",
		title: "Deno: What's Different from Node.js",
		date: "2024",
		excerpt: "A practical comparison of Deno vs Node.js — module resolution, permissions model, and when it's worth the switch.",
		tags: ["Deno", "Node.js", "JavaScript"],
		readTime: "6 min",
		kind: "blog",
		url: "https://smazee.com/blog/deno-whats-different-from-nodejs",
	},
	{
		slug: "learn-whats-MongoDB-NoSQL",
		title: "Learn What's MongoDB & NoSQL",
		date: "2024",
		excerpt: "A beginner-friendly walkthrough of MongoDB, documents, collections, and the core ideas behind NoSQL data modelling.",
		tags: ["MongoDB", "NoSQL", "Databases"],
		readTime: "5 min",
		kind: "insights",
		url: "https://smazee.com/blog/learn-whats-MongoDB-NoSQL",
	},
	{
		slug: "When-not-to-use-Flutter",
		title: "When Not to Use Flutter",
		date: "2023",
		excerpt: "Scenarios where Flutter is a poor fit, the real trade-offs, and what to reach for instead.",
		tags: ["Flutter", "Mobile", "Architecture"],
		readTime: "7 min",
		kind: "blog",
		url: "https://smazee.com/blog/When-not-to-use-Flutter",
	},
	{
		slug: "Implement-glassmorphism-in-your-flutter-app",
		title: "Implement Glassmorphism in Flutter",
		date: "2023",
		excerpt: "How we took a design concept from Figma to a production Flutter app — BlurFilter trade-offs, performance on mid-range Android, and the implementation decisions we'd change.",
		tags: ["Flutter", "UI", "Design"],
		readTime: "6 min",
		kind: "case-study",
		url: "https://smazee.com/blog/Implement-glassmorphism-in-your-flutter-app",
	},
	{
		slug: "try-tailwindcss-today-beginner-guide",
		title: "Try Tailwind CSS Today",
		date: "2023",
		excerpt: "Get moving fast with Tailwind and actually understand utility-first styling instead of just copying class names.",
		tags: ["Tailwind", "CSS", "Frontend"],
		readTime: "5 min",
		kind: "blog",
		url: "https://smazee.com/blog/try-tailwindcss-today-beginner-guide",
	},
	{
		slug: "awesome-css-pseudo-class-and-functions",
		title: "CSS Pseudo-Classes & Functions Worth Knowing",
		date: "2023",
		excerpt: "The most useful pseudo-classes and modern CSS functions that let you write dramatically less code.",
		tags: ["CSS", "Frontend"],
		readTime: "4 min",
		kind: "insights",
		url: "https://smazee.com/blog/awesome-css-pseudo-class-and-functions",
	},
];

const KINDS = [
	{ id: "all", label: "All" },
	{ id: "blog", label: "Blog" },
	{ id: "insights", label: "Insights" },
	{ id: "case-study", label: "Case Studies" },
] as const;

const totalReadMin = POSTS.reduce((sum, p) => sum + parseInt(p.readTime), 0) + parseInt(PINNED.readTime);

export default function Blog({ localPosts = [] }: { localPosts?: any[] }) {
	const [kind, setKind] = useState<string>("all");
	const [q, setQ] = useState("");
	const [activeTag, setActiveTag] = useState<string | null>(null);
	const [theme, setTheme] = useState<"dark" | "light">("dark");
	const [email, setEmail] = useState("");
	const [subscribed, setSubscribed] = useState(false);
	const searchRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const saved = localStorage.getItem("blog-theme");
		if (saved === "light" || saved === "dark") {
			setTheme(saved);
		} else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
			setTheme("light");
		}
	}, []);

	useEffect(() => {
		localStorage.setItem("blog-theme", theme);
	}, [theme]);

	useEffect(() => {
		function onKey(e: KeyboardEvent) {
			if (e.key === "/" && (document.activeElement as HTMLElement).tagName !== "INPUT") {
				e.preventDefault();
				searchRef.current?.focus();
			}
		}
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);

	// `localPosts` comes from getStaticProps and is merged with external POSTS
	const mergedPosts = useMemo(() => {
		const locals = (localPosts || []).map((p: any) => ({
			slug: p.slug,
			title: p.title,
			date: p.date || '',
			excerpt: p.excerpt || '',
			tags: p.tags || [],
			readTime: p.readTime || '1',
			kind: 'blog' as Kind,
			url: `/blog/${p.slug}`,
		}));
		return [...locals, ...POSTS];
	}, [localPosts]);

	const filtered = useMemo(() => {
		const needle = q.trim().toLowerCase();
		return mergedPosts.filter((p) => {
			if (kind !== "all" && p.kind !== kind) return false;
			if (activeTag && !p.tags.includes(activeTag)) return false;
			if (needle) {
				const hay = (p.title + " " + p.excerpt + " " + p.tags.join(" ")).toLowerCase();
				if (!hay.includes(needle)) return false;
			}
			return true;
		});
	}, [kind, q, activeTag]);



	function handleTag(tag: string) {
		setActiveTag((prev) => (prev === tag ? null : tag));
	}

	function reset() {
		setKind("all");
		setQ("");
		setActiveTag(null);
	}

	const textEnter = () => { };
	const textLeave = () => { };

	return (
		<>
			<Head>
				<title>Writing — Pravin Kumar</title>
				<meta name="description" content="Essays, notes, and short takes on frontend, mobile, and the craft of building things." />
				<link rel="alternate" type="application/rss+xml" title="Pravin Kumar Blog" href="/api/rss.xml" />
			</Head>

			<Header />

			<div className={styles.page} data-theme={theme}>
				<main className={styles.main} data-theme={theme}>

					{/* ── Hero ── */}
					<section className={styles.hero}>
						<span className={styles.eyebrow}>Writing</span>
						<h1 className={styles.heroTitle}>Field notes.</h1>
						<p className={styles.heroSub}>
							Blog posts, engineering insights, and real-world case studies —
							on frontend, mobile, and the craft of shipping things that last.
						</p>
					</section>

					{/* ── Featured ── */}
					<a
						className={styles.featured}
						href={PINNED.url}
						target="_blank"
						rel="noopener noreferrer"
					>
						<div className={styles.featEyebrow}>
							<span className={styles.featPin}> <span style={{ fontSize: "16px" }}>★</span> Case Study</span>
							<span className={styles.dot} />
							<span>{PINNED.date}</span>
							<span className={styles.dot} />
							<span>{PINNED.readTime} read</span>
						</div>
						<h2 className={styles.featTitle}>{PINNED.title}</h2>
						<p className={styles.featExcerpt}>{PINNED.excerpt}</p>
						<div className={styles.featTags}>
							{PINNED.tags.map((t) => (
								<span key={t} className={styles.tag}>{t}</span>
							))}
						</div>
						<span className={styles.featCta}>Read the story <span className={styles.arr}>›</span></span>
					</a>

					{/* ── Controls ── */}
					<div className={styles.controls}>
						<div className={styles.tabs}>
							{KINDS.map((k) => (
								<button
									key={k.id}
									className={styles.tab}
									data-on={kind === k.id}
									onClick={() => setKind(k.id)}
								>
									{k.label}
								</button>
							))}
						</div>
						<label className={styles.search}>
							<span className={styles.searchIcon}>⌕</span>
							<input
								ref={searchRef}
								type="text"
								placeholder="Search  /"
								value={q}
								onChange={(e) => setQ(e.target.value)}
							/>
							{q && (
								<button type="button" className={styles.searchClear} onClick={() => setQ("")}>
									✕
								</button>
							)}
						</label>
					</div>

					{/* ── Active tag bar ── */}
					{activeTag && (
						<div className={styles.tagBar}>
							Filtering by <b>#{activeTag}</b>
							<button onClick={() => setActiveTag(null)}>Clear</button>
						</div>
					)}

					{/* ── List meta ── */}
					<p className={styles.listMeta}>
						{filtered.length} {filtered.length === 1 ? "article" : "articles"} · newest first
					</p>

					{/* ── Post list ── */}
					<div className={styles.list}>
						{filtered.length === 0 ? (
							<div className={styles.empty}>
								Nothing matches <b>{q ? `"${q}"` : activeTag ? `#${activeTag}` : kind}</b>.
								<button onClick={reset}>Clear filters</button>
							</div>
						) : (
								filtered.map((post: Post) => (
								<a
									key={post.slug}
									className={styles.postCard}
									href={post.url}
									target="_blank"
									rel="noopener noreferrer"
								>
									<div className={styles.postEyebrow}>
										<span className={styles.postKind} data-kind={post.kind}>{post.kind}</span>
										<span className={styles.dot} />
										<span>{post.date}</span>
										<span className={styles.dot} />
										<span>{post.readTime} read</span>
									</div>
									<h3 className={styles.postTitle}>{post.title}</h3>
									<p className={styles.postExcerpt}>{post.excerpt}</p>
									<div className={styles.postFoot}>
										<div className={styles.postTags}>
												{post.tags.map((t: string) => (
												<span
													key={t}
													className={styles.tag}
													data-on={activeTag === t}
													onClick={(e) => { e.preventDefault(); handleTag(t); }}
												>
													{t}
												</span>
											))}
										</div>
										<span className={styles.postRead}>read →</span>
									</div>
								</a>
							))
						)}
					</div>

					{/* ── Newsletter ── */}
					<section className={styles.subscribe}>
						<h2 className={styles.subTitle}>One email when I publish.</h2>
						<p className={styles.subText}>
							No drip campaign, no tracking pixels. Just the post, in plaintext, roughly once a month.
						</p>
						{subscribed ? (
							<div className={styles.subOk}>
								<span className={styles.subCheck}>✓</span> You&rsquo;re on the list.
							</div>
						) : (
							<form
								className={styles.subForm}
								onSubmit={(e) => {
									// TODO: integrate with an actual email service instead of just showing the success state
									e.preventDefault();
									if (email.trim()) setSubscribed(true);
								}}
							>
								<input
									className={styles.subInput}
									type="email"
									placeholder="you@domain.dev"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
								<button className={styles.subBtn} type="submit">Subscribe</button>
							</form>
						)}
					</section>

				</main>

				{/* ── Theme toggle (blog only) ── */}
				<button
					className={styles.themeToggle}
					onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
					aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
					title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
				>
					{theme === "dark" ? "☀" : "☾"}
				</button>

				<Footer textEnter={textEnter} textLeave={textLeave} />
			</div>
		</>
	);
}

export async function getStaticProps() {
	let localPosts: any[] = [];
	try {
		const { getAllPosts } = await import('../../lib/mdx');
		localPosts = await getAllPosts();
	} catch (e) {
		// ignore
	}
	const locals = localPosts.map((p: any) => ({
		slug: p.slug,
		title: p.title,
		date: p.date || '',
		excerpt: p.excerpt || '',
		tags: p.tags || [],
		readTime: p.readTime || '1',
		kind: 'blog' as Kind,
		url: `/blog/${p.slug}`,
	}));
	return {
		props: { localPosts: locals },
		revalidate: 3600, // ISR: regenerate every hour on Vercel
	};
}
