import { articleCategories, getArticleCategory, type ArticleCategory } from "../../data/article-categories";
import { externalArticles } from "../../data/external-articles";
import SeoHead from "../../components/SeoHead";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import styles from "../../styles/Blog.module.scss";
import ScribbleTitle from "../../components/Blog/ScribbleTitle";
import CoverImage from "../../components/Blog/CoverImage";
import { useBlogTheme } from "../../components/Blog/useBlogTheme";
import { useState, useMemo, useRef, useEffect } from "react";




interface Post {
	slug: string;
	title: string;
	date: string;
	excerpt: string;
	tags: string[];
	readTime?: string;
	category: ArticleCategory;
	url: string;
	coverImage?: string;
	coverAlt?: string;
	pinned?: boolean;
}

const PINNED: Post = {
	slug: "is-software-engineering-dead",
	title: "Is Software Engineering Dead? Your Next Move Matters",
	date: "2026-11-03",
	excerpt:
		"AI is changing the value of writing code. Developers need to think beyond syntax and learn to turn real problems into useful products.",
	tags: ["AI", "Software Engineering", "Career"],
	readTime: "2 min",
	category: "career-productivity",
	url: "/blog/is-software-engineering-dead",
	coverImage: "/images/blog/software-dev-next.webp",
	coverAlt: "Future of software development with AI",
	pinned: true,
};

const POSTS: Post[] = externalArticles;
const DEFAULT_ARTICLE_COVER = "/assets/images/blog/article.webp";

const KINDS = [{ id: "all", label: "All", description: "All articles." }, ...articleCategories];



export default function Blog({ localPosts = [] }: { localPosts?: any[] }) {
	const [kind, setKind] = useState<string>("all");
	const [q, setQ] = useState("");
	const [activeTag, setActiveTag] = useState<string | null>(null);
	const { theme, setTheme } = useBlogTheme();
	const searchRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		function onKey(e: KeyboardEvent) {
			if (e.key === "/" && !e.ctrlKey && !e.metaKey && !e.altKey && !(e.target instanceof HTMLElement && (e.target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)))) {
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
			readTime: `${parseInt(p.readTime || '1', 10) || 1} min`,
			category: getArticleCategory(p.category).id,
			url: `/blog/${p.slug}`,
			...(p.coverImage ? { coverImage: p.coverImage } : {}),
			...(p.coverAlt ? { coverAlt: p.coverAlt } : {}),
		}));
		return [...locals, ...POSTS].sort(
			(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
		);
	}, [localPosts]);

	const filtered = useMemo(() => {
		const needle = q.trim().toLowerCase();
		return mergedPosts.filter((p) => {
			if (kind !== "all" && p.category !== kind) return false;
			if (activeTag && !p.tags.includes(activeTag)) return false;
			if (needle) {
				const hay = (p.title + " " + p.excerpt + " " + p.tags.join(" ") + " " + getArticleCategory(p.category).label).toLowerCase();
				if (!hay.includes(needle)) return false;
			}
			return true;
		});
	}, [mergedPosts, kind, q, activeTag]);



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
			<SeoHead title="Technical Writing — Pravin Kumar" description="Technical writing by Pravin Kumar on backend engineering, applied AI, system design, developer tools, and software careers." path="/blog" />

			<Header />

			<div className={styles.page} data-theme={theme}>
				<main className={styles.main} data-theme={theme}>

					{/* ── Hero ── */}
					<section className={styles.hero}>
						<h1 className={styles.heroTitle}>
							{/* <span className={styles.welcome}>Welcome to my</span> */}
							<ScribbleTitle /></h1>
					</section>

					{/* ── Featured ── */}
					<a
						className={styles.featured}
						href={PINNED.url}

					>
						{PINNED.coverImage && <CoverImage src={PINNED.coverImage} alt={PINNED.coverAlt || ""} variant="feature" />}
						<div className={styles.featEyebrow}>
							<span className={styles.featPin}> <span style={{ fontSize: "16px" }}>★</span> Featured Post</span>
							<span className={styles.dot} />
							<span>{PINNED.date}</span><span className={styles.dot} /><span>{getArticleCategory(PINNED.category).label}</span>
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
					</a>

					{/* ── Controls ── */}
					<div className={styles.controls}>
                        <div className={styles.categoryFilter}>
                          <select aria-label="Filter articles by category" value={kind} onChange={event => setKind(event.target.value)} title={kind === "all" ? "All categories" : getArticleCategory(kind).description}>
                            {KINDS.map(category => <option key={category.id} value={category.id}>{category.id === "all" ? "All categories" : category.label}</option>)}
                          </select>
                          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m6 8 4 4 4-4" /></svg>
                        </div>
						<label className={styles.search}>
							<svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4 4" /></svg>
							<input
								ref={searchRef}
								type="search"
								aria-label="Search articles"
								placeholder="Search articles…"
								value={q}
								onChange={(e) => setQ(e.target.value)}
							/>
							{q && (
								<button type="button" className={styles.searchClear} aria-label="Clear search" onClick={() => setQ("")}>
									✕
								</button>
							)}
						</label>
					</div>

					{/* ── Post list ── */}
					<div className={styles.list}>
						{filtered.length === 0 ? (
							<div className={styles.empty}>
								Nothing matches <b>{q ? `"${q}"` : activeTag ? `#${activeTag}` : kind === "all" ? "all articles" : getArticleCategory(kind).label}</b>.
								<button onClick={reset}>Clear filters</button>
							</div>
						) : (
								filtered.map((post: Post) => (
								<article
									key={post.slug}
									className={`${styles.postCard} ${styles.postCardWithCover}`}
								>
									<CoverImage src={post.coverImage || DEFAULT_ARTICLE_COVER} alt={post.coverImage ? post.coverAlt || "" : ""} variant="card" />
									<div className={styles.postContent}>
									<div className={styles.postEyebrow}>
										<span className={styles.postKind} data-category={post.category}>{getArticleCategory(post.category).label}</span>
										<span className={styles.dot} />
										<span>{post.date}</span>
										{post.readTime && <><span className={styles.dot} /><span>{post.readTime} read</span></>}
									</div>
									<h2 className={styles.postTitle}><a href={post.url} target={post.url.startsWith("https:") ? "_blank" : undefined} rel={post.url.startsWith("https:") ? "noopener noreferrer" : undefined}>{post.title}</a></h2>
									<p className={styles.postExcerpt}>{post.excerpt}</p>
									<div className={styles.postFoot}>
										<div className={styles.postTags}>
												{post.tags.map((t: string) => (
												<button
													key={t}
													className={styles.tag}
													data-on={activeTag === t}
													aria-pressed={activeTag === t}
													aria-label={`Filter by ${t}`}
													onClick={() => handleTag(t)}
												>
													{t}
												</button>
											))}
										</div>
									</div>
									</div>
								</article>
							))
						)}
					</div>

					<section className={styles.subscribe}>
                        <h2 className={styles.subTitle}>Follow the writing.</h2>
                        <p className={styles.subText}>Get new posts in your feed reader.</p>
                        <a className={styles.subBtn} href="/api/rss.xml">Subscribe via RSS</a>
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
		readTime: `${parseInt(p.readTime || '1', 10) || 1} min`,
		category: getArticleCategory(p.category).id,
		url: `/blog/${p.slug}`,
		...(p.coverImage ? { coverImage: p.coverImage } : {}),
		...(p.coverAlt ? { coverAlt: p.coverAlt } : {}),
	}));
	return {
		props: { localPosts: locals },
		revalidate: 3600, // ISR: regenerate every hour on Vercel
	};
}
