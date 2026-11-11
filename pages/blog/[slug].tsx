import { GetStaticPaths, GetStaticProps } from 'next';
import SeoHead from '../../components/SeoHead';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { getPostSlugs, getPostBySlug } from '../../lib/mdx';
import { MDXRemote } from 'next-mdx-remote';
import MDXComponents from '../../components/Blog/MDXComponents';
import styles from '../../styles/Blog.module.scss';
import CoverImage from '../../components/Blog/CoverImage';
import { siteUrl } from '../../lib/developers';
import { useBlogTheme } from '../../components/Blog/useBlogTheme';

const formatDate = (value: string) => new Date(`${value}T12:00:00Z`).toLocaleDateString('en-GB', {
	day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
});

export default function Post({ post }: any) {
	const { theme, setTheme } = useBlogTheme();
	return (
		<>
			<SeoHead title={`${post.frontmatter.title} — Pravin Kumar`} description={post.frontmatter.excerpt || `Article by Pravin Kumar: ${post.frontmatter.title}`} path={`/blog/${post.slug}`} type="article" publishedTime={post.frontmatter.date} structuredData={{ "@context": "https://schema.org", "@type": "BlogPosting", headline: post.frontmatter.title, description: post.frontmatter.excerpt, datePublished: post.frontmatter.date, dateModified: post.frontmatter.date, mainEntityOfPage: `${siteUrl}/blog/${post.slug}`, author: { "@type": "Person", name: "Pravin Kumar", url: siteUrl }, publisher: { "@type": "Person", name: "Pravin Kumar", url: siteUrl }, keywords: Array.isArray(post.frontmatter.tags) ? post.frontmatter.tags.join(", ") : undefined }} />
			<Header />
			<div className={styles.page} data-theme={theme}>
			<main className={styles.articlePage} data-theme={theme}>
				<h1>{post.frontmatter.title}</h1>
				<div className={styles.articleMeta}>
					<time dateTime={post.frontmatter.date}>{formatDate(post.frontmatter.date)}</time>
					{post.frontmatter.readTime && <><span aria-hidden="true">·</span><span>{String(post.frontmatter.readTime).includes('min') ? `${post.frontmatter.readTime} read` : `${post.frontmatter.readTime} min read`}</span></>}
				</div>
				<p className={styles.articleExcerpt}>{post.frontmatter.excerpt}</p>
				{post.frontmatter.answer && <aside className={styles.answerBox} aria-labelledby="quick-answer-title">
					<h2 id="quick-answer-title">Quick answer</h2>
					<p>{post.frontmatter.answer}</p>
				</aside>}
				{post.frontmatter.coverImage && <CoverImage src={post.frontmatter.coverImage} alt={post.frontmatter.coverAlt || ''} variant="article" />}
				<article className={styles.articleBody}>
					<MDXRemote {...post.mdxSource} components={MDXComponents} />
				</article>
			</main>
			<button
				className={styles.themeToggle}
				type="button"
				onClick={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')}
				aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
				title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
			>
				{theme === 'dark' ? '☀' : '☾'}
			</button>
			<Footer textEnter={() => { }} textLeave={() => { }} />
			</div>
		</>
	);
}

export const getStaticPaths: GetStaticPaths = async () => {
	const slugs = await getPostSlugs();
	const paths = slugs.map((s: string) => ({ params: { slug: s.replace(/\.mdx?$/, '') } }));
	return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const slug = (params?.slug as string) || '';
	const post = await getPostBySlug(slug);
	return {
		props: { post },
		revalidate: 3600, // ISR: regenerate every hour on Vercel
	};
};
